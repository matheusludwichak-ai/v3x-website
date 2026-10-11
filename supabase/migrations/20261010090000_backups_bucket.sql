-- V3X Control: private bucket for the daily logical backup (JSON) written by the server.
-- No policy for anon/authenticated: only the server (service role) reads or writes it.
-- Additive and re-runnable.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('control-backups', 'control-backups', false, 52428800, array['application/json'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;
