import { z } from "zod";
import { guard, isResponse, sameOrigin } from "@/lib/control/guard";
import { getStore } from "@/lib/control/store";
import { createEntity, errorResponse } from "@/lib/control/service";
import { aiErrorResponse } from "@/lib/control/ai/gemini";
import { enforceAIQuota } from "@/lib/control/ai/usage";
import { writeReport } from "@/lib/control/ai/actions";
import { REPORT_TYPES } from "@/lib/control/schema";

export const maxDuration = 120;

const body = z.object({
  type: z.enum(REPORT_TYPES),
  audience: z.enum(["internal", "client"]).default("internal"),
  project_id: z.string().optional().nullable(),
  client_id: z.string().optional().nullable(),
  period_start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  period_end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

const TITLES: Record<(typeof REPORT_TYPES)[number], string> = {
  projects: "Relatório de projetos",
  tasks: "Relatório de andamento e tarefas",
  monitoring: "Relatório de desempenho dos sites monitorados",
  incidents: "Relatório de incidentes e disponibilidade",
  development: "Relatório de desenvolvimento",
  activity: "Relatório de atividades e entregas",
  executive: "Relatório executivo",
};

const inPeriod = (iso: string | null | undefined, start: string, end: string) => !!iso && iso.slice(0, 10) >= start && iso.slice(0, 10) <= end;

/**
 * Builds a report from REAL records in the Control for the chosen period and scope,
 * asks the AI to write it, and saves it. The data snapshot and its limitations are
 * sent to the model explicitly so it cannot fill gaps with invented numbers.
 */
export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Origem não permitida." }, { status: 403 });
  const session = await guard("ai");
  if (isResponse(session)) return session;
  const parsed = body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Escolha tipo e período válidos." }, { status: 400 });
  const input = parsed.data;
  if (input.audience === "client" && !input.client_id) return Response.json({ error: "Relatórios para cliente precisam de um cliente selecionado, para não misturar dados." }, { status: 400 });

  try {
    await enforceAIQuota(session, `report.${input.type}`);
    const store = await getStore();
    let projects = await store.list("projects");
    if (input.client_id) projects = projects.filter((p) => p.client_id === input.client_id);
    if (input.project_id) projects = projects.filter((p) => p.id === input.project_id);
    const projectIds = new Set(projects.map((p) => p.id));
    const scoped = Boolean(input.client_id || input.project_id);
    const tasks = (await store.list("tasks")).filter((t) => !scoped || (t.project_id && projectIds.has(t.project_id)));
    let monitors = await store.list("monitors");
    if (scoped) monitors = monitors.filter((m) => (input.client_id && m.client_id === input.client_id) || (m.project_id && projectIds.has(m.project_id)));
    const monitorIds = new Set(monitors.map((m) => m.id));
    const incidents = (await store.list("incidents")).filter((i) => monitorIds.has(i.monitor_id) && inPeriod(i.opened_at, input.period_start, input.period_end));
    const activity = (await store.list("activity_log", { limit: 400 })).filter((a) => inPeriod(a.created_at, input.period_start, input.period_end) && (!scoped || (a.entity_id && (projectIds.has(a.entity_id) || tasks.some((t) => t.id === a.entity_id)))));

    const data = {
      periodo: { inicio: input.period_start, fim: input.period_end },
      projetos: projects.map((p) => ({ nome: p.name, status: p.status, etapa: p.stage, prazo: p.due_date, proxima_entrega: p.next_delivery, tarefas_total: tasks.filter((t) => t.project_id === p.id).length, tarefas_concluidas: tasks.filter((t) => t.project_id === p.id && t.status === "done").length })),
      tarefas: { total: tasks.length, por_status: Object.fromEntries(["todo", "doing", "waiting", "done"].map((s) => [s, tasks.filter((t) => t.status === s).length])), atrasadas: tasks.filter((t) => t.status !== "done" && t.due_date && t.due_date < new Date().toISOString().slice(0, 10)).map((t) => ({ titulo: t.title, prazo: t.due_date })), concluidas_no_periodo: tasks.filter((t) => t.status === "done" && inPeriod(t.updated_at, input.period_start, input.period_end)).map((t) => t.title) },
      monitoramento: monitors.map((m) => ({ nome: m.name, url: m.url, estado: m.last_status, http: m.last_http_status, latencia_ms: m.last_latency_ms, tls_vence: m.tls_expires_at, ultima_verificacao: m.last_checked_at })),
      incidentes: incidents.map((i) => ({ titulo: i.title, sinal: i.signal, severidade: i.severity, confianca: i.confidence, status: i.status, aberto_em: i.opened_at, resolvido_em: i.resolved_at })),
      atividades: activity.slice(0, 120).map((a) => ({ quando: a.created_at, resumo: a.summary })),
    };

    const limitations: string[] = [];
    if (!projects.length) limitations.push("Nenhum projeto registrado no escopo escolhido.");
    if (!tasks.length) limitations.push("Nenhuma tarefa registrada no escopo escolhido.");
    if (["monitoring", "incidents"].includes(input.type) && !monitors.some((m) => m.last_checked_at)) limitations.push("Nenhuma verificação de monitoramento realizada: disponibilidade e latência são desconhecidas.");
    if (["monitoring", "incidents"].includes(input.type)) limitations.push("Os dados vêm de verificações externas manuais; não há medição contínua de uptime.");
    if (!activity.length) limitations.push("Sem histórico de atividades no período.");

    const title = `${TITLES[input.type]} · ${input.period_start.split("-").reverse().join("/")} a ${input.period_end.split("-").reverse().join("/")}`;
    const { text, model } = await writeReport({ type: TITLES[input.type], title, audience: input.audience, period: `${input.period_start} a ${input.period_end}`, data, limitations });
    const report = await createEntity(
      "reports",
      { type: input.type, title, audience: input.audience, project_id: input.project_id ?? null, client_id: input.client_id ?? null, period_start: input.period_start, period_end: input.period_end, content_md: text, data_notes: limitations.join(" ") || null, ai_model: model },
      session,
    );
    return Response.json({ data: report, limitations });
  } catch (error) {
    return aiErrorResponse(error) ?? errorResponse(error);
  }
}
