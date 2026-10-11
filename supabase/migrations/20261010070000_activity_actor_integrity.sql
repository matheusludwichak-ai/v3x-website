-- V3X Control: audit trail integrity. When a signed-in user writes to activity_log, the
-- author ("actor") is always that user's own e-mail, whatever the request sent. Server jobs
-- running with the service role (no auth.uid()) keep their label ("Site", "Rotina automática").
-- The table already accepts only inserts from members (no update/delete): history is append-only.
-- Additive and re-runnable.

create or replace function private.stamp_activity_actor() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is not null then
    new.actor := coalesce((select u.email from auth.users u where u.id = auth.uid()), auth.uid()::text);
  end if;
  return new;
end $$;
revoke all on function private.stamp_activity_actor() from public, anon, authenticated;

drop trigger if exists activity_log_actor on public.activity_log;
create trigger activity_log_actor before insert on public.activity_log
  for each row execute function private.stamp_activity_actor();
