"use client";

import Link from "next/link";
import { Activity, ArrowRight, FileBarChart, FolderKanban, LockKeyhole } from "lucide-react";
import { Badge, Card, Empty, Page, PageHeader, Skeleton } from "./ui";
import { fmtDate, relative, useCollection } from "./lib/client";
import { MONITOR_STATUS_LABEL, MONITOR_STATUS_TONE, PROJECT_STATUS_LABEL, PROJECT_STATUS_TONE, label } from "./lib/labels";

/**
 * Home for client accounts (role client_viewer). The database (RLS) only returns this
 * client's projects, client-facing reports and monitored sites, so nothing here is filtered
 * in the browser: what the API returns is exactly what the client may see.
 */
export function ClientHome() {
  const projects = useCollection("projects");
  const reports = useCollection("reports");
  const monitors = useCollection("monitors");

  return (
    <Page>
      <PageHeader eyebrow="Portal do cliente" title="Acompanhe seu projeto" description="Andamento, próximas entregas, relatórios e a saúde dos seus sites, atualizados pela equipe da V3X." />

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Card title="Projetos" action={<Link href="/control/projetos" className="cx-link">Ver todos <ArrowRight className="size-3.5" /></Link>}>
          {projects.loading ? (
            <Skeleton rows={3} />
          ) : projects.rows.length === 0 ? (
            <Empty icon={<FolderKanban className="size-5" />} title="Nenhum projeto vinculado" text="Quando a V3X vincular um projeto à sua conta, ele aparece aqui." />
          ) : (
            <ul className="divide-y divide-white/5">
              {projects.rows.map((p) => (
                <li key={p.id}>
                  <Link href={`/control/projetos/${p.id}`} className="flex flex-wrap items-center gap-3 py-3 hover:text-white">
                    <span className="min-w-0 flex-1 truncate font-medium">{p.name}</span>
                    <Badge tone={PROJECT_STATUS_TONE[p.status]}>{label(PROJECT_STATUS_LABEL, p.status)}</Badge>
                    {p.next_delivery && (
                      <span className="w-full text-xs text-[#a0a0a0]">
                        Próxima entrega: {p.next_delivery}
                        {p.next_delivery_date ? ` · ${fmtDate(p.next_delivery_date)}` : ""}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <div className="space-y-5">
          <Card title="Seus sites">
            {monitors.loading ? (
              <Skeleton rows={2} />
            ) : monitors.rows.length === 0 ? (
              <Empty icon={<Activity className="size-5" />} title="Nenhum site monitorado" />
            ) : (
              <ul className="space-y-3">
                {monitors.rows.map((m) => (
                  <li key={m.id} className="flex items-center gap-3 text-sm">
                    <span className="min-w-0 flex-1 truncate">{m.name}</span>
                    <Badge tone={MONITOR_STATUS_TONE[m.last_status]} dot>{label(MONITOR_STATUS_LABEL, m.last_status)}</Badge>
                    <span className="text-[11px] text-[#6e6e76]">{relative(m.last_checked_at)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="Relatórios" action={<Link href="/control/relatorios" className="cx-link">Abrir <ArrowRight className="size-3.5" /></Link>}>
            {reports.loading ? (
              <Skeleton rows={2} />
            ) : reports.rows.length === 0 ? (
              <Empty icon={<FileBarChart className="size-5" />} title="Nenhum relatório ainda" />
            ) : (
              <ul className="space-y-2 text-sm">
                {reports.rows.slice(0, 5).map((r) => (
                  <li key={r.id} className="flex items-center gap-3">
                    <span className="min-w-0 flex-1 truncate">{r.title}</span>
                    <span className="text-[11px] text-[#6e6e76]">{fmtDate(r.created_at)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </Page>
  );
}

/** Shown when a client account opens an internal page by URL. */
export function ClientRestricted() {
  return (
    <Page>
      <Empty icon={<LockKeyhole className="size-5" />} title="Área interna da V3X" text="Esta seção é usada só pela equipe. Seus projetos, relatórios e sites estão no menu." action={<Link href="/control" className="cx-link">Voltar ao início <ArrowRight className="size-3.5" /></Link>} />
    </Page>
  );
}
