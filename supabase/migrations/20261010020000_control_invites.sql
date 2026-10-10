-- V3X Control: invitations. An admin lists an e-mail with a role; when that person's
-- account is created in Supabase Auth (by an admin; public sign-up is disabled),
-- access to the Control is granted automatically. Additive and re-runnable.

create table if not exists public.control_invites (
  email text primary key check (email = lower(email) and position('@' in email) > 1),
  role text not null default 'member' check (role in ('admin', 'member', 'client_viewer')),
  client_id uuid references public.clients (id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.control_invites enable row level security;

drop policy if exists "admins manage invites" on public.control_invites;
create policy "admins manage invites" on public.control_invites for all to authenticated using (public.is_control_admin()) with check (public.is_control_admin());

create or replace function public.accept_control_invite() returns trigger
language plpgsql security definer set search_path = public as $$
declare inv public.control_invites%rowtype;
begin
  select * into inv from public.control_invites where email = lower(new.email);
  if found then
    insert into public.control_users (user_id, role, client_id)
    values (new.id, inv.role, inv.client_id)
    on conflict (user_id) do nothing;
  end if;
  return new;
end $$;

drop trigger if exists on_auth_user_created_control on auth.users;
create trigger on_auth_user_created_control after insert on auth.users
  for each row execute function public.accept_control_invite();

-- Accounts that already exist when an invite is added later are linked here too.
insert into public.control_users (user_id, role, client_id)
select u.id, i.role, i.client_id from auth.users u join public.control_invites i on i.email = lower(u.email)
on conflict (user_id) do nothing;
