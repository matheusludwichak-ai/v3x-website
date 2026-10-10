-- V3X Control: foundation schema
-- Additive migration: creates new tables only, never drops or alters existing data.
-- Every table has Row Level Security enabled. Access rules:
--   * control members (control_users.role in admin/member) read and write internal data;
--   * client viewers (role client_viewer) only read rows of their own client (future use);
--   * anonymous visitors only read published articles and the public portfolio view;
--   * the service role (server only) is used by the WhatsApp webhook.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- Who may use the Control. Separate from the org chart: a person in the org chart
-- does not get a login, and accounts are created by an admin in Supabase Auth.
create table if not exists public.control_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'member' check (role in ('admin', 'member', 'client_viewer')),
  client_id uuid,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Helper functions used by the RLS policies live in a private schema that the
-- Data API does not expose, so they cannot be called over HTTP.
create schema if not exists private;
grant usage on schema private to authenticated;

create or replace function private.is_control_member() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.control_users u where u.user_id = auth.uid() and u.active and u.role in ('admin', 'member'));
$$;

create or replace function private.is_control_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.control_users u where u.user_id = auth.uid() and u.active and u.role = 'admin');
$$;

create or replace function private.viewer_client_id() returns uuid
language sql stable security definer set search_path = public as $$
  select u.client_id from public.control_users u where u.user_id = auth.uid() and u.active and u.role = 'client_viewer';
$$;

revoke all on function private.is_control_member() from public, anon;
revoke all on function private.is_control_admin() from public, anon;
revoke all on function private.viewer_client_id() from public, anon;
grant execute on function private.is_control_member() to authenticated;
grant execute on function private.is_control_admin() to authenticated;
grant execute on function private.viewer_client_id() to authenticated;

-- ---------------------------------------------------------------------------
-- Organization (org chart)
-- ---------------------------------------------------------------------------
create table if not exists public.org_members (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  role text,
  role_confirmed boolean not null default false,
  area text,
  manager_id uuid references public.org_members (id) on delete set null,
  responsibilities text[] not null default '{}',
  active boolean not null default true,
  sort integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Clients, projects, tasks, commercial pipeline
-- ---------------------------------------------------------------------------
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  email text,
  phone text,
  status text not null default 'active' check (status in ('prospect', 'active', 'inactive')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.control_users drop constraint if exists control_users_client_fk;
alter table public.control_users add constraint control_users_client_fk foreign key (client_id) references public.clients (id) on delete set null;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  kind text not null default 'client' check (kind in ('internal', 'client')),
  client_id uuid references public.clients (id) on delete set null,
  status text not null default 'planning' check (status in ('planning', 'active', 'waiting', 'paused', 'done')),
  stage text not null default 'discovery' check (stage in ('discovery', 'design', 'development', 'review', 'delivery')),
  owner_id uuid references public.org_members (id) on delete set null,
  summary text,
  start_date date,
  due_date date,
  next_delivery text,
  next_delivery_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists projects_client_idx on public.projects (client_id);
create index if not exists projects_status_idx on public.projects (status);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 200),
  description text,
  status text not null default 'todo' check (status in ('todo', 'doing', 'waiting', 'done')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  assignee_id uuid references public.org_members (id) on delete set null,
  project_id uuid references public.projects (id) on delete set null,
  due_date date,
  checklist jsonb not null default '[]'::jsonb,
  source text not null default 'manual' check (source in ('manual', 'ai')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists tasks_project_idx on public.tasks (project_id);
create index if not exists tasks_status_idx on public.tasks (status);
create index if not exists tasks_due_idx on public.tasks (due_date);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  contact text,
  stage text not null default 'new' check (stage in ('new', 'contact', 'discovery', 'proposal', 'negotiation', 'won', 'lost')),
  service text,
  value_cents integer check (value_cents is null or value_cents >= 0),
  owner_id uuid references public.org_members (id) on delete set null,
  next_action text,
  next_action_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Blog
-- ---------------------------------------------------------------------------
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  seo_title text,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  meta_description text,
  excerpt text,
  content_md text not null default '',
  status text not null default 'draft' check (status in ('draft', 'review', 'approved', 'published', 'archived')),
  category text,
  tags text[] not null default '{}',
  primary_keyword text,
  secondary_keywords text[] not null default '{}',
  search_intent text check (search_intent is null or search_intent in ('informational', 'commercial', 'transactional', 'navigational')),
  audience text,
  awareness_stage text check (awareness_stage is null or awareness_stage in ('unaware', 'problem', 'solution', 'product', 'most_aware')),
  related_service text,
  internal_links jsonb not null default '[]'::jsonb,
  external_sources jsonb not null default '[]'::jsonb,
  faq jsonb not null default '[]'::jsonb,
  cover_suggestion text,
  cover_url text,
  cover_alt text,
  cta text,
  review_notes text,
  ai_generated boolean not null default false,
  ai_model text,
  author_name text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists articles_status_idx on public.articles (status, published_at desc);

-- ---------------------------------------------------------------------------
-- Portfolio and motion library
-- ---------------------------------------------------------------------------
create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  client_name text,
  category text not null default 'site' check (category in ('site', 'system', 'app', 'saas', 'motion', 'other')),
  description text,
  public_url text,
  demo_url text,
  cover_url text,
  gallery jsonb not null default '[]'::jsonb,
  technologies text[] not null default '{}',
  services text[] not null default '{}',
  period_start date,
  period_end date,
  status text not null default 'in_progress' check (status in ('in_progress', 'done', 'internal')),
  public_approved boolean not null default false,
  featured boolean not null default false,
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.motion_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'brand' check (category in ('brand', 'product', 'campaign', 'ui', 'reference', 'other')),
  project text,
  date date,
  tags text[] not null default '{}',
  description text,
  source_url text,
  video_url text,
  thumbnail_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Reports
-- ---------------------------------------------------------------------------
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('projects', 'tasks', 'monitoring', 'incidents', 'development', 'activity', 'executive')),
  title text not null,
  audience text not null default 'internal' check (audience in ('internal', 'client')),
  project_id uuid references public.projects (id) on delete set null,
  client_id uuid references public.clients (id) on delete set null,
  period_start date,
  period_end date,
  content_md text not null default '',
  data_notes text,
  ai_model text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint client_reports_need_client check (audience = 'internal' or client_id is not null)
);

-- ---------------------------------------------------------------------------
-- Monitoring
-- ---------------------------------------------------------------------------
create table if not exists public.monitors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text not null check (url ~ '^https?://'),
  client_id uuid references public.clients (id) on delete set null,
  project_id uuid references public.projects (id) on delete set null,
  environment text not null default 'production' check (environment in ('production', 'staging', 'development')),
  hosting text,
  repository text,
  owner_id uuid references public.org_members (id) on delete set null,
  enabled boolean not null default true,
  last_status text not null default 'unknown' check (last_status in ('up', 'degraded', 'down', 'unknown')),
  last_http_status integer,
  last_latency_ms integer,
  tls_expires_at timestamptz,
  last_checked_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.incidents (
  id uuid primary key default gen_random_uuid(),
  monitor_id uuid not null references public.monitors (id) on delete cascade,
  title text not null,
  signal text not null default '',
  severity text not null default 'medium' check (severity in ('info', 'low', 'medium', 'high')),
  confidence text not null default 'medium' check (confidence in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'resolved')),
  opened_at timestamptz not null default now(),
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists incidents_monitor_idx on public.incidents (monitor_id, status);

-- ---------------------------------------------------------------------------
-- Customer service (WhatsApp via Evolution API)
-- ---------------------------------------------------------------------------
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  remote_jid text not null unique,
  contact_name text,
  phone text,
  status text not null default 'open' check (status in ('open', 'pending', 'closed')),
  assignee_id uuid references public.org_members (id) on delete set null,
  last_message_at timestamptz,
  last_message_preview text,
  unread_count integer not null default 0 check (unread_count >= 0),
  summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  external_id text unique,
  direction text not null check (direction in ('in', 'out')),
  body text not null default '',
  status text not null default 'pending' check (status in ('pending', 'sent', 'delivered', 'read', 'failed', 'received')),
  error text,
  sent_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists messages_conversation_idx on public.messages (conversation_id, created_at);

-- ---------------------------------------------------------------------------
-- History
-- ---------------------------------------------------------------------------
create table if not exists public.activity_log (
  id uuid primary key default gen_random_uuid(),
  entity text not null,
  entity_id text,
  action text not null,
  summary text not null check (char_length(summary) <= 500),
  actor text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists activity_entity_idx on public.activity_log (entity, entity_id);
create index if not exists activity_created_idx on public.activity_log (created_at desc);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['control_users','org_members','clients','projects','tasks','leads','articles','portfolio_items','motion_items','reports','monitors','incidents','conversations','messages','activity_log']
  loop
    execute format('drop trigger if exists %I_updated_at on public.%I', t, t);
    execute format('create trigger %I_updated_at before update on public.%I for each row execute function public.set_updated_at()', t, t);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['control_users','org_members','clients','projects','tasks','leads','articles','portfolio_items','motion_items','reports','monitors','incidents','conversations','messages','activity_log']
  loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

-- Internal tables: full access for control members only.
do $$
declare t text;
begin
  foreach t in array array['org_members','clients','projects','tasks','leads','articles','portfolio_items','motion_items','reports','monitors','incidents','conversations','messages']
  loop
    execute format('drop policy if exists "members manage %1$s" on public.%1$I', t);
    execute format('create policy "members manage %1$s" on public.%1$I for all to authenticated using (private.is_control_member()) with check (private.is_control_member())', t);
  end loop;
end $$;

-- History: members can read and append, never edit or delete.
drop policy if exists "members read activity" on public.activity_log;
create policy "members read activity" on public.activity_log for select to authenticated using (private.is_control_member());
drop policy if exists "members append activity" on public.activity_log;
create policy "members append activity" on public.activity_log for insert to authenticated with check (private.is_control_member());

-- Control users: everyone reads only their own row; admins manage all.
drop policy if exists "read own control user" on public.control_users;
create policy "read own control user" on public.control_users for select to authenticated using (user_id = auth.uid() or private.is_control_admin());
drop policy if exists "admins manage control users" on public.control_users;
create policy "admins manage control users" on public.control_users for all to authenticated using (private.is_control_admin()) with check (private.is_control_admin());

-- Client viewers (future client area): read only their own client's data.
drop policy if exists "client viewers read projects" on public.projects;
create policy "client viewers read projects" on public.projects for select to authenticated using (client_id is not null and client_id = private.viewer_client_id());
drop policy if exists "client viewers read reports" on public.reports;
create policy "client viewers read reports" on public.reports for select to authenticated using (audience = 'client' and client_id = private.viewer_client_id());
drop policy if exists "client viewers read monitors" on public.monitors;
create policy "client viewers read monitors" on public.monitors for select to authenticated using (client_id is not null and client_id = private.viewer_client_id());

-- Public site: anyone can read published articles.
drop policy if exists "public reads published articles" on public.articles;
create policy "public reads published articles" on public.articles for select to anon, authenticated using (status = 'published');

-- Public portfolio: only approved items and only safe columns (internal notes never exposed).
create or replace view public.public_portfolio as
  select id, name, category, description, public_url, demo_url, cover_url, gallery, technologies, services, period_start, period_end, featured, updated_at
  from public.portfolio_items
  where public_approved = true and status = 'done';
revoke all on public.public_portfolio from anon, authenticated;
grant select on public.public_portfolio to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Initial organization: the three founders exactly as registered on the site.
-- ---------------------------------------------------------------------------
insert into public.org_members (name, role, role_confirmed, area, sort)
select v.name, v.role, true, v.area, v.sort
from (values
  ('Matheus Ludwichak', 'CEO & Founder', 'Negócios', 0),
  ('Isabella Christina', 'CTO & Co-founder', 'Tecnologia', 1),
  ('Emmanuelle Assanté', 'CFO & Co-founder', 'Finanças', 2)
) as v(name, role, area, sort)
where not exists (select 1 from public.org_members o where o.name = v.name);

update public.org_members m
set manager_id = (select id from public.org_members where name = 'Matheus Ludwichak' limit 1)
where m.name in ('Isabella Christina', 'Emmanuelle Assanté') and m.manager_id is null;

insert into public.monitors (name, url, environment, hosting, repository)
select 'Site institucional V3X', 'https://grupov3x.com.br', 'production', 'Vercel', 'github.com/matheusludwichak-ai/v3x-website'
where not exists (select 1 from public.monitors where url = 'https://grupov3x.com.br');
