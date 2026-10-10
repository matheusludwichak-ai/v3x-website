"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, CalendarDays, FolderKanban, Pencil, Plus, Search, Sparkles } from "lucide-react";
import type { Project, Task } from "@/lib/control/schema";
import { AIBtn, Avatar, Badge, Btn, Card, Empty, ErrorBox, ModeBanner, Page, PageHeader, Progress, Select, Skeleton, Tabs, TextInput, optionsOf, useDebounced } from "./ui";
import { RecordForm, type FieldDef } from "./RecordForm";
import { ai, api, fmtDate, relative, today, useCollection, useRecord, useSession } from "./lib/client";
import { useLookups } from "./lib/lookups";
import { renderMarkdown } from "@/lib/markdown";
import { PRIORITY_LABEL, PRIORITY_TONE, PROJECT_STAGE_LABEL, PROJECT_STATUS_LABEL, PROJECT_STATUS_TONE, TASK_STATUS_LABEL, TASK_STATUS_TONE, label } from "./lib/labels";

export function projectFields(look: ReturnType<typeof useLookups>): FieldDef[] {
  return [
    { name: "name", label: "Nome do projeto", required: true },
    { name: "kind", label: "Tipo", type: "select", options: [{ value: "client", label: "Projeto de cliente" }, { value: "internal", label: "Projeto interno" }], required: true, half: true },
    { name: "client_id", label: "Cliente", type: "select", options: look.clientOptions, half: true, hint: look.clientOptions.length ? undefined : "Cadastre clientes em Clientes." },
    { name: "status", label: "Status", type: "select", options: optionsOf(PROJECT_STATUS_LABEL), required: true, half: true },
    { name: "stage", label: "Etapa", type: "select", options: optionsOf(PROJECT_STAGE_LABEL), required: true, half: true },
    { name: "owner_id", label: "Responsável", type: "select", options: look.peopleOptions, half: true },
    { name: "due_date", label: "Prazo final", type: "date", half: true },
    { name: "summary", label: "Resumo", type: "textarea", advanced: true },
    { name: "start_date", label: "Início", type: "date", half: true, advanced: true },
    { name: "next_delivery_date", label: "Data da próxima entrega", type: "date", half: true, advanced: true },
    { name: "next_delivery", label: "Próxima entrega", advanced: true, placeholder: "Ex.: protótipo navegável" },
  ];
}

const progressOf = (tasks: Task[]) => (tasks.length ? (tasks.filter((t) => t.status === "done").length / tasks.length) * 100 : null);

export function ProjectsList() {
  const session = useSession();
  const projects = useCollection("projects");
  const tasks = useCollection("tasks");
  const look = useLookups();
  const params = useSearchParams();
  const router = useRouter();
  const novo = Boolean(params.get("novo"));
  const [creating, setCreating] = useState(novo);
  // Opening "Novo projeto" from the search palette while already on this page.
  const [lastNovo, setLastNovo] = useState(novo);
  if (novo !== lastNovo) {
    setLastNovo(novo);
    if (novo) setCreating(true);
  }
  const [status, setStatus] = useState<"open" | "done" | "all">("open");
  const [query, setQuery] = useState("");
  const q = useDebounced(query).trim().toLowerCase();

  const list = useMemo(
    () =>
      projects.rows
        .filter((p) => (status === "all" ? true : status === "done" ? p.status === "done" : p.status !== "done"))
        .filter((p) => !q || `${p.name} ${look.clientName(p.client_id) ?? ""}`.toLowerCase().includes(q))
        .sort((a, b) => (a.due_date ?? "9999").localeCompare(b.due_date ?? "9999")),
    [projects.rows, status, q, look],
  );

  return (
    <Page>
      <ModeBanner session={session} />
      <PageHeader
        eyebrow="Projetos"
        title="Projetos em desenvolvimento"
        description={<>Acompanhamento de entrega: etapas, responsáveis, prazos e tarefas. Oportunidades de venda ficam no <Link href="/control/pipeline">Pipeline comercial</Link>.</>}
        actions={<Btn variant="primary" icon={<Plus className="size-4" />} onClick={() => setCreating(true)} disabled={projects.readonly}>Novo projeto</Btn>}
      />
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Tabs value={status} onChange={setStatus} items={[{ value: "open", label: "Ativos", count: projects.rows.filter((p) => p.status !== "done").length }, { value: "done", label: "Concluídos", count: projects.rows.filter((p) => p.status === "done").length }, { value: "all", label: "Todos" }]} />
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#6e6e76]" />
          <TextInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar projeto ou cliente" className="pl-9" aria-label="Buscar projetos" />
        </div>
      </div>
      {projects.error && <ErrorBox message={projects.error} onRetry={projects.reload} />}
      {projects.loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{[0, 1, 2].map((i) => <div key={i} className="cx-card"><Skeleton rows={4} /></div>)}</div>
      ) : list.length === 0 ? (
        <Empty icon={<FolderKanban className="size-5" />} title={projects.rows.length ? "Nada neste filtro" : "Nenhum projeto cadastrado"} text="Projetos reais da V3X entram aqui. Nada é criado automaticamente." action={!projects.readonly && <Btn variant="secondary" onClick={() => setCreating(true)}>Cadastrar projeto</Btn>} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((p) => {
            const pt = tasks.rows.filter((t) => t.project_id === p.id);
            const pct = progressOf(pt);
            const late = p.status !== "done" && p.due_date && p.due_date < today();
            const open = pt.filter((t) => t.status !== "done").length;
            return (
              <Link key={p.id} href={`/control/projetos/${p.id}`} className="cx-card group flex flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-[#a0a0a0]">{p.kind === "internal" ? "Projeto interno" : look.clientName(p.client_id) ?? "Cliente não definido"}</p>
                    <h2 className="mt-1 text-base font-semibold leading-snug">{p.name}</h2>
                  </div>
                  <Badge tone={PROJECT_STATUS_TONE[p.status]}>{label(PROJECT_STATUS_LABEL, p.status)}</Badge>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-[#a0a0a0]">
                  <span className="rounded-md bg-white/5 px-2 py-0.5 text-[#d6d6da]">{label(PROJECT_STAGE_LABEL, p.stage)}</span>
                  <span className={late ? "font-semibold text-[#f6a3af]" : ""}>
                    <CalendarDays className="mr-1 inline size-3.5" />
                    {p.due_date ? `Prazo ${fmtDate(p.due_date)}` : "Sem prazo"}
                  </span>
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <Progress value={pct ?? 0} className="flex-1" />
                  <span className="text-[11px] text-[#a0a0a0]">{pct === null ? "Sem tarefas" : `${Math.round(pct)}%`}</span>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-xs text-[#a0a0a0]">
                  <span className="flex items-center gap-2">
                    <Avatar name={look.personName(p.owner_id)} className="!size-6" /> {look.personName(p.owner_id) ?? "Sem responsável"}
                  </span>
                  <span>{open} tarefa{open === 1 ? "" : "s"} aberta{open === 1 ? "" : "s"}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
      <RecordForm
        open={creating}
        title="Novo projeto"
        subtitle="Só o essencial agora. Detalhes podem ser completados depois."
        fields={projectFields(look)}
        initial={{ kind: "client", status: "planning", stage: "discovery" }}
        readonly={projects.readonly}
        onClose={() => {
          setCreating(false);
          if (params.get("novo")) router.replace("/control/projetos");
        }}
        onSubmit={async (v) => {
          const row = await projects.create(v);
          router.push(`/control/projetos/${row.id}`);
        }}
      />
    </Page>
  );
}

export function ProjectDetail({ id }: { id: string }) {
  const session = useSession();
  const { row: project, setRow, loading, error, reload } = useRecord("projects", id);
  const tasks = useCollection("tasks", { project_id: id });
  const history = useCollection("activity_log", { entity_id: id });
  const look = useLookups();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [brief, setBrief] = useState<string | null>(null);
  const [briefBusy, setBriefBusy] = useState(false);
  const [suggestions, setSuggestions] = useState<{ title: string; priority: Task["priority"]; reason: string }[]>([]);
  const [suggestBusy, setSuggestBusy] = useState(false);
  const [quick, setQuick] = useState("");

  if (loading) return <Page><Skeleton rows={6} /></Page>;
  if (error || !project) return <Page><ErrorBox message={error ?? "Projeto não encontrado."} onRetry={reload} /></Page>;

  const pct = progressOf(tasks.rows);
  const context = () =>
    JSON.stringify({
      projeto: { nome: project.name, tipo: project.kind, cliente: look.clientName(project.client_id), status: label(PROJECT_STATUS_LABEL, project.status), etapa: label(PROJECT_STAGE_LABEL, project.stage), prazo: project.due_date, proxima_entrega: project.next_delivery, data_proxima_entrega: project.next_delivery_date, resumo: project.summary },
      hoje: today(),
      tarefas: tasks.rows.map((t) => ({ titulo: t.title, status: TASK_STATUS_LABEL[t.status], prioridade: t.priority, prazo: t.due_date, responsavel: look.personName(t.assignee_id) })),
      historico_recente: history.rows.slice(0, 15).map((h) => h.summary),
    });

  const runBrief = async () => {
    setBriefBusy(true);
    try {
      setBrief((await ai<{ text: string }>({ action: "projects.brief", context: context() })).text);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBriefBusy(false);
    }
  };
  const runSuggest = async () => {
    setSuggestBusy(true);
    try {
      const res = await ai<{ tasks: typeof suggestions }>({ action: "tasks.suggest", context: context() });
      setSuggestions(res.tasks.filter((s) => !tasks.rows.some((t) => t.title.toLowerCase() === s.title.toLowerCase())));
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSuggestBusy(false);
    }
  };
  const accept = async (s: (typeof suggestions)[number]) => {
    try {
      await tasks.create({ title: s.title, priority: s.priority, project_id: id, status: "todo", source: "ai" });
      setSuggestions((list) => list.filter((x) => x !== s));
      toast.success("Tarefa criada");
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <Page>
      <ModeBanner session={session} />
      <Link href="/control/projetos" className="mb-4 inline-flex items-center gap-2 text-sm text-[#a0a0a0] hover:text-white">
        <ArrowLeft className="size-4" /> Projetos
      </Link>
      <PageHeader
        eyebrow={project.kind === "internal" ? "Projeto interno" : look.clientName(project.client_id) ?? "Cliente não definido"}
        title={project.name}
        description={project.summary ?? "Sem resumo. Edite o projeto para adicionar contexto."}
        actions={
          <>
            <Badge tone={PROJECT_STATUS_TONE[project.status]}>{label(PROJECT_STATUS_LABEL, project.status)}</Badge>
            <Btn icon={<Pencil className="size-4" />} onClick={() => setEditing(true)} disabled={tasks.readonly}>Editar</Btn>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <Card title="Progresso" action={<span className="text-xs text-[#a0a0a0]">Calculado pelas tarefas concluídas</span>}>
            <div className="flex items-center gap-4">
              <Progress value={pct ?? 0} className="flex-1" />
              <span className="text-sm font-semibold">{pct === null ? "—" : `${Math.round(pct)}%`}</span>
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
              <div><dt className="text-xs text-[#a0a0a0]">Etapa</dt><dd className="mt-1 font-medium">{label(PROJECT_STAGE_LABEL, project.stage)}</dd></div>
              <div><dt className="text-xs text-[#a0a0a0]">Responsável</dt><dd className="mt-1 font-medium">{look.personName(project.owner_id) ?? "—"}</dd></div>
              <div><dt className="text-xs text-[#a0a0a0]">Prazo final</dt><dd className="mt-1 font-medium">{fmtDate(project.due_date)}</dd></div>
              <div><dt className="text-xs text-[#a0a0a0]">Próxima entrega</dt><dd className="mt-1 font-medium">{project.next_delivery ? `${project.next_delivery} · ${fmtDate(project.next_delivery_date)}` : "—"}</dd></div>
            </dl>
          </Card>

          <Card title={`Tarefas (${tasks.rows.length})`} action={<Link href="/control/tarefas" className="text-xs text-[#9cc2ff] hover:underline">Abrir quadro</Link>}>
            <form
              className="mb-3 flex gap-2"
              onSubmit={async (e) => {
                e.preventDefault();
                if (quick.trim().length < 2) return;
                try {
                  await tasks.create({ title: quick.trim(), project_id: id, status: "todo" });
                  setQuick("");
                } catch (err) {
                  toast.error((err as Error).message);
                }
              }}
            >
              <TextInput value={quick} onChange={(e) => setQuick(e.target.value)} placeholder="Nova tarefa neste projeto" aria-label="Nova tarefa neste projeto" disabled={tasks.readonly} />
              <Btn type="submit" disabled={tasks.readonly}>Criar</Btn>
            </form>
            {tasks.rows.length === 0 ? (
              <p className="py-4 text-sm text-[#a0a0a0]">Sem tarefas. O progresso aparece quando houver tarefas.</p>
            ) : (
              <ul className="divide-y divide-white/5">
                {tasks.rows.map((t) => (
                  <li key={t.id} className="flex items-center gap-3 py-2.5">
                    <Select aria-label={`Status de ${t.title}`} value={t.status} onChange={(e) => tasks.update(t.id, { status: e.target.value }).catch((er) => toast.error(er.message))} options={optionsOf(TASK_STATUS_LABEL)} className="!w-36 !py-1.5 text-xs" />
                    <Link href={`/control/tarefas?abrir=${t.id}`} className="min-w-0 flex-1 truncate text-sm hover:text-white">{t.title}</Link>
                    <Badge tone={PRIORITY_TONE[t.priority]}>{PRIORITY_LABEL[t.priority]}</Badge>
                    <Badge tone={TASK_STATUS_TONE[t.status]}>{fmtDate(t.due_date)}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="Resumo e próximos passos" action={<AIBtn session={session} size="sm" loading={briefBusy} onClick={runBrief}>{brief ? "Atualizar" : "Gerar"}</AIBtn>}>
            {brief ? <div className="cx-prose text-sm" dangerouslySetInnerHTML={{ __html: renderMarkdown(brief) }} /> : <p className="text-sm text-[#a0a0a0]">A IA lê só os dados deste projeto (tarefas, prazos e histórico) e diz o que falta quando a informação for insuficiente.</p>}
          </Card>
          <Card title="Tarefas sugeridas" action={<AIBtn session={session} size="sm" loading={suggestBusy} onClick={runSuggest}>Sugerir</AIBtn>}>
            {suggestions.length === 0 ? (
              <p className="text-sm text-[#a0a0a0]">As sugestões só viram tarefas quando você confirma cada uma.</p>
            ) : (
              <ul className="space-y-2">
                {suggestions.map((s) => (
                  <li key={s.title} className="rounded-xl border border-[rgb(136_86_207/25%)] p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium">{s.title}</p>
                      <Badge tone={PRIORITY_TONE[s.priority]}>{PRIORITY_LABEL[s.priority]}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-[#a0a0a0]">{s.reason}</p>
                    <div className="mt-2 flex gap-2">
                      <Btn size="sm" variant="secondary" icon={<Sparkles className="size-3.5" />} onClick={() => accept(s)}>Criar tarefa</Btn>
                      <Btn size="sm" variant="ghost" onClick={() => setSuggestions((l) => l.filter((x) => x !== s))}>Descartar</Btn>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <Card title="Histórico">
            {history.rows.length === 0 ? (
              <p className="text-sm text-[#a0a0a0]">Sem alterações registradas.</p>
            ) : (
              <ol className="space-y-3">
                {history.rows.slice(0, 12).map((h) => (
                  <li key={h.id} className="border-l-2 border-[rgb(56_130_246/40%)] pl-3 text-sm">
                    <p>{h.summary}</p>
                    <p className="text-[11px] text-[#a0a0a0]">{relative(h.created_at)}{h.actor ? ` · ${h.actor}` : ""}</p>
                  </li>
                ))}
              </ol>
            )}
          </Card>
        </div>
      </div>

      <RecordForm
        open={editing}
        title="Editar projeto"
        fields={projectFields(look)}
        initial={project as unknown as Record<string, unknown>}
        readonly={tasks.readonly}
        onClose={() => setEditing(false)}
        onSubmit={async (v) => {
          const res = await api<{ data: Project }>(`/api/control/data/projects/${id}`, { method: "PATCH", body: JSON.stringify(v) });
          setRow(res.data);
          history.reload();
        }}
        onDelete={async () => {
          await api(`/api/control/data/projects/${id}`, { method: "DELETE" });
          router.push("/control/projetos");
        }}
        deleteText="O projeto será removido. As tarefas continuam existindo, sem projeto vinculado."
      />
    </Page>
  );
}
