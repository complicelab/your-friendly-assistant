-- Cómplice Lab: commercial-stage telemetry from the existing Railway agent.
-- Additive migration for the EXISTING Lovable Cloud database; no new database,
-- customer deletion, reclassification of old records, or outbound WhatsApp.
-- Apply once after 20261112_whatsapp_ia_inbound.sql.
-- Do not enable new Railway emitters until this migration + Edge function deploy.
--
-- "Abandonado" requires a documented event with at least two completed
-- follow-ups and >=48h since the last follow-up; silence alone is not proof.
-- A subsequent explicit reactivation clears the current abandoned status,
-- preserving the earlier event history for loss/recovery measurements.

alter table public.crm_contacts drop constraint if exists crm_contacts_status_check;
alter table public.crm_contacts add constraint crm_contacts_status_check
  check (status in (
    'nuevo','diagnostico_solicitado','requiere_atencion','no_interesado',
    'no_contactar','contactado','calificado','cita_agendada','propuesta',
    'seguimiento','ganado','perdido','abandonado'
  ));

create unique index if not exists crm_activities_whatsapp_event_unique
  on public.crm_activities(external_id)
  where external_id is not null and channel='whatsapp_ia';

create or replace function public.crm_apply_commercial_agent_event(
  p_event_type text, p_wa_id text, p_timestamp timestamptz, p_payload jsonb
) returns uuid
language plpgsql security definer set search_path=public,extensions
as $$
declare
  v_phone text := regexp_replace(coalesce(p_wa_id,''),'[^0-9]','','g');
  v_message_id text := trim(coalesce(p_payload->>'message_id',''));
  v_fingerprint text;
  v_contact public.crm_contacts%rowtype;
  v_match_count integer;
  v_older_time timestamptz;
  v_active_meeting boolean;
  v_new_status text;
  v_follow_ups integer;
  v_last_followup timestamptz;
  v_evidence text := coalesce(p_payload->>'evidence_type','');
  v_reason text := left(trim(coalesce(p_payload->>'motivo','')),240);
  v_label text;
begin
  if auth.role() is distinct from 'service_role' then
    raise exception 'not authorized';
  end if;
  if p_event_type not in (
      'interes_confirmado','seguimiento_pendiente',
      'prospecto_abandonado','prospecto_reactivado'
    ) or p_payload is null or jsonb_typeof(p_payload)<>'object'
    or v_phone !~ '^[0-9]{8,15}$'
    or v_message_id !~ '^[A-Za-z0-9_.:/+=-]{6,180}$'
    or p_timestamp is null
    or p_timestamp>now()+interval '5 minutes'
    or p_timestamp<now()-interval '7 days'
    or length(v_reason)>240
  then
    raise exception 'invalid commercial event';
  end if;

  -- Explicit abandonment needs substantiated, completed follow-ups,
  -- not just a stalled conversation.
  if p_event_type='prospecto_abandonado' then
    if v_evidence <> 'dos_seguimientos_sin_respuesta'
       or coalesce(p_payload->>'follow_up_count','') !~ '^[0-9]{1,3}$'
       or coalesce(p_payload->>'last_followup_at','') !~
          '^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}'
       or nullif(v_reason,'') is null
    then
      raise exception 'abandonment requires verified follow-up evidence';
    end if;
    if (p_payload->>'follow_up_count')::integer<2 then
      raise exception 'at least two completed follow-ups required';
    end if;
    begin
      v_last_followup := (p_payload->>'last_followup_at')::timestamptz;
    exception when others then
      raise exception 'invalid last follow-up timestamp';
    end;
    if v_last_followup>p_timestamp
      or p_timestamp<v_last_followup+interval '48 hours' then
      raise exception 'abandonment interval insufficient';
    end if;
  end if;

  -- Use the exact source message identifier across ALL commercial event types.
  v_fingerprint := 'commercial:'||encode(digest(v_message_id,'sha256'),'hex');
  perform pg_advisory_xact_lock(hashtextextended('commercial:'||v_phone,0));
  if exists(select 1 from public.crm_activities where channel='whatsapp_ia'
      and external_id=v_fingerprint) then
    select c.id into v_contact.id from public.crm_activities a
      join public.crm_contacts c on c.id=a.contact_id
     where a.channel='whatsapp_ia' and a.external_id=v_fingerprint
       and regexp_replace(coalesce(c.whatsapp,''),'[^0-9]','','g')=v_phone;
    if v_contact.id is null then
      raise exception 'message_id belongs to another contact';
    end if;
    return v_contact.id;
  end if;

  select count(*) into v_match_count from public.crm_contacts c
    where regexp_replace(coalesce(c.whatsapp,''),'[^0-9]','','g')=v_phone;
  if v_match_count<>1 then
    raise exception 'commercial event needs exactly one existing contact';
  end if;
  select * into v_contact from public.crm_contacts c
    where regexp_replace(coalesce(c.whatsapp,''),'[^0-9]','','g')=v_phone
    for update;

  -- Ignore an old event after a newer commercial update, never rewrite history.
  select max((a.metadata->>'event_timestamp')::timestamptz) into v_older_time
    from public.crm_activities a
   where a.contact_id=v_contact.id
     and a.channel='whatsapp_ia'
     and a.activity_type in (
       'interes_confirmado','seguimiento_pendiente',
       'prospecto_abandonado','prospecto_reactivado'
     )
     and a.metadata ? 'event_timestamp';
  if v_older_time is not null and p_timestamp<v_older_time then
    raise exception 'stale commercial event';
  end if;

  if v_contact.status in ('ganado','no_contactar','perdido','no_interesado') then
    raise exception 'terminal sales status cannot be changed by agent';
  end if;

  select exists(
    select 1 from public.crm_meetings m
    where m.contact_id=v_contact.id
      and m.starts_at>=now()
      and m.status in ('pendiente','confirmada')
  ) into v_active_meeting;

  if p_event_type='prospecto_abandonado' then
    if v_active_meeting or v_contact.status in ('cita_agendada','propuesta')
       then raise exception 'do not abandon an active booked or proposal contact'; end if;
    v_new_status:='abandonado';
    v_label:='Abandono identificado tras seguimientos documentados.';
  elsif p_event_type='prospecto_reactivado' then
    if v_contact.status<>'abandonado' then
      raise exception 'reactivation requires a previously abandoned contact';
    end if;
    v_new_status:='contactado';
    v_label:='Prospecto reactivado por interacción real.';
  elsif p_event_type='interes_confirmado' then
    v_new_status:=case when v_contact.status in
      ('nuevo','contactado','diagnostico_solicitado','requiere_atencion','abandonado')
      then 'calificado' else v_contact.status end;
    v_label:='Prospecto expresó interés comercial.';
  else
    v_new_status:=case when v_contact.status in ('nuevo','contactado','calificado')
      then 'seguimiento' else v_contact.status end;
    v_label:='Seguimiento comercial pendiente.';
  end if;

  -- Keep old dates and source; no fictitious bookings or sold opportunities.
  update public.crm_contacts
    set status=v_new_status,
        last_contact_at=case when p_event_type in
          ('interes_confirmado','prospecto_reactivado') then p_timestamp
          else last_contact_at end,
        updated_at=now()
   where id=v_contact.id;

  insert into public.crm_activities(
    contact_id,activity_type,channel,direction,actor_type,
    body,external_id,metadata,created_at
  ) values (
    v_contact.id,p_event_type,'whatsapp_ia','inbound','agent',
    v_label,v_fingerprint,
    jsonb_build_object(
      'event_timestamp',p_timestamp,
      'evidence_type',nullif(left(v_evidence,70),''),
      'follow_up_count',case when p_event_type='prospecto_abandonado'
        then p_payload->>'follow_up_count' else null end,
      'last_followup_at',case when p_event_type='prospecto_abandonado'
        then p_payload->>'last_followup_at' else null end,
      'motivo',nullif(v_reason,'')
    ),
    now()
  ) on conflict do nothing;
  return v_contact.id;
end;
$$;

revoke all on function public.crm_apply_commercial_agent_event(
 text,text,timestamptz,jsonb) from public,anon,authenticated;
grant execute on function public.crm_apply_commercial_agent_event(
 text,text,timestamptz,jsonb) to service_role;
