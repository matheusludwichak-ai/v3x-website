import { team } from "@/data/team";

/**
 * Real starting records: the three founders exactly as registered on the site
 * (src/data/team.ts) and the V3X site itself as the first monitored property.
 * Nothing here is invented. Monitor status starts as "unknown" until checked.
 */
export function realSeed(now: string) {
  const base = { created_at: now, updated_at: now };
  const ceo = team.find((m) => m.slug === "matheus-ludwichak");
  const org = team.map((m, i) => ({
    id: `org-${m.slug}`,
    name: m.name,
    role: m.role,
    role_confirmed: true,
    area: m.area,
    manager_id: m.slug === "matheus-ludwichak" ? null : ceo ? `org-${ceo.slug}` : null,
    responsibilities: [] as string[],
    active: true,
    sort: i,
    ...base,
  }));
  const monitors = [
    {
      id: "mon-grupov3x",
      name: "Site institucional V3X",
      url: "https://grupov3x.com.br",
      client_id: null,
      project_id: null,
      environment: "production",
      hosting: "Vercel",
      repository: "github.com/matheusludwichak-ai/v3x-website",
      owner_id: ceo ? `org-${ceo.slug}` : null,
      enabled: true,
      last_status: "unknown",
      last_http_status: null,
      last_latency_ms: null,
      tls_expires_at: null,
      last_checked_at: null,
      last_error: null,
      ...base,
    },
  ];
  return { org_members: org, monitors };
}

/**
 * Demonstration records, used only in production while no database is configured.
 * Every record is labelled "Exemplo" so it can never be mistaken for real data.
 */
export function demoSeed(now: string) {
  const base = { created_at: now, updated_at: now };
  const day = (offset: number) => new Date(Date.now() + offset * 86400000).toISOString().slice(0, 10);
  return {
    projects: [
      { id: "demo-p1", name: "Exemplo: Portal do cliente", kind: "client", client_id: "demo-c1", status: "active", stage: "development", owner_id: "org-isabella-christina", summary: "Projeto de demonstração para visualizar a interface.", start_date: day(-20), due_date: day(25), next_delivery: "Protótipo navegável", next_delivery_date: day(6), ...base },
      { id: "demo-p2", name: "Exemplo: Site institucional", kind: "client", client_id: "demo-c1", status: "planning", stage: "discovery", owner_id: "org-matheus-ludwichak", summary: "Projeto de demonstração.", start_date: day(-3), due_date: day(40), next_delivery: "Arquitetura de conteúdo", next_delivery_date: day(10), ...base },
    ],
    clients: [{ id: "demo-c1", name: "Exemplo: Cliente demonstrativo", company: "Empresa fictícia", email: null, phone: null, status: "active", notes: "Registro de demonstração.", ...base }],
    tasks: [
      { id: "demo-t1", title: "Exemplo: revisar fluxo de cadastro", description: null, status: "doing", priority: "high", assignee_id: "org-isabella-christina", project_id: "demo-p1", due_date: day(2), checklist: [], source: "manual", ...base },
      { id: "demo-t2", title: "Exemplo: briefing de conteúdo", description: null, status: "todo", priority: "medium", assignee_id: "org-matheus-ludwichak", project_id: "demo-p2", due_date: day(5), checklist: [], source: "manual", ...base },
      { id: "demo-t3", title: "Exemplo: aprovar paleta", description: null, status: "done", priority: "low", assignee_id: "org-matheus-ludwichak", project_id: "demo-p1", due_date: day(-4), checklist: [], source: "manual", ...base },
    ],
  };
}
