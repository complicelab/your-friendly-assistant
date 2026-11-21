-- Record confirmed server-side scheduled runs independently of manual panel sync.
alter table public.crm_calendar_connections add column if not exists last_cron_at timestamptz;

-- Cómplice Lab: manual review decisions for unlinked Google Calendar events.
-- No destructive changes to existing CRM or calendar credentials.
create table if not exists public.crm_calendar_event_reviews (
  event_id text primary key,
  calendar_id text not null,
  action text not null check (action in ('ignored')),
  reviewed_at timestamptz not null default now()
);
alter table public.crm_calendar_event_reviews enable row level security;
revoke all on table public.crm_calendar_event_reviews from anon, authenticated, public;
grant select, insert, update, delete on public.crm_calendar_event_reviews to service_role;

-- Atomic, idempotent attachment for both automatic and manual matching.
-- Requires a preverified Google event, validated by the authenticated server.
create or replace function public.crm_attach_google_calendar_event(
  p_event_id text, p_contact_id uuid, p_start timestamptz, p_end timestamptz,
  p_title text, p_meeting_url text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_existing public.crm_meetings%rowtype;
  v_id uuid;
  v_service text;
begin
  if auth.role() <> 'service_role' then raise exception 'not authorized'; end if;
  if coalesce(length(trim(p_event_id)),0) not between 1 and 512
     or p_contact_id is null or p_start is null or p_end is null or p_end <= p_start
     or p_end > p_start + interval '8 hours'
    then raise exception 'invalid calendar event'; end if;
  perform pg_advisory_xact_lock(hashtextextended('calendar:' || p_event_id, 0));
  if not exists(select 1 from public.crm_contacts where id=p_contact_id) then
    raise exception 'contact not found';
  end if;
  select * into v_existing from public.crm_meetings
    where external_calendar_id=p_event_id for update;
  if found then
    if v_existing.contact_id <> p_contact_id then
      raise exception 'event already belongs to a different contact';
    end if;
    return v_existing.id;
  end if;
  select * into v_existing from public.crm_meetings
    where contact_id=p_contact_id and starts_at=p_start
      and status <> 'cancelada'
    order by created_at asc limit 1 for update;
  if found then
    if v_existing.external_calendar_id is not null
       and v_existing.external_calendar_id <> p_event_id then
      raise exception 'the CRM meeting is linked to another Google event';
    end if;
    update public.crm_meetings
       set external_calendar_id=p_event_id, meeting_url=coalesce(nullif(p_meeting_url,''),meeting_url)
     where id=v_existing.id returning id into v_id;
  else
    select solution_interest into v_service from public.crm_contacts where id=p_contact_id;
    insert into public.crm_meetings(
      contact_id, starts_at, ends_at, timezone, status, meeting_type, title,
      attendee_email, attendee_whatsapp, admin_email, service_interest,
      source, external_calendar_id, meeting_url
    ) values (
      p_contact_id, p_start, p_end, 'America/Bogota', 'confirmada',
      'diagnostico', left(coalesce(nullif(trim(p_title),''),'Cita de Google Calendar'),180),
      null, null, '', v_service, 'google_calendar', p_event_id, nullif(p_meeting_url,'')
    ) returning id into v_id;
  end if;
  delete from public.crm_calendar_event_reviews where event_id=p_event_id;
  return v_id;
end;
$$;
revoke all on function public.crm_attach_google_calendar_event(text,uuid,timestamptz,timestamptz,text,text)
  from public,anon,authenticated;
grant execute on function public.crm_attach_google_calendar_event(text,uuid,timestamptz,timestamptz,text,text)
  to service_role;
