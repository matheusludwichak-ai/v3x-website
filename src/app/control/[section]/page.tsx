import { notFound, permanentRedirect } from "next/navigation";

/* Old prototype URLs keep working: they point to the reorganized modules. */
const MOVED: Record<string, string> = {
  projects: "/control/projetos",
  tasks: "/control/tarefas",
  clients: "/control/clientes",
  portfolio: "/control/portfolio",
  "motion-library": "/control/motion",
  team: "/control/organizacao",
  equipe: "/control/organizacao",
  time: "/control/organizacao",
  configuracoes: "/control/integracoes",
  settings: "/control/integracoes",
};

export default async function LegacySection({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const target = MOVED[section];
  if (!target) notFound();
  permanentRedirect(target);
}
