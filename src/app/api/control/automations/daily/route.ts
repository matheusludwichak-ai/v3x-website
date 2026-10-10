import { timingSafeEqual } from "node:crypto";
import { getSystemStore } from "@/lib/control/store";

/**
 * Daily digest for a future scheduled routine (Vercel Cron or Supabase Cron).
 * Not scheduled yet: nothing runs until a cron is configured (see docs/CONTROL.md).
 * Read-only and AI-free, so calling it has no cost and publishes nothing.
 * Authorization: header "Authorization: Bearer <CRON_SECRET>".
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const given = (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  const ok = !!secret && given.length === secret.length && timingSafeEqual(Buffer.from(given), Buffer.from(secret));
  if (!ok) return Response.json({ error: "Não autorizado." }, { status: 401 });

  const store = getSystemStore();
  if (!store) return Response.json({ error: "Banco de dados não configurado." }, { status: 503 });

  const today = new Date().toISOString().slice(0, 10);
  const [tasks, incidents, articles] = await Promise.all([store.list("tasks"), store.list("incidents", { where: { status: "open" } }), store.list("articles")]);
  return Response.json({
    date: today,
    overdueTasks: tasks.filter((t) => t.status !== "done" && t.due_date && t.due_date < today).map((t) => ({ id: t.id, title: t.title, due_date: t.due_date })),
    openIncidents: incidents.map((i) => ({ id: i.id, title: i.title, severity: i.severity, confidence: i.confidence })),
    articlesAwaitingReview: articles.filter((a) => a.status === "review" || a.status === "approved").map((a) => ({ id: a.id, title: a.title, status: a.status })),
  });
}
