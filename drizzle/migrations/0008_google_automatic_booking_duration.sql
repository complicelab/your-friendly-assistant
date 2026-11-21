-- Automatic, evidence-based Google Calendar booking duration.
-- Existing contacts, meetings, weekly availability and OAuth secrets are preserved.
alter table public.crm_calendar_connections
  add column if not exists booking_duration_minutes integer,
  add column if not exists booking_duration_observations integer not null default 0,
  add column if not exists booking_duration_checked_at timestamptz,
  add column if not exists booking_duration_status text not null default 'pending';
alter table public.crm_calendar_connections
  drop constraint if exists crm_calendar_connections_booking_duration_status_check;
alter table public.crm_calendar_connections
  add constraint crm_calendar_connections_booking_duration_status_check
  check (booking_duration_status in ('pending','verified','mixed','error'));
alter table public.crm_calendar_connections
  drop constraint if exists crm_calendar_connections_booking_duration_minutes_check;
alter table public.crm_calendar_connections
  add constraint crm_calendar_connections_booking_duration_minutes_check
  check (booking_duration_minutes is null or booking_duration_minutes between 15 and 180);

-- UI alone cannot enforce the Google policy. Reject any browser-side edits to
-- duration or slot intervals while Calendar OAuth is linked. Only the server
-- service-role synchronizer may apply a verified duration.
create or replace function public.crm_lock_google_booking_duration()
returns trigger language plpgsql security definer set search_path=public
as $$
begin
  if auth.role() is distinct from 'service_role'
    and exists (select 1 from public.crm_calendar_connections where id=1)
    and (new.meeting_duration_minutes is distinct from old.meeting_duration_minutes
         or new.slot_minutes is distinct from old.slot_minutes)
  then
    raise exception 'La duración y el intervalo se sincronizan desde Google Calendar.';
  end if;
  return new;
end;
$$;
revoke all on function public.crm_lock_google_booking_duration() from public, anon, authenticated;
drop trigger if exists crm_lock_google_booking_duration on public.crm_booking_settings;
create trigger crm_lock_google_booking_duration
before update on public.crm_booking_settings
for each row execute function public.crm_lock_google_booking_duration();