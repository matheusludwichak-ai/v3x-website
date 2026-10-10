-- V3X Control: public portfolio without SECURITY DEFINER (Supabase advisor 0010).
-- The view now runs with the caller's permissions. Anonymous visitors can read
-- only approved + concluded rows (RLS) and only the safe columns (column grants):
-- client name and internal notes stay unreadable for them even on the base table.

-- Anonymous: no blanket table access, only the public columns.
revoke all on public.portfolio_items from anon;
grant select (id, name, category, description, public_url, demo_url, cover_url, gallery, technologies, services, period_start, period_end, featured, updated_at, public_approved, status)
  on public.portfolio_items to anon;

drop policy if exists "public reads approved portfolio" on public.portfolio_items;
create policy "public reads approved portfolio" on public.portfolio_items
  for select to anon
  using (public_approved = true and status = 'done');

create or replace view public.public_portfolio with (security_invoker = true) as
  select id, name, category, description, public_url, demo_url, cover_url, gallery, technologies, services, period_start, period_end, featured, updated_at
  from public.portfolio_items
  where public_approved = true and status = 'done';

revoke all on public.public_portfolio from anon, authenticated;
grant select on public.public_portfolio to anon, authenticated;
