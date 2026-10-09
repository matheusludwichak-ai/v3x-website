"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderKanban, CheckSquare, Users, GitBranch, Images, Film, FileText, UserRound, Settings, PanelLeftClose, PanelLeftOpen, ArrowUpRight, Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { ControlProvider } from "./Store";
import { cn } from "@/lib/utils";
import { WorkspaceTools } from "./WorkspaceTools";

export const navItems = [
 { slug: "overview", title: "Visão geral", icon: LayoutDashboard }, { slug: "projects", title: "Projetos", icon: FolderKanban }, { slug: "tasks", title: "Tarefas", icon: CheckSquare }, { slug: "clients", title: "Clientes", icon: Users }, { slug: "pipeline", title: "Pipeline", icon: GitBranch }, { slug: "portfolio", title: "Portfólio", icon: Images }, { slug: "motion-library", title: "Biblioteca de motion", icon: Film }, { slug: "blog", title: "Blog", icon: FileText }, { slug: "team", title: "Equipe", icon: UserRound }, { slug: "settings", title: "Configurações", icon: Settings },
];

export function ControlShell({ children }: { children: ReactNode }) {
 const [collapsed, setCollapsed] = useState(false); const [mobile, setMobile] = useState(false);
 const path = usePathname();
 return <ControlProvider><div className="control-workspace flex min-h-screen bg-background">
  {mobile && <div className="fixed inset-0 z-30 bg-background/80 md:hidden" onClick={() => setMobile(false)} />}
  <aside className={cn("fixed inset-y-0 left-0 z-40 flex flex-col border-r border-border bg-sidebar transition-all md:sticky md:top-0 md:h-screen", collapsed ? "w-[76px]" : "w-[224px]", mobile ? "translate-x-0" : "-translate-x-full md:translate-x-0")}>
   <div className="flex h-20 items-center justify-between px-6"><Link href="/" aria-label="Voltar ao site da V3X"><Logo className={cn("text-2xl", collapsed && "text-xl")} /></Link>{!collapsed && <span className="label-mono">CONTROL</span>}</div>
   <div className="mx-4 mb-6 border-y border-border py-3">{!collapsed ? <div className="flex items-center gap-3 px-2"><span className="grid size-7 place-items-center rounded bg-gradient-x text-primary-foreground text-xs">V</span><div className="text-xs">Workspace V3X<div className="mt-1 text-[10px] text-muted-foreground">Protótipo / dados de exemplo</div></div></div> : <span className="grid place-items-center text-xs">V</span>}</div>
   <nav className="flex-1 space-y-1 overflow-y-auto px-3">{navItems.map(({ slug, title, icon: Icon }) => {
    const href = slug === "overview" ? "/control" : `/control/${slug}`;
    const active = slug === "overview" ? path === "/control" || path === "/control/" : path.endsWith("/" + slug);
    const content = <><Icon className="size-4 shrink-0" />{!collapsed && <span>{title}</span>}{active && !collapsed && <span className="ml-auto size-1 rounded-full bg-brand-blue" />}</>;
    return <Button key={slug} variant="ghost" render={<Link href={href} onClick={() => setMobile(false)} />} nativeButton={false} className={cn("h-10 w-full justify-start gap-3 font-normal text-muted-foreground", active && "control-nav-active bg-sidebar-accent text-foreground")} title={collapsed ? title : undefined}>{content}</Button>;
   })}</nav>
   <div className="border-t border-border p-4"><Button variant="ghost" render={<Link href="/" />} nativeButton={false} className="w-full justify-start text-muted-foreground">{!collapsed && "Voltar ao site"}<ArrowUpRight className="size-4" /></Button><Button variant="ghost" className="mt-2 hidden w-full justify-start text-muted-foreground md:flex" onClick={() => setCollapsed(c => !c)} title="Recolher ou expandir menu">{collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}{!collapsed && "Recolher"}</Button></div>
  </aside>
  <div className="min-w-0 flex-1"><header className="flex h-16 items-center justify-between gap-2 border-b border-border px-4 md:px-8"><div className="flex min-w-0 items-center gap-2"><Button size="icon" variant="ghost" className="shrink-0 md:hidden" aria-label="Abrir navegação" onClick={() => setMobile(m => !m)}>{mobile ? <X /> : <Menu />}</Button><span className="truncate text-xs text-muted-foreground"><span className="hidden sm:inline">Workspace <span className="mx-3 text-border">/</span></span><span className="text-foreground">{navItems.find(n => path.endsWith(n.slug))?.title ?? "Visão geral"}</span></span></div><WorkspaceTools /></header>{children}</div>
 </div></ControlProvider>;
}
