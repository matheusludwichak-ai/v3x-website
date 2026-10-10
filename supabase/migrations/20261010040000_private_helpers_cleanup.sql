-- V3X Control: remove the old public copies of the RLS helper functions after the
-- policies were recreated on the private.* versions (Supabase security advisor 0028/0029).
-- Safe to run more than once.
drop function if exists public.accept_control_invite();
drop function if exists public.is_control_member();
drop function if exists public.is_control_admin();
drop function if exists public.viewer_client_id();
