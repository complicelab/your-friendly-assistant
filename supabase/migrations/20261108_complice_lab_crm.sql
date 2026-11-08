-- Cómplice Lab CRM
-- Prepared for Supabase. Apply after the project's database is enabled.

create extension if not exists pgcrypto;

create table if not exists public.crm_contacts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  full_name text not null,
  brand_name text,
  email text,
  country text,
  country_code text,
  whatsapp text,
  profession text,
  business_type text,
  need text,
  solution_interest text,
  source text not null default 'web',
  source_detail text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  meta_lead_id text,
  status text not null default 'nuevo'
    check (status in ('nuevo','contactado','calificado','cita_agendada','propuesta','seguimiento','ganado','perdido')),
  owner_email text not null default 'complicelab@gmail.com',
  consent_service boolean not null default false,
  consent_marketing boolean not null default false,
  consent_at timestamptz,
  consent_text text,
  last_contact_at timestamptz,
  next_follow_up_at timestamptz,
  agent_enabled boolean not null default false,
  agent_status text not null default 'pendiente'
    check (agent_status in ('pendiente','listo','pausado','activo','error')),
  whatsapp_thread_id text,
  notes text,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists crm_contacts_created_at_idx on public.crm_contacts(created_at desc);
create index if not exists crm_contacts_status_idx on public.crm_contacts(status);
create index if not exists crm_contacts_whatsapp_idx on public.crm_contacts(whatsapp);
create index if not exists crm_contacts_source_idx on public.crm_contacts(source);
create unique index if not exists crm_contacts_meta_lead_id_unique
  on public.crm_contacts(meta_lead_id) where meta_lead_id is not null;

create table if not exists public.crm_activities (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.crm_contacts(id) on delete cascade,
  created_at timestamptz not null default now(),
  activity_type text not null,
  channel text,
  direction text check (direction is null or direction in ('inbound','outbound','internal')),
  actor_type text not null default 'system'
    check (actor_type in ('lead','admin','agent','system')),
  body text,
  external_id text,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists crm_activities_contact_created_idx
  on public.crm_activities(contact_id, created_at desc);

create table if not exists public.crm_tasks (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.crm_contacts(id) on delete cascade,
  created_at timestamptz not null default now(),
  due_at timestamptz,
  completed_at timestamptz,
  title text not null,
  assigned_to text not null default 'complicelab@gmail.com',
  status text not null default 'pendiente'
    check (status in ('pendiente','completada','cancelada')),
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists crm_tasks_due_idx on public.crm_tasks(status, due_at);

-- Queue used later by the WhatsApp / AI agent connector.
create table if not exists public.crm_agent_jobs (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid references public.crm_contacts(id) on delete cascade,
  created_at timestamptz not null default now(),
  available_at timestamptz not null default now(),
  processed_at timestamptz,
  event_type text not null,
  status text not null default 'pendiente'
    check (status in ('pendiente','procesando','completado','error','cancelado')),
  attempts integer not null default 0,
  payload jsonb not null default '{}'::jsonb,
  last_error text
);

create index if not exists crm_agent_jobs_pending_idx
  on public.crm_agent_jobs(status, available_at);

create or replace function public.crm_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists crm_contacts_touch_updated_at on public.crm_contacts;
create trigger crm_contacts_touch_updated_at
before update on public.crm_contacts
for each row execute function public.crm_touch_updated_at();

-- New contacts become agent-ready jobs, but agent_enabled stays false until the integration is activated.
create or replace function public.crm_queue_new_contact()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.crm_agent_jobs(contact_id, event_type, payload)
  values (
    new.id,
    'contact.created',
    jsonb_build_object(
      'contact_id', new.id,
      'source', new.source,
      'whatsapp', new.whatsapp,
      'consent_service', new.consent_service,
      'consent_marketing', new.consent_marketing
    )
  );
  return new;
end;
$$;

drop trigger if exists crm_queue_new_contact on public.crm_contacts;
create trigger crm_queue_new_contact
after insert on public.crm_contacts
for each row execute function public.crm_queue_new_contact();

alter table public.crm_contacts enable row level security;
alter table public.crm_activities enable row level security;
alter table public.crm_tasks enable row level security;
alter table public.crm_agent_jobs enable row level security;

-- Only the authorized Cómplice Lab administrator can read or edit CRM data from the browser.
drop policy if exists "complice admin contacts" on public.crm_contacts;
create policy "complice admin contacts"
on public.crm_contacts for all
to authenticated
using ((auth.jwt() ->> 'email') = 'complicelab@gmail.com')
with check ((auth.jwt() ->> 'email') = 'complicelab@gmail.com');

drop policy if exists "complice admin activities" on public.crm_activities;
create policy "complice admin activities"
on public.crm_activities for all
to authenticated
using ((auth.jwt() ->> 'email') = 'complicelab@gmail.com')
with check ((auth.jwt() ->> 'email') = 'complicelab@gmail.com');

drop policy if exists "complice admin tasks" on public.crm_tasks;
create policy "complice admin tasks"
on public.crm_tasks for all
to authenticated
using ((auth.jwt() ->> 'email') = 'complicelab@gmail.com')
with check ((auth.jwt() ->> 'email') = 'complicelab@gmail.com');

drop policy if exists "complice admin agent jobs" on public.crm_agent_jobs;
create policy "complice admin agent jobs"
on public.crm_agent_jobs for all
to authenticated
using ((auth.jwt() ->> 'email') = 'complicelab@gmail.com')
with check ((auth.jwt() ->> 'email') = 'complicelab@gmail.com');
