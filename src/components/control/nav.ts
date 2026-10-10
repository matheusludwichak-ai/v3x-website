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
} from "lucide-react";

/** Control navigation. Client accounts see only the items marked forClients. */
export const NAV: { group: string; items: { href: string; label: string; icon: typeof LayoutDashboard; forClients?: boolean }[] }[] = [
  {
    group: "Dia a dia",
    items: [
      { href: "/control", label: "Visão geral", icon: LayoutDashboard, forClients: true },
      { href: "/control/tarefas", label: "Tarefas", icon: CheckSquare },
      { href: "/control/atendimento", label: "Atendimento", icon: MessageCircle },
    ],
  },
  {
    group: "Projetos",
    items: [
      { href: "/control/projetos", label: "Projetos", icon: FolderKanban, forClients: true },
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
      { href: "/control/monitoramento", label: "Monitoramento", icon: Activity, forClients: true },
      { href: "/control/relatorios", label: "Relatórios", icon: FileBarChart, forClients: true },
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


/** Navigation for the given role: client accounts only get the client-facing pages. */
export function navFor(role: string | undefined) {
  if (role !== "client_viewer") return NAV;
  return NAV.map((g) => ({ ...g, items: g.items.filter((i) => i.forClients) })).filter((g) => g.items.length);
}
