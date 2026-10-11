-- V3X Control: WhatsApp assistant (Gemini), knowledge base and scheduled automations.
-- Additive and re-runnable. RLS on every new table.

-- Knowledge base the assistant may use (written and reviewed by the team).
create table if not exists public.knowledge_items (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 160),
  category text not null default 'outros' check (category in ('servicos', 'processo', 'prazos', 'precos', 'horarios', 'politicas', 'outros')),
  content text not null check (char_length(content) between 2 and 4000),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.knowledge_items enable row level security;
drop policy if exists "members manage knowledge" on public.knowledge_items;
create policy "members manage knowledge" on public.knowledge_items for all to authenticated using (private.is_control_member()) with check (private.is_control_member());
drop trigger if exists knowledge_items_updated_at on public.knowledge_items;
create trigger knowledge_items_updated_at before update on public.knowledge_items for each row execute function public.set_updated_at();

-- Workspace settings (one row per key). Members read, only admins change.
create table if not exists public.automation_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique check (key ~ '^[a-z_]{2,40}$'),
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by text
);
alter table public.automation_settings enable row level security;
drop policy if exists "members read settings" on public.automation_settings;
create policy "members read settings" on public.automation_settings for select to authenticated using (private.is_control_member());
drop policy if exists "admins write settings" on public.automation_settings;
create policy "admins write settings" on public.automation_settings for all to authenticated using (private.is_control_admin()) with check (private.is_control_admin());

-- History of scheduled runs (daily routine).
create table if not exists public.automation_runs (
  id uuid primary key default gen_random_uuid(),
  job text not null check (char_length(job) <= 40),
  trigger text not null default 'cron' check (trigger in ('cron', 'manual')),
  summary jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.automation_runs enable row level security;
drop policy if exists "members read runs" on public.automation_runs;
create policy "members read runs" on public.automation_runs for select to authenticated using (private.is_control_member());
create index if not exists automation_runs_job_idx on public.automation_runs (job, created_at desc);

-- Conversations: the assistant pauses when a person takes over or hands off.
alter table public.conversations add column if not exists ai_paused boolean not null default false;
alter table public.conversations add column if not exists ai_note text;
alter table public.conversations add column if not exists lead_id uuid references public.leads (id) on delete set null;

-- Leads can also come from WhatsApp.
alter table public.leads drop constraint if exists leads_origin_check;
alter table public.leads add constraint leads_origin_check check (origin in ('manual', 'site_form', 'whatsapp'));
