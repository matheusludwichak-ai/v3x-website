"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { CalendarDays, CheckSquare, ListChecks, Plus, Search, Trash2, Wand2 } from "lucide-react";
import type { Task } from "@/lib/control/schema";
import { AIBtn, Avatar, Badge, Btn, Confirm, Drawer, Empty, ErrorBox, Field, ModeBanner, Page, PageHeader, Select, Skeleton, Tabs, TextArea, TextInput, optionsOf, useDebounced } from "./ui";
import { ai, ApiError, fmtDate, relative, today, useCollection, useSession } from "./lib/client";
import { useLookups } from "./lib/lookups";
import { PRIORITY_LABEL, PRIORITY_TONE, TASK_STATUS_LABEL } from "./lib/labels";
import { cn } from "@/lib/utils";

const COLUMNS = ["todo", "doing", "waiting", "done"] as const;
type View = "status" | "project";

export function Tasks() {
  const session = useSession();
  const tasks = useCollection("tasks");
  const look = useLookups();
  const params = useSearchParams();
  const router = useRouter();
  const [view, setView] = useState<View>("status");
  const [query, setQuery] = useState("");
  const [assignee, setAssignee] = useState("");
  const [project, setProject] = useState("");
  const [priority, setPriority] = useState("");
  const [openId, setOpenId] = useState<string | null>(params.get("abrir"));
  const [over, setOver] = useState<string | null>(null);
  const quickRef = useRef<HTMLInputElement>(null);
  const q = useDebounced(query).trim().toLowerCase();
  const now = today();

  useEffect(() => {
    if (params.get("nova")) quickRef.current?.focus();
  }, [params]);

  const filtered = useMemo(
    () =>
      tasks.rows.filter(
        (t) =>
          (!q || `${t.title} ${t.description ?? ""}`.toLowerCase().includes(q)) &&
          (!assignee || t.assignee_id === assignee) &&
          (!project || t.project_id === project) &&
          (!priority || t.priority === priority),
      ),
    [tasks.rows, q, assignee, project, priority],
  );

  const move = async (id: string, status: Task["status"]) => {
    const task = tasks.rows.find((t) => t.id === id);
    if (!task || task.status === status) return;
    try {
      await tasks.update(id, { status });
      toast.success(`Movida para ${TASK_STATUS_LABEL[status]}`);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const quickAdd = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = quickRef.current;
    const title = input?.value.trim() ?? "";
    if (title.length < 2) return;
    try {
      await tasks.create({ title, status: "todo", priority: "medium", project_id: project || null, assignee_id: assignee || null });
      if (input) input.value = "";
      toast.success("Tarefa criada", { description: "Abra a tarefa para completar prazo, responsável e checklist." });
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const openTask = (id: string | null) => {
    setOpenId(id);
    router.replace(id ? `/control/tarefas?abrir=${id}` : "/control/tarefas", { scroll: false });
  };

  const Tile = ({ t }: { t: Task }) => {
    const late = t.status !== "done" && t.due_date && t.due_date < now;
    const done = t.checklist.filter((c) => c.done).length;
    return (
      <button
        type="button"
        className="cx-tile w-full"
        draggable={!tasks.readonly}
        onDragStart={(e) => e.dataTransfer.setData("text/plain", t.id)}
        onClick={() => openTask(t.id)}
      >
        <div className="flex items-start justify-between gap-2">
          <p className={cn("text-sm font-medium leading-snug", t.status === "done" && "text-[#a0a0a0] line-through")}>{t.title}</p>
          {t.source === "ai" && <Badge tone="violet">IA</Badge>}
        </div>
        {t.project_id && <p className="mt-1 truncate text-xs text-[#a0a0a0]">{look.projectName(t.project_id)}</p>}
        <div className="mt-3 flex items-center gap-2">
          <Badge tone={PRIORITY_TONE[t.priority]}>{PRIORITY_LABEL[t.priority]}</Badge>
          {t.checklist.length > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px] text-[#a0a0a0]">
              <ListChecks className="size-3.5" /> {done}/{t.checklist.length}
            </span>
          )}
          <span className={cn("ml-auto inline-flex items-center gap-1 text-[11px]", late ? "font-semibold text-[#f6a3af]" : "text-[#a0a0a0]")}>
            <CalendarDays className="size-3.5" />
            {t.due_date ? fmtDate(t.due_date) : "Sem prazo"}
          </span>
          {t.assignee_id && <Avatar name={look.personName(t.assignee_id)} className="!size-6" />}
        </div>
      </button>
    );
  };

  const groupsByProject = useMemo(() => {
    const groups = new Map<string, Task[]>();
    for (const t of filtered) {
      const key = t.project_id ?? "none";
      groups.set(key, [...(groups.get(key) ?? []), t]);
    }
    return [...groups.entries()].sort(([a], [b]) => (a === "none" ? 1 : b === "none" ? -1 : 0));
  }, [filtered]);

  const current = tasks.rows.find((t) => t.id === openId) ?? null;

  return (
    <Page>
      <ModeBanner session={session} />
      <PageHeader
        eyebrow="Dia a dia"
        title="Tarefas"
        description="Crie rápido, complete os detalhes depois. Arraste os cards entre as colunas ou mude o status dentro da tarefa."
        actions={
          <Btn variant="primary" icon={<Plus className="size-4" />} onClick={() => quickRef.current?.focus()} disabled={tasks.readonly}>
            Nova tarefa
          </Btn>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#6e6e76]" />
          <TextInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar tarefas" className="pl-9" aria-label="Buscar tarefas" />
        </div>
        <Select aria-label="Filtrar por responsável" value={assignee} onChange={(e) => setAssignee(e.target.value)} options={look.peopleOptions} placeholder="Todos os responsáveis" className="w-auto" />
        <Select aria-label="Filtrar por projeto" value={project} onChange={(e) => setProject(e.target.value)} options={look.projectOptions} placeholder="Todos os projetos" className="w-auto" />
        <Select aria-label="Filtrar por prioridade" value={priority} onChange={(e) => setPriority(e.target.value)} options={optionsOf(PRIORITY_LABEL)} placeholder="Qualquer prioridade" className="w-auto" />
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Tabs<View> value={view} onChange={setView} items={[{ value: "status", label: "Por status" }, { value: "project", label: "Por projeto" }]} />
        <form onSubmit={quickAdd} className="flex min-w-[280px] flex-1 justify-end gap-2 md:max-w-md">
          <TextInput ref={quickRef} placeholder="Criação rápida: escreva e pressione Enter" aria-label="Título da nova tarefa" disabled={tasks.readonly} />
          <Btn type="submit" disabled={tasks.readonly} icon={<Plus className="size-4" />}>
            Criar
          </Btn>
        </form>
      </div>

      {tasks.error && <ErrorBox message={tasks.error} onRetry={tasks.reload} />}
      {tasks.loading ? (
        <div className="cx-board">{COLUMNS.map((c) => <div key={c} className="cx-col"><Skeleton rows={3} /></div>)}</div>
      ) : tasks.rows.length === 0 ? (
        <Empty icon={<CheckSquare className="size-5" />} title="Nenhuma tarefa ainda" text="Use a criação rápida acima. Tarefas sugeridas pela IA nos projetos também chegam aqui depois que você confirma." />
      ) : view === "status" ? (
        <div className="cx-board">
          {COLUMNS.map((col) => {
            const list = filtered.filter((t) => t.status === col);
            return (
              <section
                key={col}
                className="cx-col"
                aria-label={TASK_STATUS_LABEL[col]}
                data-over={over === col}
                onDragOver={(e) => {
                  e.preventDefault();
                  setOver(col);
                }}
                onDragLeave={() => setOver(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  setOver(null);
                  move(e.dataTransfer.getData("text/plain"), col);
                }}
              >
                <div className="cx-col-head">
                  <span>{TASK_STATUS_LABEL[col]}</span>
                  <span className="cx-tab-count">{list.length}</span>
                </div>
                {list.map((t) => <Tile key={t.id} t={t} />)}
                {list.length === 0 && <p className="px-2 py-6 text-center text-xs text-[#6e6e76]">Solte uma tarefa aqui</p>}
              </section>
            );
          })}
        </div>
      ) : (
        <div className="space-y-6">
          {groupsByProject.map(([pid, list]) => (
            <section key={pid}>
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                {pid === "none" ? "Sem projeto" : look.projectName(pid) ?? "Projeto removido"}
                <span className="cx-tab-count">{list.length}</span>
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{list.map((t) => <Tile key={t.id} t={t} />)}</div>
            </section>
          ))}
        </div>
      )}

      <TaskDrawer
        key={current?.id ?? "none"}
        task={current}
        readonly={tasks.readonly}
        session={session}
        onClose={() => openTask(null)}
        onSave={async (patch) => {
          if (!current) return;
          await tasks.update(current.id, patch);
        }}
        onDelete={async () => {
          if (!current) return;
          await tasks.remove(current.id);
          openTask(null);
          toast.success("Tarefa removida");
        }}
      />
    </Page>
  );
}

function TaskDrawer({ task, readonly, session, onClose, onSave, onDelete }: { task: Task | null; readonly: boolean; session: ReturnType<typeof useSession>; onClose: () => void; onSave: (patch: Partial<Task>) => Promise<void>; onDelete: () => Promise<void> }) {
  const look = useLookups();
  const [draft, setDraft] = useState<Task | null>(task);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [suggested, setSuggested] = useState<string[]>([]);
  const [aiBusy, setAiBusy] = useState(false);
  const [newItem, setNewItem] = useState("");
  const history = useCollection("activity_log", task ? { entity_id: task.id } : { entity_id: "__none__" });

  if (!draft) return <Drawer open={false} onClose={onClose} title="">{null}</Drawer>;
  const set = <K extends keyof Task>(k: K, v: Task[K]) => setDraft((d) => (d ? { ...d, [k]: v } : d));

  const save = async () => {
    setSaving(true);
    setErrors({});
    try {
      await onSave({ title: draft.title, description: draft.description || null, status: draft.status, priority: draft.priority, assignee_id: draft.assignee_id || null, project_id: draft.project_id || null, due_date: draft.due_date || null, checklist: draft.checklist });
      toast.success("Tarefa salva");
      onClose();
    } catch (e) {
      if (e instanceof ApiError && e.fields) setErrors(e.fields);
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const suggestChecklist = async () => {
    setAiBusy(true);
    try {
      const res = await ai<{ items: string[] }>({ action: "tasks.checklist", title: draft.title, description: draft.description, project: look.projectName(draft.project_id) });
      setSuggested(res.items.filter((i) => !draft.checklist.some((c) => c.text === i)));
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setAiBusy(false);
    }
  };

  const addItem = (text: string) => set("checklist", [...draft.checklist, { id: crypto.randomUUID(), text, done: false }]);

  return (
    <Drawer
      open={!!task}
      onClose={onClose}
      title="Tarefa"
      subtitle={`Criada ${relative(draft.created_at)}${draft.source === "ai" ? " · sugerida pela IA e confirmada por uma pessoa" : ""}`}
      footer={
        <>
          <Btn variant="danger" icon={<Trash2 className="size-4" />} onClick={() => setConfirmDelete(true)} disabled={readonly} className="mr-auto">
            Excluir
          </Btn>
          <Btn variant="ghost" onClick={onClose}>
            Cancelar
          </Btn>
          <Btn variant="primary" loading={saving} onClick={save} disabled={readonly}>
            Salvar
          </Btn>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Título" error={errors.title}>
          <TextInput value={draft.title} onChange={(e) => set("title", e.target.value)} invalid={!!errors.title} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Status">
            <Select value={draft.status} onChange={(e) => set("status", e.target.value as Task["status"])} options={optionsOf(TASK_STATUS_LABEL)} />
          </Field>
          <Field label="Prioridade">
            <Select value={draft.priority} onChange={(e) => set("priority", e.target.value as Task["priority"])} options={optionsOf(PRIORITY_LABEL)} />
          </Field>
          <Field label="Responsável">
            <Select value={draft.assignee_id ?? ""} onChange={(e) => set("assignee_id", e.target.value || null)} options={look.peopleOptions} placeholder="Sem responsável" />
          </Field>
          <Field label="Prazo" error={errors.due_date}>
            <TextInput type="date" value={draft.due_date ?? ""} onChange={(e) => set("due_date", e.target.value || null)} />
          </Field>
        </div>
        <Field label="Projeto">
          <Select value={draft.project_id ?? ""} onChange={(e) => set("project_id", e.target.value || null)} options={look.projectOptions} placeholder="Sem projeto" />
        </Field>
        <Field label="Descrição">
          <TextArea value={draft.description ?? ""} onChange={(e) => set("description", e.target.value)} placeholder="Contexto, links, critério de pronto…" />
        </Field>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="cx-label">Checklist</span>
            <AIBtn session={session} size="sm" loading={aiBusy} onClick={suggestChecklist}>
              Sugerir checklist
            </AIBtn>
          </div>
          <ul className="space-y-1.5">
            {draft.checklist.map((item) => (
              <li key={item.id} className="flex items-center gap-2 rounded-lg border border-white/6 px-3 py-2">
                <input type="checkbox" checked={item.done} onChange={(e) => set("checklist", draft.checklist.map((c) => (c.id === item.id ? { ...c, done: e.target.checked } : c)))} className="size-4 accent-[#3882f6]" aria-label={item.text} />
                <span className={cn("flex-1 text-sm", item.done && "text-[#a0a0a0] line-through")}>{item.text}</span>
                <button className="cx-icon-btn !size-7" aria-label="Remover item" onClick={() => set("checklist", draft.checklist.filter((c) => c.id !== item.id))}>
                  <Trash2 className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
          <form
            className="mt-2 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (newItem.trim()) addItem(newItem.trim());
              setNewItem("");
            }}
          >
            <TextInput value={newItem} onChange={(e) => setNewItem(e.target.value)} placeholder="Adicionar item" aria-label="Novo item do checklist" />
            <Btn type="submit" size="sm" variant="ghost">
              Adicionar
            </Btn>
          </form>
          {suggested.length > 0 && (
            <div className="mt-3 rounded-xl border border-[rgb(136_86_207/30%)] bg-[rgb(136_86_207/6%)] p-3">
              <p className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#dccbfa]">
                <Wand2 className="size-3.5" /> Sugestões da IA: adicione só o que fizer sentido
              </p>
              <ul className="space-y-1">
                {suggested.map((s) => (
                  <li key={s} className="flex items-center gap-2 text-sm">
                    <span className="flex-1">{s}</span>
                    <Btn
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        addItem(s);
                        setSuggested((list) => list.filter((x) => x !== s));
                      }}
                    >
                      Adicionar
                    </Btn>
                  </li>
                ))}
              </ul>
              <Btn
                size="sm"
                variant="ghost"
                className="mt-2"
                onClick={() => {
                  suggested.forEach(addItem);
                  setSuggested([]);
                }}
              >
                Adicionar todos
              </Btn>
            </div>
          )}
        </div>

        <div>
          <span className="cx-label">Histórico</span>
          {history.rows.length === 0 ? (
            <p className="mt-2 text-xs text-[#a0a0a0]">Sem alterações registradas.</p>
          ) : (
            <ul className="mt-2 space-y-1.5">
              {history.rows.slice(0, 8).map((h) => (
                <li key={h.id} className="flex justify-between gap-3 text-xs">
                  <span className="text-[#d6d6da]">{h.summary}</span>
                  <span className="shrink-0 text-[#a0a0a0]">{relative(h.created_at)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <Confirm open={confirmDelete} title="Excluir tarefa?" text="A tarefa e o checklist serão removidos. O histórico do projeto mantém o registro da exclusão." confirmLabel="Excluir" tone="danger" onClose={() => setConfirmDelete(false)} onConfirm={async () => { setConfirmDelete(false); await onDelete(); }} />
    </Drawer>
  );
}
