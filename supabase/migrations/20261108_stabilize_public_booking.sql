-- Cómplice Lab · stabilize public diagnostic booking
-- Keeps one source of truth: crm_public_book_meeting creates/updates the contact
-- and meeting; crm_after_booking_created owns CRM activity, task, notification
-- queue and agent job creation. This avoids duplicate inserts and enum mismatches.

create or replace function public.crm_public_book_meeting(
  p_full_name text,
  p_brand_name text,
  p_country text,
  p_country_code text,
  p_whatsapp text,
  p_email text,
  p_solution_interest text,
  p_starts_at timestamptz,
  p_consent_text text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $function$
declare
  cfg public.crm_booking_settings%rowtype;
  v_contact_id uuid;
  v_meeting_id uuid;
  v_end timestamptz;
begin
  if coalesce(trim(p_full_name),'')='' then raise exception 'Nombre requerido'; end if;
  if coalesce(trim(p_whatsapp),'')='' then raise exception 'WhatsApp requerido'; end if;
  if coalesce(trim(p_email),'')='' then raise exception 'Correo requerido'; end if;
  if p_starts_at is null then raise exception 'Horario requerido'; end if;

  select * into cfg from public.crm_booking_settings limit 1;
  if cfg.id is null or not cfg.active then raise exception 'Agenda no disponible'; end if;

  if not exists (
    select 1
    from public.crm_public_available_slots(
      (p_starts_at at time zone cfg.timezone)::date,
      2
    ) s
    where s.slot_start = p_starts_at
  ) then
    raise exception 'Horario no disponible';
  end if;

  v_end := p_starts_at + make_interval(mins => cfg.meeting_duration_minutes);

  select id into v_contact_id
  from public.crm_contacts
  where lower(coalesce(email,'')) = lower(trim(p_email))
     or regexp_replace(coalesce(whatsapp,''),'\D','','g')
        = regexp_replace(coalesce(p_whatsapp,''),'\D','','g')
  order by created_at desc
  limit 1;

  if v_contact_id is null then
    insert into public.crm_contacts(
      full_name, brand_name, email, country, country_code, whatsapp,
      solution_interest, source, source_detail, status, owner_email,
      consent_service, consent_marketing, consent_at, consent_text,
      agent_enabled, agent_status
    ) values (
      trim(p_full_name),
      nullif(trim(p_brand_name),''),
      lower(trim(p_email)),
      nullif(trim(p_country),''),
      nullif(trim(p_country_code),''),
      trim(p_whatsapp),
      nullif(trim(p_solution_interest),''),
      'web',
      'diagnostico_gratuito',
      'cita_agendada',
      coalesce(nullif(cfg.admin_email,''),'complicelab@gmail.com'),
      true,
      false,
      now(),
      p_consent_text,
      false,
      'pendiente'
    )
    returning id into v_contact_id;
  else
    update public.crm_contacts
       set full_name = trim(p_full_name),
           brand_name = coalesce(nullif(trim(p_brand_name),''),brand_name),
           country = coalesce(nullif(trim(p_country),''),country),
           country_code = coalesce(nullif(trim(p_country_code),''),country_code),
           whatsapp = trim(p_whatsapp),
           email = lower(trim(p_email)),
           solution_interest = coalesce(nullif(trim(p_solution_interest),''),solution_interest),
           source_detail = 'diagnostico_gratuito',
           status = 'cita_agendada',
           consent_service = true,
           consent_at = now(),
           consent_text = coalesce(p_consent_text,consent_text),
           updated_at = now()
     where id = v_contact_id;
  end if;

  insert into public.crm_meetings(
    contact_id, starts_at, ends_at, timezone, status, meeting_type, title,
    attendee_email, attendee_whatsapp, admin_email, admin_whatsapp,
    service_interest, source
  ) values (
    v_contact_id,
    p_starts_at,
    v_end,
    cfg.timezone,
    'confirmada',
    'diagnostico',
    cfg.booking_title,
    lower(trim(p_email)),
    trim(p_whatsapp),
    coalesce(nullif(cfg.admin_email,''),'complicelab@gmail.com'),
    cfg.admin_whatsapp,
    nullif(trim(p_solution_interest),''),
    'web'
  )
  returning id into v_meeting_id;

  return v_meeting_id;
end;
$function$;

revoke all on function public.crm_public_book_meeting(
  text,text,text,text,text,text,text,timestamptz,text
) from public;

grant execute on function public.crm_public_book_meeting(
  text,text,text,text,text,text,text,timestamptz,text
) to anon, authenticated, service_role;
