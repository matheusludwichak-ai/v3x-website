import { z } from "zod";

/*
 * Data model of the V3X Control. The same shapes are used by the Supabase
 * tables (supabase/migrations), the local development store and the API.
 * Shared by server and client code, so it holds no secrets.
 */

const id = z.string().min(1);
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use o formato AAAA-MM-DD.");
const optionalText = (max = 2000) => z.string().trim().max(max).optional().nullable();
const optionalDate = isoDate.optional().nullable().or(z.literal("").transform(() => null));
const optionalUrl = z.string().trim().url("Informe uma URL válida (com https://).").optional().nullable().or(z.literal("").transform(() => null));
const tags = z.array(z.string().trim().min(1).max(60)).max(30).default([]);

export const TASK_STATUS = ["todo", "doing", "waiting", "done"] as const;
export const PRIORITY = ["low", "medium", "high", "urgent"] as const;
export const PROJECT_STATUS = ["planning", "active", "waiting", "paused", "done"] as const;
export const PROJECT_STAGE = ["discovery", "design", "development", "review", "delivery"] as const;
export const LEAD_STAGE = ["new", "contact", "discovery", "proposal", "negotiation", "won", "lost"] as const;
export const ARTICLE_STATUS = ["draft", "review", "approved", "published", "archived"] as const;
export const PORTFOLIO_STATUS = ["in_progress", "done", "internal"] as const;
export const MONITOR_STATUS = ["up", "degraded", "down", "unknown"] as const;
export const CONVERSATION_STATUS = ["open", "pending", "closed"] as const;
export const REPORT_TYPES = ["projects", "tasks", "monitoring", "incidents", "development", "activity", "executive"] as const;

export const checklistItem = z.object({ id, text: z.string().trim().min(1).max(300), done: z.boolean().default(false) });

export const taskSchema = z.object({
  title: z.string().trim().min(2, "Dê um título à tarefa.").max(200),
  description: optionalText(5000),
  status: z.enum(TASK_STATUS).default("todo"),
  priority: z.enum(PRIORITY).default("medium"),
  assignee_id: z.string().optional().nullable(),
  project_id: z.string().optional().nullable(),
  due_date: optionalDate,
  checklist: z.array(checklistItem).max(50).default([]),
  source: z.enum(["manual", "ai"]).default("manual"),
});

export const projectSchema = z.object({
  name: z.string().trim().min(2, "Dê um nome ao projeto.").max(160),
  kind: z.enum(["internal", "client"]).default("client"),
  client_id: z.string().optional().nullable(),
  status: z.enum(PROJECT_STATUS).default("planning"),
  stage: z.enum(PROJECT_STAGE).default("discovery"),
  owner_id: z.string().optional().nullable(),
  summary: optionalText(4000),
  start_date: optionalDate,
  due_date: optionalDate,
  next_delivery: optionalText(200),
  next_delivery_date: optionalDate,
});

export const clientSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome do cliente.").max(160),
  company: optionalText(160),
  email: z.string().trim().email("E-mail inválido.").optional().nullable().or(z.literal("").transform(() => null)),
  phone: optionalText(40),
  status: z.enum(["prospect", "active", "inactive"]).default("active"),
  notes: optionalText(4000),
});

export const leadSchema = z.object({
  company: z.string().trim().min(2, "Informe a empresa ou o contato.").max(160),
  contact: optionalText(160),
  stage: z.enum(LEAD_STAGE).default("new"),
  service: optionalText(120),
  value_cents: z.number().int().min(0).optional().nullable(),
  owner_id: z.string().optional().nullable(),
  next_action: optionalText(300),
  next_action_date: optionalDate,
  notes: optionalText(4000),
});

export const faqItem = z.object({ q: z.string().trim().min(1).max(300), a: z.string().trim().min(1).max(2000) });
export const linkItem = z.object({ label: z.string().trim().min(1).max(160), url: z.string().trim().min(1).max(500) });

export const articleSchema = z.object({
  title: z.string().trim().min(3, "Dê um título ao artigo.").max(160),
  seo_title: optionalText(70),
  slug: z
    .string()
    .trim()
    .min(3, "O slug precisa de pelo menos 3 caracteres.")
    .max(90)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use letras minúsculas, números e hífens."),
  meta_description: optionalText(170),
  excerpt: optionalText(400),
  content_md: z.string().max(60000).default(""),
  status: z.enum(ARTICLE_STATUS).default("draft"),
  category: optionalText(60),
  tags,
  primary_keyword: optionalText(120),
  secondary_keywords: tags,
  search_intent: z.enum(["informational", "commercial", "transactional", "navigational"]).optional().nullable(),
  audience: optionalText(300),
  awareness_stage: z.enum(["unaware", "problem", "solution", "product", "most_aware"]).optional().nullable(),
  related_service: optionalText(80),
  internal_links: z.array(linkItem).max(20).default([]),
  external_sources: z.array(linkItem).max(20).default([]),
  faq: z.array(faqItem).max(12).default([]),
  cover_suggestion: optionalText(500),
  cover_url: optionalUrl,
  cover_alt: optionalText(200),
  cta: optionalText(300),
  review_notes: optionalText(4000),
  ai_generated: z.boolean().default(false),
  ai_model: optionalText(80),
  author_name: optionalText(120),
  published_at: z.string().optional().nullable(),
});

export const portfolioSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome do projeto.").max(160),
  client_name: optionalText(160),
  category: z.enum(["site", "system", "app", "saas", "motion", "other"]).default("site"),
  description: optionalText(4000),
  public_url: optionalUrl,
  demo_url: optionalUrl,
  cover_url: optionalUrl,
  gallery: z.array(z.string().url()).max(24).default([]),
  technologies: tags,
  services: tags,
  period_start: optionalDate,
  period_end: optionalDate,
  status: z.enum(PORTFOLIO_STATUS).default("in_progress"),
  public_approved: z.boolean().default(false),
  featured: z.boolean().default(false),
  internal_notes: optionalText(4000),
});

export const motionSchema = z.object({
  title: z.string().trim().min(2, "Dê um título à peça.").max(160),
  category: z.enum(["brand", "product", "campaign", "ui", "reference", "other"]).default("brand"),
  project: optionalText(160),
  date: optionalDate,
  tags,
  description: optionalText(3000),
  source_url: optionalUrl,
  video_url: optionalUrl,
  thumbnail_url: optionalUrl,
});

export const orgMemberSchema = z.object({
  name: z.string().trim().min(2).max(120),
  role: optionalText(120),
  role_confirmed: z.boolean().default(false),
  area: optionalText(120),
  manager_id: z.string().optional().nullable(),
  responsibilities: tags,
  active: z.boolean().default(true),
  sort: z.number().int().default(0),
});

export const reportSchema = z.object({
  type: z.enum(REPORT_TYPES),
  title: z.string().trim().min(3).max(200),
  audience: z.enum(["internal", "client"]).default("internal"),
  project_id: z.string().optional().nullable(),
  client_id: z.string().optional().nullable(),
  period_start: optionalDate,
  period_end: optionalDate,
  content_md: z.string().max(60000).default(""),
  data_notes: optionalText(2000),
  ai_model: optionalText(80),
});

export const monitorSchema = z.object({
  name: z.string().trim().min(2).max(160),
  url: z.string().trim().url("Informe a URL completa, com https://."),
  client_id: z.string().optional().nullable(),
  project_id: z.string().optional().nullable(),
  environment: z.enum(["production", "staging", "development"]).default("production"),
  hosting: optionalText(120),
  repository: optionalText(300),
  owner_id: z.string().optional().nullable(),
  enabled: z.boolean().default(true),
  last_status: z.enum(MONITOR_STATUS).default("unknown"),
  last_http_status: z.number().int().optional().nullable(),
  last_latency_ms: z.number().int().optional().nullable(),
  tls_expires_at: z.string().optional().nullable(),
  last_checked_at: z.string().optional().nullable(),
  last_error: optionalText(500),
});

export const incidentSchema = z.object({
  monitor_id: z.string(),
  title: z.string().trim().min(3).max(200),
  signal: z.string().trim().max(500),
  severity: z.enum(["info", "low", "medium", "high"]).default("medium"),
  confidence: z.enum(["low", "medium", "high"]).default("medium"),
  status: z.enum(["open", "resolved"]).default("open"),
  opened_at: z.string(),
  resolved_at: z.string().optional().nullable(),
});

export const conversationSchema = z.object({
  remote_jid: z.string().trim().min(3).max(120),
  contact_name: optionalText(160),
  phone: optionalText(40),
  status: z.enum(CONVERSATION_STATUS).default("open"),
  assignee_id: z.string().optional().nullable(),
  last_message_at: z.string().optional().nullable(),
  last_message_preview: optionalText(300),
  unread_count: z.number().int().min(0).default(0),
  summary: optionalText(3000),
});

export const messageSchema = z.object({
  conversation_id: z.string(),
  external_id: z.string().optional().nullable(),
  direction: z.enum(["in", "out"]),
  body: z.string().max(8000),
  status: z.enum(["pending", "sent", "delivered", "read", "failed", "received"]).default("pending"),
  error: optionalText(500),
  sent_by: optionalText(120),
});

export const activitySchema = z.object({
  entity: z.string(),
  entity_id: z.string().optional().nullable(),
  action: z.string(),
  summary: z.string().max(500),
  actor: optionalText(160),
});

export const ENTITIES = {
  tasks: taskSchema,
  projects: projectSchema,
  clients: clientSchema,
  leads: leadSchema,
  articles: articleSchema,
  portfolio_items: portfolioSchema,
  motion_items: motionSchema,
  org_members: orgMemberSchema,
  reports: reportSchema,
  monitors: monitorSchema,
  incidents: incidentSchema,
  conversations: conversationSchema,
  messages: messageSchema,
  activity_log: activitySchema,
} as const;

export type EntityKey = keyof typeof ENTITIES;
export type EntityInput<K extends EntityKey> = z.input<(typeof ENTITIES)[K]>;
export type Entity<K extends EntityKey> = z.output<(typeof ENTITIES)[K]> & { id: string; created_at: string; updated_at: string };

export type Task = Entity<"tasks">;
export type Project = Entity<"projects">;
export type Client = Entity<"clients">;
export type Lead = Entity<"leads">;
export type Article = Entity<"articles">;
export type PortfolioItem = Entity<"portfolio_items">;
export type MotionItem = Entity<"motion_items">;
export type OrgMember = Entity<"org_members">;
export type Report = Entity<"reports">;
export type Monitor = Entity<"monitors">;
export type Incident = Entity<"incidents">;
export type Conversation = Entity<"conversations">;
export type Message = Entity<"messages">;
export type Activity = Entity<"activity_log">;

/** Entities the browser may write through the generic API (others are written by server flows only). */
export const WRITABLE: EntityKey[] = ["tasks", "projects", "clients", "leads", "articles", "portfolio_items", "motion_items", "org_members", "reports", "monitors", "conversations"];

export const isEntityKey = (value: string): value is EntityKey => value in ENTITIES;

/** Turns a title into a URL slug (accents removed, lowercase, hyphenated). */
export function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

/** Formats zod errors as a field → message map for forms. */
export function fieldErrors(error: z.ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
