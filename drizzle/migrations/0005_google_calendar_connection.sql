-- Cómplice Lab · Cuenta Google Calendar vinculada desde /admin.
-- Aplicar después de las migraciones CRM existentes. No modifica ni elimina datos.
create table if not exists public.crm_calendar_connections (
  id integer primary key default 1 check (id = 1),
  google_email text not null,
  calendar_id text not null,
  refresh_token_encrypted text not null,
  connected_at timestamptz not null default now(),
  last_synced_at timestamptz,
  last_error text,
  updated_at timestamptz not null default now()
);
create table if not exists public.crm_calendar_oauth_states (
  nonce uuid primary key,
  requested_by uuid not null,
  verifier_encrypted text not null,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists crm_calendar_oauth_states_expires_idx
  on public.crm_calendar_oauth_states(expires_at);

alter table public.crm_calendar_connections enable row level security;
alter table public.crm_calendar_oauth_states enable row level security;

-- No client-side policies at all: only service-role calls from authenticated
-- server endpoints can access connection/token records.
revoke all on table public.crm_calendar_connections from anon, authenticated, public;
revoke all on table public.crm_calendar_oauth_states from anon, authenticated, public;
grant all on table public.crm_calendar_connections to service_role;
grant all on table public.crm_calendar_oauth_states to service_role;

-- Existing meeting rows use this identifier for reconciliation and deduplication.
create unique index if not exists crm_meetings_calendar_id_unique
  on public.crm_meetings(external_calendar_id)
  where external_calendar_id is not null;
