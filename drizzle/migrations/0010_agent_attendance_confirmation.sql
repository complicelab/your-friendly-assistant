-- Cómplice Lab: una reserva NO equivale a un "sí, asistiré".
-- El agente externo gestiona recordatorio ~24 h antes y comunica eventos
-- estructurados, autenticados e idempotentes. No se envían mensajes desde SQL.
-- Sin borrar reuniones, clientes, actividades ni conexiones Google existentes.

alter table public.crm_meetings
  add column if not exists attendance_status text not null default 'por_confirmar',
  add column if not exists attendance_reminder_at timestamptz,
  add column if not exists attendance_responded_at timestamptz,
  add column if not exists attendance_response_text text,
  add column if not exists attendance_response_source text,
  add column if not exists calendar_cancel_pending boolean not null default false,
  add column if not exists calendar_cancel_synced_at timestamptz;

alter table public.crm_meetings drop constraint if exists crm_meetings_attendance_status_check;
alter table public.crm_meetings add constraint crm_meetings_attendance_status_check
  check(attendance_status in ('por_confirmar','confirmada','no_asistira','requiere_atencion'));
create index if not exists crm_meetings_attendance_upcoming_idx
  on public.crm_meetings(starts_at,attendance_status) where status not in ('realizada','cancelada','no_asistio');

-- Pending booking is not proof of a reply to the agent.
alter table public.crm_meetings drop constraint if exists crm_meetings_status_check;
alter table public.crm_meetings add constraint crm_meetings_status_check
  check(status in ('pendiente','confirmada','cancelada','realizada','no_asistio'));

create or replace function public.crm_guard_meeting_attendance()
returns trigger language plpgsql security definer set search_path=public
as $$
begin
  if tg_op='INSERT' then
    if new.status='confirmada' and new.source in ('web','google_calendar') then
      new.status:='pendiente';
    end if;
    return new;
  end if;
  -- Only the server agent integration can assert an attendance decision.
  if auth.role() is distinct from 'service_role' then
    if new.attendance_status is distinct from old.attendance_status
      or new.attendance_reminder_at is distinct from old.attendance_reminder_at
      or new.attendance_responded_at is distinct from old.attendance_responded_at
      or new.attendance_response_text is distinct from old.attendance_response_text
      or new.attendance_response_source is distinct from old.attendance_response_source
      or new.calendar_cancel_pending is distinct from old.calendar_cancel_pending
      or (new.status='confirmada' and old.status is distinct from 'confirmada'
          and old.attendance_status<>'confirmada')
    then
      raise exception 'La confirmación de asistencia proviene del agente verificado.';
    end if;
  end if;
  -- On a changed appointment, previous RSVP is no longer a valid confirmation.
  if new.starts_at is distinct from old.starts_at
     and old.attendance_status <> 'no_asistira'
     and old.status not in ('realizada','cancelada','no_asistio') then
    new.attendance_status:='por_confirmar';
    new.attendance_reminder_at:=null;
    new.attendance_responded_at:=null;
    new.attendance_response_text:=null;
    new.attendance_response_source:=null;
    new.status:='pendiente';
  end if;
  return new;
end;
$$;
revoke all on function public.crm_guard_meeting_attendance() from public,anon,authenticated;
drop trigger if exists crm_guard_meeting_attendance on public.crm_meetings;
create trigger crm_guard_meeting_attendance before insert or update
on public.crm_meetings for each row execute function public.crm_guard_meeting_attendance();

-- Reclassify only *future* diagnostic reservations lacking verifiable attendance
-- evidence. Historical meetings and outcomes stay untouched.
update public.crm_meetings set status='pendiente'
 where starts_at>now() and status='confirmada' and meeting_type='diagnostico'
   and source in ('web','google_calendar')
   and attendance_responded_at is null;

-- Exactly-once consumer for the WhatsApp agent's 24-hour reminder and reply.
-- No new contacts are ever created by these events.
create or replace function public.crm_apply_attendance_agent_event(
 p_event_type text,p_wa_id text,p_timestamp timestamptz,p_payload jsonb
) returns uuid
language plpgsql security definer set search_path=public
as $$
declare
  v_meeting public.crm_meetings%rowtype;
  v_customer_phone text;
  v_phone text:=regexp_replace(coalesce(p_wa_id,''),'[^0-9]','','g');
  v_mid uuid;
  v_message_id text:=trim(coalesce(p_payload->>'message_id',''));
  v_fingerprint text;
  v_note text;
  v_new_status text;
  v_new_attendance text;
begin
  if auth.role()<>'service_role' then raise exception 'not authorized'; end if;
  if p_event_type not in ('recordatorio_asistencia_enviado','asistencia_confirmada','asistencia_rechazada','asistencia_dudosa')
     or p_payload is null or jsonb_typeof(p_payload)<>'object'
     or v_phone !~ '^[0-9]{8,15}$'
     or v_message_id !~ '^[A-Za-z0-9_.:-]{6,180}$'
     or coalesce(p_payload->>'meeting_id','') !~
         '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$'
     or p_timestamp is null or p_timestamp>now()+interval '5 minutes'
     or p_timestamp<now()-interval '7 days'
  then raise exception 'invalid attendance event'; end if;
  v_mid:=(p_payload->>'meeting_id')::uuid;
  select * into v_meeting from public.crm_meetings where id=v_mid for update;
  if not found then raise exception 'meeting not found'; end if;
  select regexp_replace(coalesce(c.whatsapp,''),'[^0-9]','','g') into v_customer_phone
    from public.crm_contacts c where c.id=v_meeting.contact_id;
  if v_phone not in (regexp_replace(coalesce(v_meeting.attendee_whatsapp,''),'[^0-9]','','g'),
                      coalesce(v_customer_phone,'')) then
    raise exception 'phone does not belong to appointment'; end if;
  if v_meeting.meeting_type<>'diagnostico'
    or p_timestamp<v_meeting.starts_at-interval '36 hours'
    or p_timestamp>v_meeting.starts_at
    or v_meeting.status in ('realizada','no_asistio')
  then raise exception 'event outside appointment confirmation window'; end if;
  v_fingerprint:='attendance:'||
    encode(digest(v_mid::text||'|'||v_message_id,'sha256'),'hex');
  if exists(select 1 from public.crm_activities where channel='whatsapp_ia'
            and external_id=v_fingerprint) then return v_mid; end if;
  if p_event_type='recordatorio_asistencia_enviado' then
    if v_meeting.attendance_reminder_at is null and v_meeting.status<>'cancelada' then
      update public.crm_meetings set attendance_reminder_at=p_timestamp where id=v_mid;
    end if;
    v_note:='El agente registró el envío del recordatorio de asistencia (entrega no verificada).';
  else
    -- Reply MUST be tied to a previously recorded reminder for this exact meeting.
    if v_meeting.attendance_reminder_at is null or p_timestamp<v_meeting.attendance_reminder_at
      then raise exception 'no matching reminder for this meeting'; end if;
    -- Never allow a stale reply or a later unsolicited "yes" to reopen a cancelled appointment.
    if (v_meeting.attendance_responded_at is not null
        and p_timestamp<=v_meeting.attendance_responded_at)
        or v_meeting.attendance_status='no_asistira'
        or v_meeting.status='cancelada' then
      return v_mid;
    end if;
    v_new_attendance:=case p_event_type
      when 'asistencia_confirmada' then 'confirmada'
      when 'asistencia_rechazada' then 'no_asistira' else 'requiere_atencion' end;
    v_new_status:=case p_event_type
      when 'asistencia_confirmada' then 'confirmada'
      when 'asistencia_rechazada' then 'cancelada' else 'pendiente' end;
    v_note:=case p_event_type
      when 'asistencia_confirmada' then 'El cliente confirmó al agente que asistirá.'
      when 'asistencia_rechazada' then 'El cliente informó al agente que no asistirá.'
      else 'El cliente tiene dudas sobre la asistencia; necesita seguimiento.' end;
    update public.crm_meetings set
       status=v_new_status, attendance_status=v_new_attendance,
       attendance_responded_at=p_timestamp,
       attendance_response_source='whatsapp_ia',
       attendance_response_text=left(nullif(trim(coalesce(p_payload->>'respuesta_texto','')),''),500),
       calendar_cancel_pending=(p_event_type='asistencia_rechazada'
          and v_meeting.external_calendar_id is not null),
       updated_at=now()
     where id=v_mid;
  end if;
  insert into public.crm_activities(
    contact_id,activity_type,channel,direction,actor_type,body,external_id,metadata,created_at
  ) values(
    v_meeting.contact_id,p_event_type,'whatsapp_ia','inbound','agent',
    v_note,v_fingerprint,
    jsonb_build_object('meeting_id',v_mid,'event_timestamp',p_timestamp,
      'message_id',v_message_id,'respuesta_texto',left(coalesce(p_payload->>'respuesta_texto',''),500)),
    now()
  ) on conflict do nothing;
  return v_mid;
end;
$$;
revoke all on function public.crm_apply_attendance_agent_event(text,text,timestamptz,jsonb)
 from public,anon,authenticated;
grant execute on function public.crm_apply_attendance_agent_event(text,text,timestamptz,jsonb)
 to service_role;
