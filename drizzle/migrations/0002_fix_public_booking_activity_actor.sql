CREATE OR REPLACE FUNCTION public.crm_public_book_meeting(p_full_name text, p_brand_name text, p_country text, p_country_code text, p_whatsapp text, p_email text, p_solution_interest text, p_starts_at timestamp with time zone, p_consent_text text DEFAULT NULL::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  cfg public.crm_booking_settings%rowtype;
  v_contact_id uuid;
  v_meeting_id uuid;
  v_end timestamptz;
begin
  if coalesce(trim(p_full_name),'')='' then raise exception 'Nombre requerido'; end if;
  if coalesce(trim(p_whatsapp),'')='' then raise exception 'WhatsApp requerido'; end if;
  if coalesce(trim(p_email),'')='' then raise exception 'Correo requerido'; end if;

  select * into cfg from public.crm_booking_settings limit 1;
  if cfg.id is null or not cfg.active then raise exception 'Agenda no disponible'; end if;

  v_end := p_starts_at + make_interval(mins=>cfg.meeting_duration_minutes);

  if not exists(
    select 1 from public.crm_public_available_slots((p_starts_at at time zone cfg.timezone)::date,2) s
    where s.slot_start=p_starts_at
  ) then
    raise exception 'Horario no disponible';
  end if;

  select id into v_contact_id
  from public.crm_contacts
  where lower(coalesce(email,''))=lower(trim(p_email))
     or regexp_replace(coalesce(whatsapp,''),'\D','','g')=regexp_replace(coalesce(p_whatsapp,''),'\D','','g')
  order by created_at desc
  limit 1;

  if v_contact_id is null then
    insert into public.crm_contacts(
      full_name,brand_name,email,country,country_code,whatsapp,solution_interest,
      source,source_detail,status,owner_email,consent_service,consent_marketing,consent_at,consent_text,
      agent_enabled,agent_status
    ) values (
      trim(p_full_name),nullif(trim(p_brand_name),''),lower(trim(p_email)),nullif(trim(p_country),''),
      nullif(trim(p_country_code),''),trim(p_whatsapp),nullif(trim(p_solution_interest),''),
      'web','videollamada_diagnostico','cita_agendada','complicelab@gmail.com',
      true,false,now(),p_consent_text,false,'pendiente'
    ) returning id into v_contact_id;
  else
    update public.crm_contacts
      set full_name=trim(p_full_name),
          brand_name=coalesce(nullif(trim(p_brand_name),''),brand_name),
          country=coalesce(nullif(trim(p_country),''),country),
          country_code=coalesce(nullif(trim(p_country_code),''),country_code),
          whatsapp=trim(p_whatsapp),
          email=lower(trim(p_email)),
          solution_interest=coalesce(nullif(trim(p_solution_interest),''),solution_interest),
          status='cita_agendada',
          consent_service=true,
          consent_at=now(),
          updated_at=now()
    where id=v_contact_id;
  end if;

  insert into public.crm_meetings(
    contact_id,starts_at,ends_at,timezone,status,meeting_type,title,attendee_email,attendee_whatsapp,
    admin_email,admin_whatsapp,service_interest,source
  ) values (
    v_contact_id,p_starts_at,v_end,cfg.timezone,'confirmada','diagnostico',cfg.booking_title,
    lower(trim(p_email)),trim(p_whatsapp),cfg.admin_email,cfg.admin_whatsapp,nullif(trim(p_solution_interest),''),'web'
  ) returning id into v_meeting_id;

  insert into public.crm_activities(contact_id,activity_type,channel,direction,actor_type,body,metadata)
  values(
    v_contact_id,'meeting_booked','web','inbound','lead',
    'Videollamada de diagnóstico agendada.',
    jsonb_build_object('meeting_id',v_meeting_id,'starts_at',p_starts_at,'timezone',cfg.timezone)
  );

  insert into public.crm_tasks(contact_id,due_at,title,assigned_to,status,metadata)
  values(
    v_contact_id,p_starts_at - interval '30 minutes','Preparar videollamada de diagnóstico',
    cfg.admin_email,'pendiente',jsonb_build_object('meeting_id',v_meeting_id)
  );

  insert into public.crm_notifications(meeting_id,contact_id,channel,recipient_type,recipient,template_key,payload)
  values
    (v_meeting_id,v_contact_id,'email','cliente',lower(trim(p_email)),'meeting_confirmation_client',
      jsonb_build_object('starts_at',p_starts_at,'timezone',cfg.timezone,'title',cfg.booking_title)),
    (v_meeting_id,v_contact_id,'email','admin',cfg.admin_email,'meeting_confirmation_admin',
      jsonb_build_object('starts_at',p_starts_at,'timezone',cfg.timezone,'title',cfg.booking_title,'contact_name',trim(p_full_name))),
    (v_meeting_id,v_contact_id,'whatsapp','cliente',trim(p_whatsapp),'meeting_confirmation_client',
      jsonb_build_object('starts_at',p_starts_at,'timezone',cfg.timezone,'title',cfg.booking_title)),
    (v_meeting_id,v_contact_id,'whatsapp','admin',coalesce(cfg.admin_whatsapp,''),'meeting_confirmation_admin',
      jsonb_build_object('starts_at',p_starts_at,'timezone',cfg.timezone,'title',cfg.booking_title,'contact_name',trim(p_full_name)));

  return v_meeting_id;
end;
$function$