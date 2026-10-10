-- V3X Control: AI usage ledger (global daily limit) and media storage bucket.
-- Additive and re-runnable. Requires 20261010000000_control_foundation.sql.

-- ---------------------------------------------------------------------------
-- AI usage: one row per AI call, used to enforce CONTROL_AI_DAILY_LIMIT across
-- every server instance. Stores no prompt or output content.
-- ---------------------------------------------------------------------------
create table if not exists public.ai_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null default auth.uid(),
  action text not null check (char_length(action) <= 60),
  created_at timestamptz not null default now()
);
create index if not exists ai_usage_created_idx on public.ai_usage (created_at desc);
alter table public.ai_usage enable row level security;

drop policy if exists "members record ai usage" on public.ai_usage;
create policy "members record ai usage" on public.ai_usage for insert to authenticated with check (private.is_control_member() and user_id = auth.uid());
drop policy if exists "members read ai usage" on public.ai_usage;
create policy "members read ai usage" on public.ai_usage for select to authenticated using (private.is_control_member());

-- Count of AI calls today (UTC) for the whole workspace. Runs with the caller's
-- rights: members see every row (policy above), anyone else counts nothing.
create or replace function public.ai_usage_today() returns integer
language sql stable security invoker set search_path = public as $$
  select count(*)::int from public.ai_usage where created_at >= date_trunc('day', now() at time zone 'utc') at time zone 'utc';
$$;
revoke all on function public.ai_usage_today() from public, anon;
grant execute on function public.ai_usage_today() to authenticated;

-- ---------------------------------------------------------------------------
-- Media bucket for portfolio covers and motion files.
-- Files are readable by link (public bucket) so approved covers can appear on the
-- site; only control members can upload, replace or delete. Do not upload
-- confidential material: anyone with the exact link can open the file.
-- ---------------------------------------------------------------------------
do $$
begin
  if exists (select 1 from information_schema.schemata where schema_name = 'storage') then
    insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    values ('control-media', 'control-media', true, 52428800, array['image/jpeg','image/png','image/webp','image/avif','image/gif','video/mp4','video/webm','video/quicktime'])
    on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

    execute 'drop policy if exists "members read control media" on storage.objects';
    execute 'create policy "members read control media" on storage.objects for select to authenticated using (bucket_id = ''control-media'' and private.is_control_member())';
    execute 'drop policy if exists "members upload control media" on storage.objects';
    execute 'create policy "members upload control media" on storage.objects for insert to authenticated with check (bucket_id = ''control-media'' and private.is_control_member())';
    execute 'drop policy if exists "members update control media" on storage.objects';
    execute 'create policy "members update control media" on storage.objects for update to authenticated using (bucket_id = ''control-media'' and private.is_control_member())';
    execute 'drop policy if exists "members delete control media" on storage.objects';
    execute 'create policy "members delete control media" on storage.objects for delete to authenticated using (bucket_id = ''control-media'' and private.is_control_member())';
  end if;
end $$;

-- The Control itself is monitored too (external check of its sign-in page).
insert into public.monitors (name, url, environment, hosting, repository)
select 'V3X Control (login)', 'https://grupov3x.com.br/login', 'production', 'Vercel', 'github.com/matheusludwichak-ai/v3x-website'
where not exists (select 1 from public.monitors where url = 'https://grupov3x.com.br/login');
