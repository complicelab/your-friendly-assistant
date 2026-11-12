-- WhatsApp IA inbound events: reuses crm_contacts and crm_activities.
-- Run after 20261108_complice_lab_crm.sql. No browser write permission is granted.
alter table public.crm_contacts drop constraint if exists crm_contacts_status_check;
alter table public.crm_contacts add constraint crm_contacts_status_check
check (status in ('nuevo','diagnostico_solicitado','requiere_atencion','no_interesado','no_contactar','contactado','calificado','cita_agendada','propuesta','seguimiento','ganado','perdido'));

create unique index if not exists crm_activities_whatsapp_event_unique
on public.crm_activities(external_id) where external_id is not null and channel = 'whatsapp_ia';

create or replace function public.crm_receive_whatsapp_event(p_event_type text, p_wa_id text, p_timestamp timestamptz, p_payload jsonb)
returns uuid language plpgsql security definer set search_path = public
as $$
declare
  v_phone text := '+' || regexp_replace(coalesce(p_wa_id,''),'[^0-9]','','g');
  v_contact public.crm_contacts%rowtype;
  v_id uuid;
  v_metadata jsonb;
  v_update jsonb := '{}'::jsonb;
  v_event_id text;
  v_status text;
  v_rank integer;
  v_new_rank integer;
  v_label text;
  v_body text;
  v_key text;
  v_value text;
begin
  if auth.role() <> 'service_role' then raise exception 'not authorized'; end if;
  if p_event_type not in ('lead_creado','diagnostico_solicitado','cita_confirmada','escalado_a_humano','no_interesado','opt_out')
    or length(v_phone) not between 9 and 16 or p_timestamp is null or p_payload is null or jsonb_typeof(p_payload) <> 'object'
  then raise exception 'invalid event'; end if;
  v_event_id := encode(digest(v_phone || '|' || p_event_type || '|' || p_timestamp::text || '|' || p_payload::text,'sha256'),'hex');
  perform pg_advisory_xact_lock(hashtextextended(v_phone, 0));
  select * into v_contact from public.crm_contacts where regexp_replace(coalesce(whatsapp,''),'[^0-9]','','g') = substring(v_phone from 2) order by created_at limit 1 for update;
  if not found then
    insert into public.crm_contacts(full_name,whatsapp,source,owner_email,consent_service,consent_marketing,metadata,status)
    values (coalesce(nullif(trim(p_payload->>'nombre'),''),'Contacto de WhatsApp'),v_phone,'whatsapp_ia','complicelab@gmail.com',false,false,'{}'::jsonb,'nuevo')
    returning * into v_contact;
  end if;
  v_id := v_contact.id;
  if exists(select 1 from public.crm_activities where external_id = v_event_id and channel = 'whatsapp_ia') then return v_id; end if;
  v_metadata := coalesce(v_contact.metadata, '{}'::jsonb);
  for v_key, v_value in select key, value from jsonb_each_text(p_payload) loop
    if v_key in ('redes','pais_ciudad','profesionales_o_sedes','tiene_pagina_web','urgencia','tema','detalle','motivo','fecha','mensaje','origen')
      and nullif(trim(v_value),'') is not null then
        v_metadata := jsonb_set(v_metadata,array['whatsapp_ia',v_key],to_jsonb(left(trim(v_value),2000)),true);
    end if;
  end loop;
  v_metadata := jsonb_set(v_metadata,'{whatsapp_ia,received}', 'true'::jsonb, true);
  if p_event_type = 'opt_out' then v_metadata := jsonb_set(v_metadata,'{whatsapp_ia,no_contactar}','true'::jsonb,true); end if;
  if nullif(trim(p_payload->>'nombre'),'') is not null then v_update:=v_update||jsonb_build_object('full_name',left(trim(p_payload->>'nombre'),180)); end if;
  if nullif(trim(p_payload->>'empresa'),'') is not null then v_update:=v_update||jsonb_build_object('brand_name',left(trim(p_payload->>'empresa'),180)); end if;
  if nullif(trim(p_payload->>'tipo_negocio'),'') is not null then v_update:=v_update||jsonb_build_object('business_type',left(trim(p_payload->>'tipo_negocio'),180)); end if;
  if nullif(trim(p_payload->>'resumen_necesidad'),'') is not null then v_update:=v_update||jsonb_build_object('need',left(trim(p_payload->>'resumen_necesidad'),800)); end if;
  if nullif(trim(p_payload->>'interes'),'') is not null then v_update:=v_update||jsonb_build_object('solution_interest',left(trim(p_payload->>'interes'),240)); end if;
  if v_contact.source = 'whatsapp_ia' and nullif(trim(p_payload->>'origen'),'') is not null then
    v_update := v_update||jsonb_build_object('source_detail',left(trim(p_payload->>'origen'),180));
  end if;
  if v_contact.source = 'whatsapp_ia' or v_contact.source is null then v_update := v_update||jsonb_build_object('source','whatsapp_ia'); end if;
  v_status := case p_event_type when 'lead_creado' then 'nuevo' when 'diagnostico_solicitado' then 'diagnostico_solicitado'
    when 'cita_confirmada' then 'cita_agendada' when 'escalado_a_humano' then 'requiere_atencion'
    when 'no_interesado' then 'no_interesado' else 'no_contactar' end;
  v_rank := case v_contact.status when 'nuevo' then 0 when 'diagnostico_solicitado' then 1 when 'contactado' then 2
    when 'calificado' then 3 when 'requiere_atencion' then 4 when 'cita_agendada' then 5 when 'seguimiento' then 6
    when 'propuesta' then 7 when 'ganado' then 8 when 'perdido' then 8 when 'no_interesado' then 9 when 'no_contactar' then 10 else 0 end;
  v_new_rank := case v_status when 'nuevo' then 0 when 'diagnostico_solicitado' then 1 when 'requiere_atencion' then 4
    when 'cita_agendada' then 5 when 'no_interesado' then 9 else 10 end;
  if v_new_rank >= v_rank then v_update := v_update||jsonb_build_object('status',v_status); end if;
  v_update := v_update||jsonb_build_object('metadata',v_metadata);
  update public.crm_contacts set
    full_name=coalesce(v_update->>'full_name',full_name), brand_name=coalesce(v_update->>'brand_name',brand_name),
    business_type=coalesce(v_update->>'business_type',business_type), need=coalesce(v_update->>'need',need),
    solution_interest=coalesce(v_update->>'solution_interest',solution_interest),
    source=coalesce(v_update->>'source',source), source_detail=coalesce(v_update->>'source_detail',source_detail),
    status=coalesce(v_update->>'status',status), metadata=v_metadata
  where id=v_id;
  v_label := case p_event_type when 'lead_creado' then 'Prospecto registrado' when 'diagnostico_solicitado' then 'Pidió diagnóstico'
    when 'cita_confirmada' then 'Cita confirmada por el agente' when 'escalado_a_humano' then 'Solicita atención humana'
    when 'no_interesado' then 'Indicó que no le interesa' else 'Pidió no recibir más mensajes' end;
  v_body := v_label;
  if nullif(trim(p_payload->>'resumen_necesidad'),'') is not null then v_body := v_body || ' — necesidad: ' || left(trim(p_payload->>'resumen_necesidad'),500); end if;
  if p_event_type='cita_confirmada' and nullif(trim(p_payload->>'fecha'),'') is not null then v_body := v_body || ' — fecha informada: ' || left(trim(p_payload->>'fecha'),100); end if;
  insert into public.crm_activities(contact_id,activity_type,channel,direction,actor_type,body,external_id,metadata,created_at)
    values (v_id,p_event_type,'whatsapp_ia','inbound','agent',v_body,v_event_id,jsonb_build_object('event_timestamp',p_timestamp,'payload',p_payload),now())
    on conflict do nothing;
  return v_id;
end;
$$;
revoke all on function public.crm_receive_whatsapp_event(text,text,timestamptz,jsonb) from public,anon,authenticated;
grant execute on function public.crm_receive_whatsapp_event(text,text,timestamptz,jsonb) to service_role;
