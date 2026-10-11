-- V3X Control: leads that arrive from the site's contact form. Additive and re-runnable.
-- origin: where the lead came from; email: reply address; attribution: landing page,
-- referrer and UTM parameters sent together with the form (no cookies involved).

alter table public.leads add column if not exists origin text not null default 'manual';
alter table public.leads add column if not exists email text;
alter table public.leads add column if not exists attribution jsonb;

do $$ begin
  alter table public.leads add constraint leads_origin_check check (origin in ('manual', 'site_form'));
exception when duplicate_object then null; end $$;

do $$ begin
  alter table public.leads add constraint leads_email_length check (email is null or char_length(email) <= 200);
exception when duplicate_object then null; end $$;

create index if not exists leads_origin_idx on public.leads (origin);
