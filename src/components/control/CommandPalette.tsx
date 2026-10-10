"use client";

import { useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog as D } from "@base-ui/react/dialog";
import { ArrowRight, Building2, CheckSquare, CornerDownLeft, FileText, Film, FolderKanban, GitBranch, Images, Search, Sparkles } from "lucide-react";
import { api } from "./lib/client";
import { NAV } from "./nav";
import { cn } from "@/lib/utils";

type Item = { id: string; group: string; label: string; hint?: string; href: string; icon: React.ComponentType<{ className?: string }> };

const SOURCES = [
  { entity: "tasks", group: "Tarefas", icon: CheckSquare, label: (r: Record<string, unknown>) => String(r.title), href: (r: Record<string, unknown>) => `/control/tarefas?abrir=${r.id}` },
  { entity: "projects", group: "Projetos", icon: FolderKanban, label: (r: Record<string, unknown>) => String(r.name), href: (r: Record<string, unknown>) => `/control/projetos/${r.id}` },
  { entity: "articles", group: "Artigos", icon: FileText, label: (r: Record<string, unknown>) => String(r.title), href: (r: Record<string, unknown>) => `/control/blog/${r.id}` },
  { entity: "clients", group: "Clientes", icon: Building2, label: (r: Record<string, unknown>) => String(r.name), href: () => "/control/clientes" },
  { entity: "leads", group: "Pipeline", icon: GitBranch, label: (r: Record<string, unknown>) => String(r.company), href: () => "/control/pipeline" },
  { entity: "portfolio_items", group: "Portfólio", icon: Images, label: (r: Record<string, unknown>) => String(r.name), href: () => "/control/portfolio" },
  { entity: "motion_items", group: "Motion", icon: Film, label: (r: Record<string, unknown>) => String(r.title), href: () => "/control/motion" },
] as const;

const ACTIONS: Item[] = [
  { id: "a-task", group: "Ações", label: "Nova tarefa", href: "/control/tarefas?nova=1", icon: CheckSquare },
  { id: "a-article", group: "Ações", label: "Criar artigo com IA", href: "/control/blog/novo", icon: Sparkles },
  { id: "a-project", group: "Ações", label: "Novo projeto", href: "/control/projetos?novo=1", icon: FolderKanban },
  { id: "a-report", group: "Ações", label: "Gerar relatório", href: "/control/relatorios", icon: Sparkles },
];

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Global search and quick actions (Ctrl/Cmd + K). Loads records once per opening. */
export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [records, setRecords] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const load = () => {
    setLoading(true);
    Promise.all(
      SOURCES.map((s) =>
        api<{ data: Record<string, unknown>[] }>(`/api/control/data/${s.entity}?limit=300`)
          .then((r) => r.data.map<Item>((row) => ({ id: `${s.entity}-${row.id}`, group: s.group, label: s.label(row), href: s.href(row), icon: s.icon })))
          .catch(() => [] as Item[]),
      ),
    ).then((all) => {
      setRecords(all.flat());
      setLoading(false);
    });
  };

  /** Opens with a clean query and fresh records (also used by the topbar button). */
  const show = useEffectEvent(() => {
    setQuery("");
    setActive(0);
    setOpen(true);
    load();
  });
  const toggle = useEffectEvent(() => (open ? setOpen(false) : show()));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggle();
      }
    };
    const onOpen = () => show();
    window.addEventListener("keydown", onKey);
    window.addEventListener("control:search", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("control:search", onOpen);
    };
  }, []);

  const pages: Item[] = useMemo(() => NAV.flatMap((g) => g.items.map((i) => ({ id: `nav-${i.href}`, group: "Ir para", label: i.label, hint: g.group, href: i.href, icon: i.icon }))), []);

  const results = useMemo(() => {
    const q = norm(query.trim());
    if (!q) return [...ACTIONS, ...pages];
    const terms = q.split(/\s+/);
    const match = (i: Item) => {
      const text = norm(i.label);
      return terms.every((t) => text.includes(t));
    };
    return [...ACTIONS.filter(match), ...pages.filter(match), ...records.filter(match).slice(0, 40)];
  }, [query, records, pages]);

  const go = (item: Item | undefined) => {
    if (!item) return;
    setOpen(false);
    router.push(item.href);
  };

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  let lastGroup = "";
  return (
    <D.Root
      open={open}
      onOpenChange={setOpen}
    >
      <D.Portal>
        <D.Backdrop className="cx-backdrop" />
        <D.Popup className="cx-modal !top-[18%] !w-[min(640px,calc(100vw-2rem))] !translate-y-0 !p-0" aria-label="Buscar no Control">
          <D.Title className="sr-only">Buscar no Control</D.Title>
          <div className="flex items-center gap-3 border-b border-white/8 px-4">
            <Search className="size-4 text-[#a0a0a0]" />
            <input
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setActive((a) => Math.min(a + 1, results.length - 1));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setActive((a) => Math.max(a - 1, 0));
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  go(results[active]);
                }
              }}
              placeholder="Buscar tarefas, projetos, artigos, clientes… ou uma ação"
              className="h-14 flex-1 bg-transparent text-[15px] outline-none placeholder:text-[#6e6e76]"
              aria-label="Buscar"
            />
            <kbd className="rounded-md border border-white/10 px-1.5 py-0.5 text-[10px] text-[#a0a0a0]">Esc</kbd>
          </div>
          <div ref={listRef} className="max-h-[52vh] overflow-y-auto p-2" data-lenis-prevent role="listbox">
            {results.length === 0 && <p className="px-3 py-8 text-center text-sm text-[#a0a0a0]">{loading ? "Carregando…" : "Nada encontrado."}</p>}
            {results.map((item, i) => {
              const header = item.group !== lastGroup ? item.group : null;
              lastGroup = item.group;
              const Icon = item.icon;
              return (
                <div key={item.id}>
                  {header && <p className="px-3 pb-1 pt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#6e6e76]">{header}</p>}
                  <button
                    data-index={i}
                    role="option"
                    aria-selected={i === active}
                    onMouseMove={() => setActive(i)}
                    onClick={() => go(item)}
                    className={cn("flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm", i === active ? "bg-[rgb(56_130_246/14%)] text-white" : "text-[#d6d6da]")}
                  >
                    <Icon className="size-4 shrink-0 text-[#9cc2ff]" />
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {item.hint && <span className="text-[11px] text-[#6e6e76]">{item.hint}</span>}
                    {i === active ? <CornerDownLeft className="size-3.5 text-[#a0a0a0]" /> : <ArrowRight className="size-3.5 text-transparent" />}
                  </button>
                </div>
              );
            })}
          </div>
        </D.Popup>
      </D.Portal>
    </D.Root>
  );
}
