-- Cómplice Lab · booking workflow and notification queue
-- Idempotent migration: keeps CRM booking state coherent and leaves external delivery auditable.

create table if not exists public.crm_notifications (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid references public.crm_meetings(id) on delete cascade,
  contact_id uuid references public.crm_contacts(id) on delete cascade,
  created_at timestamptz not null default now(),
  channel text not null check (channel in ('email','whatsapp','internal')),
  recipient_type text not null check (recipient_type in ('attendee','admin')),
  recipient text not null,
  template_key text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'pendiente' check (status in ('pendiente','enviado','error','omitido')),
  attempts integer not null default 0,
  sent_at timestamptz,
  last_error text
);

create unique index if not exists crm_notifications_booking_unique
  on public.crm_notifications(meeting_id, channel, recipient_type, template_key)
  where meeting_id is not null;

create index if not exists crm_notifications_pending_idx
  on public.crm_notifications(status, created_at);

alter table public.crm_notifications enable row level security;

drop policy if exists "complice admin notifications" on public.crm_notifications;
create policy "complice admin notifications"
on public.crm_notifications for all
to authenticated
using ((auth.jwt() ->> 'email') = 'complicelab@gmail.com')
with check ((auth.jwt() ->> 'email') = 'complicelab@gmail.com');

create or replace function public.crm_after_booking_created()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_contact_name text;
begin
  update public.crm_contacts
     set status = 'cita_agendada',
         next_follow_up_at = new.starts_at,
         updated_at = now()
   where id = new.contact_id
   returning full_name into v_contact_name;

  if not exists (
    select 1 from public.crm_activities
     where contact_id = new.contact_id
       and activity_type = 'meeting_booked'
       and external_id = new.id::text
  ) then
    insert into public.crm_activities(
      contact_id, activity_type, channel, direction, actor_type, body, external_id, metadata
    ) values (
      new.contact_id,
      'meeting_booked',
      'web',
      'inbound',
      'lead',
      'Diagnóstico agendado para ' || to_char(new.starts_at at time zone 'America/Bogota','DD/MM/YYYY HH12:MI AM') || ' (hora de Colombia).',
      new.id::text,
      jsonb_build_object('meeting_id',new.id,'starts_at',new.starts_at,'service_interest',new.service_interest)
    );
  end if;

  if not exists (
    select 1 from public.crm_tasks
     where contact_id = new.contact_id
       and metadata ->> 'meeting_id' = new.id::text
       and status <> 'cancelada'
  ) then
    insert into public.crm_tasks(contact_id,title,due_at,assigned_to,status,metadata)
    values (
      new.contact_id,
      'Preparar diagnóstico' || case when v_contact_name is not null then ' · ' || v_contact_name else '' end,
      new.starts_at - interval '2 hours',
      coalesce(nullif(new.admin_email,''),'complicelab@gmail.com'),
      'pendiente',
      jsonb_build_object('meeting_id',new.id,'type','booking_preparation')
    );
  end if;

  if nullif(new.attendee_email,'') is not null then
    insert into public.crm_notifications(meeting_id,contact_id,channel,recipient_type,recipient,template_key,payload)
    values (
      new.id,new.contact_id,'email','attendee',new.attendee_email,'booking_confirmation_attendee',
      jsonb_build_object('meeting_id',new.id,'starts_at',new.starts_at,'timezone',new.timezone,'service_interest',new.service_interest)
    )
    on conflict do nothing;
  end if;

  if nullif(new.admin_email,'') is not null then
    insert into public.crm_notifications(meeting_id,contact_id,channel,recipient_type,recipient,template_key,payload)
    values (
      new.id,new.contact_id,'email','admin',new.admin_email,'booking_confirmation_admin',
      jsonb_build_object('meeting_id',new.id,'starts_at',new.starts_at,'timezone',new.timezone,'service_interest',new.service_interest)
    )
    on conflict do nothing;
  end if;

  if nullif(new.attendee_whatsapp,'') is not null then
    insert into public.crm_notifications(meeting_id,contact_id,channel,recipient_type,recipient,template_key,payload)
    values (
      new.id,new.contact_id,'whatsapp','attendee',new.attendee_whatsapp,'booking_confirmation_attendee',
      jsonb_build_object('meeting_id',new.id,'starts_at',new.starts_at,'timezone',new.timezone,'service_interest',new.service_interest)
    )
    on conflict do nothing;
  end if;

  if nullif(new.admin_whatsapp,'') is not null then
    insert into public.crm_notifications(meeting_id,contact_id,channel,recipient_type,recipient,template_key,payload)
    values (
      new.id,new.contact_id,'whatsapp','admin',new.admin_whatsapp,'booking_confirmation_admin',
      jsonb_build_object('meeting_id',new.id,'starts_at',new.starts_at,'timezone',new.timezone,'service_interest',new.service_interest)
    )
    on conflict do nothing;
  end if;

  if to_regclass('public.crm_agent_jobs') is not null then
    insert into public.crm_agent_jobs(contact_id,event_type,payload)
    values (
      new.contact_id,
      'meeting.booked',
      jsonb_build_object('meeting_id',new.id,'starts_at',new.starts_at,'service_interest',new.service_interest)
    );
  end if;

  return new;
end;
$$;

drop trigger if exists crm_after_booking_created on public.crm_meetings;
create trigger crm_after_booking_created
after insert on public.crm_meetings
for each row execute function public.crm_after_booking_created();
