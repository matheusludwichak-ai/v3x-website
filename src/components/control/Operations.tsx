"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Activity, AlertTriangle, CheckCircle2, FileBarChart, Info, Plus, Printer, RefreshCw, ShieldCheck, Trash2 } from "lucide-react";
import type { Monitor, Report } from "@/lib/control/schema";
import { AIBtn, Badge, Btn, Card, Confirm, Drawer, Empty, ErrorBox, Field, ModeBanner, Page, PageHeader, Select, Skeleton, SourceTag, TextInput, optionsOf } from "./ui";
import { RecordForm, type FieldDef } from "./RecordForm";
import { api, fmtDate, fmtDateTime, relative, today, useCollection, useSession } from "./lib/client";
import { useLookups } from "./lib/lookups";
import { renderMarkdown } from "@/lib/markdown";
import { CONFIDENCE_LABEL, MONITOR_STATUS_LABEL, MONITOR_STATUS_TONE, REPORT_TYPE_LABEL, SEVERITY_LABEL, label } from "./lib/labels";

/* ---------------- Monitoring ---------------- */

export function Monitoring() {
  const session = useSession();
  const monitors = useCollection("monitors");
  const incidents = useCollection("incidents");
  const look = useLookups();
  const [editing, setEditing] = useState<Monitor | "new" | null>(null);
  const [checking, setChecking] = useState<string | null>(null);

  const fields: FieldDef[] = [
    { name: "name", label: "Nome", required: true },
    { name: "url", label: "URL pública", type: "url", required: true, hint: "Endereço completo, com https://." },
    { name: "environment", label: "Ambiente", type: "select", required: true, half: true, options: [{ value: "production", label: "Produção" }, { value: "staging", label: "Homologação" }, { value: "development", label: "Desenvolvimento" }] },
    { name: "client_id", label: "Cliente", type: "select", options: look.clientOptions, half: true },
    { name: "project_id", label: "Projeto", type: "select", options: look.projectOptions, half: true, advanced: true },
    { name: "owner_id", label: "Responsável técnico", type: "select", options: look.peopleOptions, half: true, advanced: true },
    { name: "hosting", label: "Hospedagem", half: true, advanced: true, placeholder: "Ex.: Vercel" },
    { name: "repository", label: "Repositório autorizado", half: true, advanced: true },
    { name: "enabled", label: "Monitor ativo", type: "checkbox", advanced: true },
  ];

  const check = async (m: Monitor) => {
    setChecking(m.id);
    try {
      const res = await api<{ data: Monitor; result: { status: string; httpStatus: number | null; latencyMs: number | null; error: string | null } }>(`/api/control/monitors/${m.id}/check`, { method: "POST" });
      monitors.replace(res.data);
      incidents.reload();
      const r = res.result;
      toast[r.status === "up" ? "success" : "warning"](`${m.name}: ${label(MONITOR_STATUS_LABEL, r.status)}`, { description: r.error ?? `HTTP ${r.httpStatus} em ${r.latencyMs} ms` });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setChecking(null);
    }
  };

  const [now] = useState(() => Date.now());
  const tlsDays = (iso?: string | null) => (iso ? Math.floor((new Date(iso).getTime() - now) / 86400000) : null);

  return (
    <Page>
      <ModeBanner session={session} />
      <PageHeader
        eyebrow="Operações"
        title="Monitoramento"
        description="Sites, CRMs e sistemas entregues pela V3X. Cada estado vem de uma verificação externa real; sem verificação, o estado é Desconhecido."
        actions={
          <>
            <Btn icon={<RefreshCw className="size-4" />} disabled={monitors.readonly || !!checking || !monitors.rows.length} onClick={async () => { for (const m of monitors.rows.filter((x) => x.enabled)) await check(m); }}>
              Verificar todos
            </Btn>
            <Btn variant="primary" icon={<Plus className="size-4" />} onClick={() => setEditing("new")} disabled={monitors.readonly}>Adicionar site</Btn>
          </>
        }
      />
      <div className="cx-banner mb-6 flex gap-2">
        <Info className="mt-0.5 size-4 shrink-0" />
        <span>A verificação externa mede resposta HTTP, tempo de resposta e validade do certificado TLS. Builds, logs e erros internos exigem integração com o provedor de hospedagem e ainda não são coletados. As verificações são feitas sob demanda (sem rotina automática).</span>
      </div>

      {monitors.error && <ErrorBox message={monitors.error} onRetry={monitors.reload} />}
      {monitors.loading ? (
        <Skeleton rows={4} />
      ) : monitors.rows.length === 0 ? (
        <Empty icon={<Activity className="size-5" />} title="Nenhum site monitorado" action={!monitors.readonly && <Btn onClick={() => setEditing("new")}>Adicionar site</Btn>} />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {monitors.rows.map((m) => {
            const days = tlsDays(m.tls_expires_at);
            return (
              <Card key={m.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold">{m.name}</p>
                    <a href={m.url} target="_blank" rel="noreferrer" className="block truncate text-xs text-[#9cc2ff] hover:underline">{m.url}</a>
                  </div>
                  <Badge tone={MONITOR_STATUS_TONE[m.last_status]} dot>{label(MONITOR_STATUS_LABEL, m.last_status)}</Badge>
                </div>
                <dl className="mt-5 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                  <div><dt className="text-xs text-[#a0a0a0]">HTTP</dt><dd className="mt-0.5 font-medium">{m.last_http_status ?? "—"}</dd></div>
                  <div><dt className="text-xs text-[#a0a0a0]">Resposta</dt><dd className="mt-0.5 font-medium">{m.last_latency_ms != null ? `${m.last_latency_ms} ms` : "—"}</dd></div>
                  <div><dt className="text-xs text-[#a0a0a0]">Certificado TLS</dt><dd className={days !== null && days < 14 ? "mt-0.5 font-medium text-[#f3cf8b]" : "mt-0.5 font-medium"}>{days === null ? "—" : `${days} dias`}</dd></div>
                  <div><dt className="text-xs text-[#a0a0a0]">Verificado</dt><dd className="mt-0.5 font-medium">{relative(m.last_checked_at)}</dd></div>
                </dl>
                {m.last_error && <p className="mt-3 text-xs text-[#f6a3af]">{m.last_error}</p>}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-3 text-xs text-[#a0a0a0]">
                  <span>{[m.environment === "production" ? "Produção" : m.environment === "staging" ? "Homologação" : "Desenvolvimento", m.hosting, look.clientName(m.client_id)].filter(Boolean).join(" · ")}</span>
                  <div className="flex gap-2">
                    <Btn size="sm" variant="ghost" onClick={() => setEditing(m)} disabled={monitors.readonly}>Editar</Btn>
                    <Btn size="sm" icon={<ShieldCheck className="size-3.5" />} loading={checking === m.id} onClick={() => check(m)} disabled={monitors.readonly}>Verificar agora</Btn>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <h2 className="mb-3 mt-10 flex items-center gap-2 text-sm font-semibold"><AlertTriangle className="size-4 text-[#f3cf8b]" /> Incidentes e alertas</h2>
      {incidents.rows.length === 0 ? (
        <p className="text-sm text-[#a0a0a0]">Nenhum sinal registrado. Alertas surgem das verificações e informam o sinal observado, a severidade e o nível de confiança.</p>
      ) : (
        <div className="space-y-2">
          {incidents.rows.map((i) => (
            <div key={i.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-white/8 p-3 text-sm">
              {i.status === "open" ? <AlertTriangle className="size-4 text-[#f3cf8b]" /> : <CheckCircle2 className="size-4 text-[#7fb2ff]" />}
              <span className="font-medium">{i.title}</span>
              <span className="text-[#a0a0a0]">{monitors.rows.find((m) => m.id === i.monitor_id)?.name}</span>
              <span className="text-xs text-[#a0a0a0]">Sinal: {i.signal}</span>
              <Badge tone={i.severity === "high" ? "danger" : i.severity === "medium" ? "warning" : "neutral"}>Severidade {label(SEVERITY_LABEL, i.severity).toLowerCase()}</Badge>
              <Badge tone="muted">Confiança {label(CONFIDENCE_LABEL, i.confidence)}</Badge>
              <span className="ml-auto text-xs text-[#a0a0a0]">{i.status === "open" ? `Aberto ${relative(i.opened_at)}` : `Resolvido ${fmtDateTime(i.resolved_at)}`}</span>
            </div>
          ))}
        </div>
      )}
      <RecordForm open={editing !== null} title={editing === "new" ? "Adicionar site ao monitoramento" : "Editar monitor"} subtitle="O estado começa como Desconhecido até a primeira verificação." fields={fields} initial={editing === "new" ? { environment: "production", enabled: true } : (editing as unknown as Record<string, unknown>)} readonly={monitors.readonly} onClose={() => setEditing(null)} onSubmit={(v) => (editing === "new" ? monitors.create(v) : monitors.update((editing as Monitor).id, v))} onDelete={editing && editing !== "new" ? () => monitors.remove(editing.id) : undefined} />
    </Page>
  );
}

/* ---------------- Reports ---------------- */

export function Reports() {
  const session = useSession();
  const reports = useCollection("reports");
  const look = useLookups();
  const [type, setType] = useState<keyof typeof REPORT_TYPE_LABEL>("tasks");
  const [audience, setAudience] = useState<"internal" | "client">("internal");
  const [clientId, setClientId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [start, setStart] = useState(() => new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10));
  const [end, setEnd] = useState(today());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewing, setViewing] = useState<Report | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const projectOptions = useMemo(() => look.projects.filter((p) => !clientId || p.client_id === clientId).map((p) => ({ value: p.id, label: p.name })), [look.projects, clientId]);

  const generate = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await api<{ data: Report }>("/api/control/reports", { method: "POST", body: JSON.stringify({ type, audience, client_id: clientId || null, project_id: projectId || null, period_start: start, period_end: end }) });
      reports.setRows((r) => [res.data, ...r]);
      setViewing(res.data);
      toast.success("Relatório gerado");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Page>
      <ModeBanner session={session} />
      <PageHeader eyebrow="Operações" title="Relatórios" description="A IA redige o relatório usando apenas os registros do Control no período e escopo escolhidos, e informa quando os dados são insuficientes." />
      <Card title="Novo relatório" className="mb-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Tipo"><Select value={type} onChange={(e) => { const v = e.target.value as typeof type; setType(v); if (v === "executive") setAudience("client"); }} options={optionsOf(REPORT_TYPE_LABEL)} /></Field>
          <Field label="Destino"><Select value={audience} onChange={(e) => setAudience(e.target.value as typeof audience)} options={[{ value: "internal", label: "Uso interno" }, { value: "client", label: "Para um cliente" }]} /></Field>
          <Field label={`Cliente${audience === "client" ? " *" : ""}`} hint={audience === "client" ? "Obrigatório: o relatório só usa dados deste cliente." : undefined}><Select value={clientId} onChange={(e) => { setClientId(e.target.value); setProjectId(""); }} options={look.clientOptions} placeholder="Todos" /></Field>
          <Field label="Projeto"><Select value={projectId} onChange={(e) => setProjectId(e.target.value)} options={projectOptions} placeholder="Todos" /></Field>
          <Field label="De"><TextInput type="date" value={start} onChange={(e) => setStart(e.target.value)} /></Field>
          <Field label="Até"><TextInput type="date" value={end} onChange={(e) => setEnd(e.target.value)} /></Field>
        </div>
        {error && <div className="mt-4"><ErrorBox message={error} /></div>}
        <div className="mt-5 flex justify-end">
          <AIBtn session={session} loading={busy} onClick={generate} disabled={audience === "client" && !clientId}>Gerar relatório</AIBtn>
        </div>
      </Card>

      <h2 className="mb-3 text-sm font-semibold">Relatórios salvos</h2>
      {reports.loading ? (
        <Skeleton rows={3} />
      ) : reports.rows.length === 0 ? (
        <Empty icon={<FileBarChart className="size-5" />} title="Nenhum relatório ainda" text="Os relatórios gerados ficam salvos aqui para consulta e exportação em PDF." />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {reports.rows.map((r) => (
            <button key={r.id} className="cx-card text-left" onClick={() => setViewing(r)}>
              <div className="flex items-center gap-2">
                <Badge tone={r.audience === "client" ? "violet" : "neutral"}>{r.audience === "client" ? "Para cliente" : "Interno"}</Badge>
                <SourceTag kind="ai" />
              </div>
              <p className="mt-3 font-semibold leading-snug">{r.title}</p>
              <p className="mt-2 text-xs text-[#a0a0a0]">{look.clientName(r.client_id) ?? "Todos os clientes"} · gerado {relative(r.created_at)}</p>
            </button>
          ))}
        </div>
      )}

      <Drawer
        open={!!viewing}
        onClose={() => setViewing(null)}
        wide
        title={viewing?.title ?? ""}
        subtitle={viewing ? `${label(REPORT_TYPE_LABEL, viewing.type)} · ${fmtDate(viewing.period_start)} a ${fmtDate(viewing.period_end)}${viewing.ai_model ? ` · ${viewing.ai_model}` : ""}` : undefined}
        footer={
          viewing && (
            <>
              <Btn variant="danger" className="mr-auto" icon={<Trash2 className="size-4" />} onClick={() => setConfirmDelete(true)} disabled={reports.readonly}>Excluir</Btn>
              <Btn icon={<Printer className="size-4" />} onClick={() => printReport(viewing)}>Exportar PDF</Btn>
            </>
          )
        }
      >
        {viewing && (
          <>
            {viewing.data_notes && <div className="cx-banner cx-banner-warning mb-4"><strong>Limitações dos dados:</strong> {viewing.data_notes}</div>}
            <div className="cx-prose" dangerouslySetInnerHTML={{ __html: renderMarkdown(viewing.content_md) }} />
          </>
        )}
      </Drawer>
      <Confirm open={confirmDelete} title="Excluir relatório?" text="O relatório salvo será removido." confirmLabel="Excluir" tone="danger" onClose={() => setConfirmDelete(false)} onConfirm={async () => { if (!viewing) return; setConfirmDelete(false); try { await reports.remove(viewing.id); setViewing(null); } catch (e) { toast.error((e as Error).message); } }} />
    </Page>
  );
}

/** Opens a clean, printable page of the report; the browser's "Save as PDF" exports it. */
function printReport(r: Report) {
  const win = window.open("", "_blank", "noopener=no,width=900,height=1000");
  if (!win) return toast.error("Permita pop-ups para exportar o PDF.");
  const html = renderMarkdown(r.content_md);
  const notes = r.data_notes ? `<p class="notes"><strong>Limitações dos dados:</strong> ${r.data_notes.replace(/</g, "&lt;")}</p>` : "";
  win.document.write(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${r.title.replace(/</g, "&lt;")}</title><style>
    body{font-family:Sora,system-ui,sans-serif;color:#111;max-width:760px;margin:40px auto;padding:0 24px;line-height:1.6}
    header{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #3882F6;padding-bottom:12px;margin-bottom:24px}
    header b{font-size:20px;letter-spacing:.06em} header span{font-size:12px;color:#555}
    h1{font-size:24px} h2{font-size:18px;margin-top:28px;color:#1d3f8f} h3{font-size:15px}
    .notes{background:#fff7e6;border:1px solid #f0c060;padding:10px 14px;border-radius:8px;font-size:13px}
    footer{margin-top:40px;font-size:11px;color:#777;border-top:1px solid #ddd;padding-top:10px}
  </style></head><body><header><b>V3X</b><span>Digital Product Studio · grupov3x.com.br</span></header>${notes}${html}<footer>Relatório gerado no V3X Control com apoio de IA a partir dos registros do sistema. ${new Date(r.created_at).toLocaleString("pt-BR")}.</footer><script>window.onload=()=>{window.print()}<\/script></body></html>`);
  win.document.close();
}

