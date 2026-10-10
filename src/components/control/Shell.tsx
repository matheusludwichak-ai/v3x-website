"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  MessageCircle,
  FolderKanban,
  GitBranch,
  Building2,
  FileText,
  Images,
  Film,
  Activity,
  FileBarChart,
  Network,
  PlugZap,
  Menu,
  X,
  ArrowUpRight,
  LogOut,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { supabaseBrowser } from "@/lib/control/browser";
import { SITE_URL } from "@/config/site";
import { useSession } from "./lib/client";
import { Badge } from "./ui";
import { cn } from "@/lib/utils";

export const NAV = [
  {
    group: "Dia a dia",
    items: [
      { href: "/control", label: "Visão geral", icon: LayoutDashboard },
      { href: "/control/tarefas", label: "Tarefas", icon: CheckSquare },
      { href: "/control/atendimento", label: "Atendimento", icon: MessageCircle },
    ],
  },
  {
    group: "Projetos",
    items: [
      { href: "/control/projetos", label: "Projetos", icon: FolderKanban },
      { href: "/control/pipeline", label: "Pipeline comercial", icon: GitBranch },
      { href: "/control/clientes", label: "Clientes", icon: Building2 },
    ],
  },
  {
    group: "Conteúdo",
    items: [
      { href: "/control/blog", label: "Blog", icon: FileText },
      { href: "/control/portfolio", label: "Portfólio", icon: Images },
      { href: "/control/motion", label: "Biblioteca de motion", icon: Film },
    ],
  },
  {
    group: "Operações",
    items: [
      { href: "/control/monitoramento", label: "Monitoramento", icon: Activity },
      { href: "/control/relatorios", label: "Relatórios", icon: FileBarChart },
    ],
  },
  {
    group: "Empresa",
    items: [
      { href: "/control/organizacao", label: "Organização", icon: Network },
      { href: "/control/integracoes", label: "Integrações", icon: PlugZap },
    ],
  },
];

const ALL = NAV.flatMap((g) => g.items);
const isActive = (path: string, href: string) => (href === "/control" ? path === "/control" : path === href || path.startsWith(`${href}/`));

export function ControlShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const session = useSession();
  const [open, setOpen] = useState(false);
  const current = ALL.find((i) => isActive(path, i.href));

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const signOut = async () => {
    await supabaseBrowser()?.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const modeBadge = !session ? null : session.mode === "supabase" ? (
    <Badge tone="blue" dot>{session.user?.email ?? "Conectado"}</Badge>
  ) : session.mode === "local" ? (
    <Badge tone="violet" dot>Desenvolvimento local</Badge>
  ) : (
    <Badge tone="warning" dot>Demonstração</Badge>
  );

  return (
    <div className="control-root cx-shell" data-lenis-prevent>
      {open && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setOpen(false)} aria-hidden />}
      <aside className="cx-side" data-open={open} aria-label="Navegação do Control">
        <div className="flex h-[3.75rem] items-center justify-between border-b border-white/5 px-5">
          <Link href="/control" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <Logo className="w-[74px]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a0a0a0]">Control</span>
          </Link>
          <button className="cx-icon-btn lg:hidden" onClick={() => setOpen(false)} aria-label="Fechar navegação">
            <X className="size-4" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto pb-6">
          {NAV.map((g) => (
            <div key={g.group} className="cx-side-group">
              <p className="cx-side-label">{g.group}</p>
              {g.items.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} onClick={() => setOpen(false)} aria-current={isActive(path, href) ? "page" : undefined} className={cn("cx-nav", isActive(path, href) && "is-active")}>
                  <Icon className="size-4 shrink-0" />
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <div className="space-y-1 border-t border-white/5 p-3">
          <a href={SITE_URL} className="cx-nav">
            <ArrowUpRight className="size-4" /> Ver o site
          </a>
          {session?.mode === "supabase" && session.user && (
            <button onClick={signOut} className="cx-nav w-[calc(100%-1.2rem)]">
              <LogOut className="size-4" /> Sair
            </button>
          )}
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="cx-topbar">
          <div className="flex min-w-0 items-center gap-2">
            <button className="cx-icon-btn lg:hidden" onClick={() => setOpen(true)} aria-label="Abrir navegação" aria-expanded={open}>
              <Menu className="size-5" />
            </button>
            <span className="truncate text-sm text-[#a0a0a0]">
              <span className="hidden sm:inline">Workspace V3X <span className="mx-2 text-white/20">/</span></span>
              <span className="text-white">{current?.label ?? "Control"}</span>
            </span>
          </div>
          {modeBadge}
        </div>
        {children}
      </div>
    </div>
  );
}
