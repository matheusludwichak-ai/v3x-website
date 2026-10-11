import { timingSafeEqual } from "node:crypto";
import { getSystemStore } from "@/lib/control/store";
import { guard, isResponse, sameOrigin } from "@/lib/control/guard";
import { runMonitorCheck } from "@/lib/control/monitor";
import type { ControlStore } from "@/lib/control/store/types";
import type { Monitor } from "@/lib/control/schema";

/**
 * Daily routine (Vercel Cron, 08:00 in São Paulo, see vercel.json):
 *  1. checks every enabled monitored site and opens/resolves incidents;
 *  2. records a digest (overdue tasks, open incidents, articles in review, conversations
 *     waiting for a person, new leads) in automation_runs, shown in the Control.
 * Sends no message, publishes nothing and uses no AI.
 *
 * Authorization: with CRON_SECRET set, Vercel sends "Authorization: Bearer <CRON_SECRET>" and it
 * is required. Without it, only Vercel's cron user agent is accepted and at most once every 20 h,
 * so a forged call can do no more than the routine itself. Admins can also run it from the Control.
 */
export const maxDuration = 60;

const HOURS = 3_600_000;

function cronAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const given = (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
    return given.length === secret.length && timingSafeEqual(Buffer.from(given), Buffer.from(secret));
  }
  return (request.headers.get("user-agent") ?? "").startsWith("vercel-cron/");
}

async function lastRun(store: ControlStore) {
  const runs = await store.list("automation_runs", { where: { job: "daily" }, limit: 50 });
  return runs.map((r) => Date.parse(r.created_at)).sort((a, b) => b - a)[0] ?? 0;
}

async function runDaily(store: ControlStore, trigger: "cron" | "manual", actor: string) {
  const now = Date.now();
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(new Date());

  const monitors = (await store.list("monitors", { limit: 50 })).filter((m) => m.enabled) as Monitor[];
  const checks: { name: string; status: string; incident: string | null }[] = [];
  for (const m of monitors.slice(0, 20)) {
    try {
      const { result, incident } = await runMonitorCheck(store, m, async (title) => {
        await store.insert("activity_log", { entity: "monitors", entity_id: m.id, action: "incident", summary: `Sinal em ${m.name}: ${title}`.slice(0, 500), actor });
      });
      checks.push({ name: m.name, status: result.status, incident });
    } catch {
      checks.push({ name: m.name, status: "error", incident: null });
    }
  }

  const [tasks, incidents, articles, conversations, leads] = await Promise.all([
    store.list("tasks", { limit: 1000 }),
    store.list("incidents", { where: { status: "open" }, limit: 200 }),
    store.list("articles", { limit: 500 }),
    store.list("conversations", { limit: 500 }),
    store.list("leads", { limit: 500 }),
  ]);
  const summary = {
    date: today,
    monitors: { checked: checks.length, down: checks.filter((c) => c.status === "down").length, degraded: checks.filter((c) => c.status === "degraded").length, results: checks },
    overdueTasks: tasks.filter((t) => t.status !== "done" && t.due_date && t.due_date < today).length,
    openIncidents: incidents.length,
    articlesAwaitingReview: articles.filter((a) => a.status === "review" || a.status === "approved").length,
    conversationsWaiting: conversations.filter((c) => c.status === "pending" && c.last_message_at && now - Date.parse(c.last_message_at) > 2 * HOURS).length,
    newLeads24h: leads.filter((l) => now - Date.parse(l.created_at) < 24 * HOURS).length,
  };
  await store.insert("automation_runs", { job: "daily", trigger, summary });
  await store.insert("activity_log", {
    entity: "monitors",
    entity_id: null,
    action: "updated",
    summary: `Rotina diária: ${checks.length} site(s) verificado(s), ${summary.openIncidents} incidente(s) aberto(s), ${summary.overdueTasks} tarefa(s) atrasada(s), ${summary.newLeads24h} lead(s) novo(s).`,
    actor,
  });
  return summary;
}

/** Vercel Cron. */
export async function GET(request: Request) {
  if (!cronAuthorized(request)) return Response.json({ error: "Não autorizado." }, { status: 401 });
  const store = getSystemStore();
  if (!store) return Response.json({ error: "Banco de dados não configurado." }, { status: 503 });
  if (!process.env.CRON_SECRET && Date.now() - (await lastRun(store)) < 20 * HOURS) return Response.json({ skipped: "Já executada nas últimas 20 horas." });
  return Response.json({ ok: true, summary: await runDaily(store, "cron", "Rotina automática") });
}

/** Manual run by an administrator (Control > Monitoramento). */
export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Origem não permitida." }, { status: 403 });
  const session = await guard("write");
  if (isResponse(session)) return session;
  if (session.mode === "supabase" && session.user?.role !== "admin") return Response.json({ error: "Apenas administradores executam a rotina." }, { status: 403 });
  const store = getSystemStore();
  if (!store) return Response.json({ error: "Banco de dados não configurado." }, { status: 503 });
  if (Date.now() - (await lastRun(store)) < 5 * 60_000) return Response.json({ error: "A rotina acabou de rodar. Tente de novo em alguns minutos." }, { status: 429 });
  return Response.json({ ok: true, summary: await runDaily(store, "manual", session.user?.email ?? "Desenvolvimento local") });
}
