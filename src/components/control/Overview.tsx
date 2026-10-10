"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Activity, ArrowRight, CheckSquare, FileText, FolderKanban, MessageCircle, Plus, Sparkles, FileBarChart, AlertTriangle } from "lucide-react";
import { Avatar, Badge, Card, Empty, ErrorBox, ModeBanner, Page, PageHeader, Progress, Skeleton, SourceTag } from "./ui";
import { relative, today, fmtDate, useCollection, useSession } from "./lib/client";
import { useLookups } from "./lib/lookups";
import { ARTICLE_STATUS_LABEL, ARTICLE_STATUS_TONE, MONITOR_STATUS_LABEL, MONITOR_STATUS_TONE, PRIORITY_LABEL, PRIORITY_TONE, PROJECT_STATUS_LABEL, PROJECT_STATUS_TONE, SEVERITY_LABEL, label } from "./lib/labels";

const PRIORITY_RANK = { urgent: 0, high: 1, medium: 2, low: 3 } as const;

export function Overview() {
  const session = useSession();
  const tasks = useCollection("tasks");
  const articles = useCollection("articles");
  const monitors = useCollection("monitors");
  const incidents = useCollection("incidents", { status: "open" });
  const activity = useCollection("activity_log");
  const conversations = useCollection("conversations");
  const look = useLookups();
  const demo = session?.mode === "demo";
  const now = today();

  const priorities = useMemo(
    () =>
      tasks.rows
        .filter((t) => t.status !== "done")
        .sort((a, b) => {
          const ao = a.due_date && a.due_date < now ? 0 : 1;
          const bo = b.due_date && b.due_date < now ? 0 : 1;
          return ao - bo || PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] || (a.due_date ?? "9999").localeCompare(b.due_date ?? "9999");
        })
        .slice(0, 6),
    [tasks.rows, now],
  );
  const overdue = tasks.rows.filter((t) => t.status !== "done" && t.due_date && t.due_date < now).length;
  const activeProjects = look.projects.filter((p) => p.status === "active" || p.status === "waiting");
  const reviewQueue = articles.rows.filter((a) => a.status === "review" || a.status === "approved");
  const pendingChats = conversations.rows.filter((c) => c.status === "pending").length;

  const progressOf = (projectId: string) => {
    const list = tasks.rows.filter((t) => t.project_id === projectId);
    return list.length ? { pct: (list.filter((t) => t.status === "done").length / list.length) * 100, total: list.length } : null;
  };

  const shortcuts = [
    { href: "/control/tarefas?nova=1", label: "Nova tarefa", icon: Plus },
    { href: "/control/blog/novo", label: "Criar artigo com IA", icon: Sparkles },
    { href: "/control/projetos?novo=1", label: "Novo projeto", icon: FolderKanban },
    { href: "/control/relatorios", label: "Gerar relatório", icon: FileBarChart },
  ];

  return (
    <Page>
      <ModeBanner session={session} />
      <PageHeader eyebrow="Visão geral" title="O que precisa de atenção hoje" description="Prioridades, entregas e pendências reunidas a partir dos registros do Control. Nenhum número aqui é estimado." actions={demo ? <SourceTag kind="demo" /> : <SourceTag kind="real" />} />

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {shortcuts.map(({ href, label: text, icon: Icon }) => (
          <Link key={href} href={href} className="cx-card group flex items-center gap-3 !p-4">
            <span className="grid size-9 place-items-center rounded-xl bg-[rgb(56_130_246/12%)] text-[#9cc2ff]">
              <Icon className="size-4" />
            </span>
            <span className="text-sm font-medium">{text}</span>
            <ArrowRight className="ml-auto size-4 text-[#a0a0a0] transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card
          className="xl:col-span-2"
          title={
            <span className="flex items-center gap-2">
              <CheckSquare className="size-4 text-[#9cc2ff]" /> Prioridades
              {overdue > 0 && <Badge tone="danger">{overdue} atrasada{overdue > 1 ? "s" : ""}</Badge>}
            </span>
          }
          action={<Link href="/control/tarefas" className="text-xs text-[#9cc2ff] hover:underline">Ver todas</Link>}
        >
          {tasks.loading ? (
            <Skeleton rows={4} />
          ) : tasks.error ? (
            <ErrorBox message={tasks.error} onRetry={tasks.reload} />
          ) : priorities.length === 0 ? (
            <Empty icon={<CheckSquare className="size-5" />} title="Nenhuma tarefa aberta" text="Crie tarefas para acompanhar o trabalho da semana." action={<Link className="cx-btn cx-btn-secondary" href="/control/tarefas?nova=1">Nova tarefa</Link>} />
          ) : (
            <ul className="divide-y divide-white/5">
              {priorities.map((t) => {
                const late = t.due_date && t.due_date < now;
                return (
                  <li key={t.id}>
                    <Link href={`/control/tarefas?abrir=${t.id}`} className="flex items-center gap-3 py-3 transition-colors hover:text-white">
                      <Avatar name={look.personName(t.assignee_id)} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{t.title}</p>
                        <p className="truncate text-xs text-[#a0a0a0]">{look.projectName(t.project_id) ?? "Sem projeto"}</p>
                      </div>
                      <Badge tone={PRIORITY_TONE[t.priority]}>{label(PRIORITY_LABEL, t.priority)}</Badge>
                      <span className={late ? "w-16 text-right text-xs font-semibold text-[#f6a3af]" : "w-16 text-right text-xs text-[#a0a0a0]"}>{fmtDate(t.due_date)}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card title={<span className="flex items-center gap-2"><FileText className="size-4 text-[#c9b2f3]" /> Artigos aguardando você</span>} action={<Link href="/control/blog" className="text-xs text-[#9cc2ff] hover:underline">Blog</Link>}>
          {articles.loading ? (
            <Skeleton rows={3} />
          ) : reviewQueue.length === 0 ? (
            <Empty title="Nada para revisar" text="Artigos enviados para revisão aparecem aqui." action={<Link className="cx-btn cx-btn-ai" href="/control/blog/novo"><Sparkles className="size-4" /> Criar artigo com IA</Link>} />
          ) : (
            <ul className="space-y-2">
              {reviewQueue.slice(0, 5).map((a) => (
                <li key={a.id}>
                  <Link href={`/control/blog/${a.id}`} className="block rounded-xl border border-white/5 p-3 transition-colors hover:border-white/15">
                    <div className="flex items-center justify-between gap-2">
                      <Badge tone={ARTICLE_STATUS_TONE[a.status]}>{label(ARTICLE_STATUS_LABEL, a.status)}</Badge>
                      <span className="text-[11px] text-[#a0a0a0]">{relative(a.updated_at)}</span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm font-medium">{a.title}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="xl:col-span-2" title={<span className="flex items-center gap-2"><FolderKanban className="size-4 text-[#9cc2ff]" /> Projetos em andamento</span>} action={<Link href="/control/projetos" className="text-xs text-[#9cc2ff] hover:underline">Ver projetos</Link>}>
          {look.loading ? (
            <Skeleton rows={3} />
          ) : activeProjects.length === 0 ? (
            <Empty title="Nenhum projeto em andamento" text="Projetos com status Em andamento ou Aguardando cliente aparecem aqui." />
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {activeProjects.slice(0, 6).map((p) => {
                const prog = progressOf(p.id);
                return (
                  <Link key={p.id} href={`/control/projetos/${p.id}`} className="rounded-2xl border border-white/6 bg-white/[0.015] p-4 transition-colors hover:border-white/15">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold">{p.name}</p>
                      <Badge tone={PROJECT_STATUS_TONE[p.status]}>{label(PROJECT_STATUS_LABEL, p.status)}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-[#a0a0a0]">{look.clientName(p.client_id) ?? (p.kind === "internal" ? "Projeto interno" : "Sem cliente")}</p>
                    <div className="mt-4 flex items-center gap-3">
                      <Progress value={prog?.pct ?? 0} className="flex-1" />
                      <span className="text-[11px] text-[#a0a0a0]">{prog ? `${Math.round(prog.pct)}% de ${prog.total} tarefas` : "Sem tarefas"}</span>
                    </div>
                    {p.next_delivery && <p className="mt-3 text-xs text-[#d6d6da]">Próxima entrega: {p.next_delivery} · {fmtDate(p.next_delivery_date)}</p>}
                  </Link>
                );
              })}
            </div>
          )}
        </Card>

        <div className="space-y-4">
          <Card title={<span className="flex items-center gap-2"><Activity className="size-4 text-[#9cc2ff]" /> Monitoramento</span>} action={<Link href="/control/monitoramento" className="text-xs text-[#9cc2ff] hover:underline">Abrir</Link>}>
            {monitors.loading ? (
              <Skeleton rows={2} />
            ) : monitors.rows.length === 0 ? (
              <p className="text-sm text-[#a0a0a0]">Nenhum site cadastrado.</p>
            ) : (
              <ul className="space-y-2">
                {monitors.rows.slice(0, 4).map((m) => (
                  <li key={m.id} className="flex items-center justify-between gap-2 text-sm">
                    <span className="truncate">{m.name}</span>
                    <Badge tone={MONITOR_STATUS_TONE[m.last_status]} dot>{label(MONITOR_STATUS_LABEL, m.last_status)}</Badge>
                  </li>
                ))}
              </ul>
            )}
            {incidents.rows.length > 0 && (
              <div className="mt-4 space-y-2 border-t border-white/5 pt-3">
                {incidents.rows.slice(0, 3).map((i) => (
                  <p key={i.id} className="flex items-start gap-2 text-xs text-[#f6dfb3]">
                    <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                    {i.title} · severidade {label(SEVERITY_LABEL, i.severity).toLowerCase()}
                  </p>
                ))}
              </div>
            )}
          </Card>

          <Card title={<span className="flex items-center gap-2"><MessageCircle className="size-4 text-[#9cc2ff]" /> Atendimento</span>} action={<Link href="/control/atendimento" className="text-xs text-[#9cc2ff] hover:underline">Abrir</Link>}>
            {!session?.whatsapp.configured ? (
              <p className="text-sm text-[#a0a0a0]">Integração com o WhatsApp não configurada.</p>
            ) : (
              <p className="text-sm">{pendingChats ? `${pendingChats} conversa${pendingChats > 1 ? "s" : ""} aguardando resposta` : "Nenhuma conversa pendente."}</p>
            )}
          </Card>
        </div>

        <Card className="xl:col-span-3" title="Atividade recente">
          {activity.loading ? (
            <Skeleton rows={3} />
          ) : activity.rows.length === 0 ? (
            <p className="text-sm text-[#a0a0a0]">As ações feitas no Control (criar, mover, publicar) aparecem aqui.</p>
          ) : (
            <ul className="grid gap-x-8 gap-y-2 md:grid-cols-2">
              {activity.rows.slice(0, 10).map((a) => (
                <li key={a.id} className="flex items-baseline justify-between gap-3 border-b border-white/5 py-2 text-sm">
                  <span className="min-w-0 truncate">{a.summary}</span>
                  <span className="shrink-0 text-[11px] text-[#a0a0a0]">{relative(a.created_at)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </Page>
  );
}
