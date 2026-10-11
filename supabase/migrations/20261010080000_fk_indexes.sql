-- V3X Control: indexes for foreign keys that had none (found by the audit of 10/10/2026).
-- Keeps joins, filters and ON DELETE checks fast as data grows. Additive and re-runnable.
create index if not exists ai_usage_user_idx on public.ai_usage (user_id);
create index if not exists control_invites_client_idx on public.control_invites (client_id);
create index if not exists control_users_client_idx on public.control_users (client_id);
create index if not exists conversations_assignee_idx on public.conversations (assignee_id);
create index if not exists conversations_lead_idx on public.conversations (lead_id);
create index if not exists leads_owner_idx on public.leads (owner_id);
create index if not exists monitors_client_idx on public.monitors (client_id);
create index if not exists monitors_owner_idx on public.monitors (owner_id);
create index if not exists monitors_project_idx on public.monitors (project_id);
create index if not exists org_members_manager_idx on public.org_members (manager_id);
create index if not exists projects_owner_idx on public.projects (owner_id);
create index if not exists reports_client_idx on public.reports (client_id);
create index if not exists reports_project_idx on public.reports (project_id);
create index if not exists tasks_assignee_idx on public.tasks (assignee_id);
