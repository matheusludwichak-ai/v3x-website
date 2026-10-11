"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, CheckCircle2, CircleDashed, HelpCircle, Network, Plus, RefreshCw, UserRound, XCircle } from "lucide-react";
import type { OrgMember } from "@/lib/control/schema";
import { Avatar, Badge, Btn, Card, Empty, ErrorBox, ModeBanner, Page, PageHeader, Skeleton } from "./ui";
import { RecordForm, type FieldDef } from "./RecordForm";
import { WhatsAppConnect } from "./WhatsAppConnect";
import { api, useCollection, useSession } from "./lib/client";
import { cn } from "@/lib/utils";

/* ---------------- Organization chart ---------------- */

function PersonCard({ m, onOpen, reports }: { m: OrgMember; onOpen: () => void; reports: number }) {
  return (
    <button onClick={onOpen} className={cn("cx-card w-[17rem] text-left", !m.active && "opacity-50")}>
      <div className="flex items-center gap-3">
        <Avatar name={m.name} className="!size-10 text-xs" />
        <div className="min-w-0">
          <p className="font-semibold leading-snug">{m.name}</p>
          <p className="truncate text-xs text-[#a0a0a0]">{m.role || "Cargo a definir"}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {m.area && <Badge tone="blue">{m.area}</Badge>}
        {!m.role_confirmed && <Badge tone="warning">Cargo pendente</Badge>}
        {!m.active && <Badge tone="muted">Inativo</Badge>}
        {reports > 0 && <Badge tone="neutral">{reports} direto{reports > 1 ? "s" : ""}</Badge>}
      </div>
      {m.responsibilities.length > 0 && <p className="mt-3 line-clamp-2 text-xs text-[#a0a0a0]">{m.responsibilities.join(" · ")}</p>}
    </button>
  );
}

export function Organization() {
  const session = useSession();
  const people = useCollection("org_members");
  const [editing, setEditing] = useState<OrgMember | "new" | null>(null);
  const [showInactive, setShowInactive] = useState(false);

  const visible = people.rows.filter((p) => showInactive || p.active).sort((a, b) => a.sort - b.sort);
  const ids = new Set(visible.map((p) => p.id));
  const roots = visible.filter((p) => !p.manager_id || !ids.has(p.manager_id));
  const childrenOf = (id: string) => visible.filter((p) => p.manager_id === id);

  const fields: FieldDef[] = [
    { name: "name", label: "Nome", required: true },
    { name: "role", label: "Cargo", half: true, placeholder: "Deixe vazio se ainda não definido" },
    { name: "area", label: "Área", half: true, placeholder: "Ex.: Tecnologia" },
    { name: "role_confirmed", label: "Cargo confirmado", type: "checkbox", hint: "Desmarcado, o card mostra o cargo como pendente." },
    { name: "manager_id", label: "Responsável direto", type: "select", options: people.rows.filter((p) => editing === "new" || p.id !== (editing as OrgMember | null)?.id).map((p) => ({ value: p.id, label: p.name })), half: true },
    { name: "sort", label: "Ordem", type: "number", half: true, advanced: true },
    { name: "responsibilities", label: "Responsabilidades", type: "tags", advanced: true },
    { name: "active", label: "Pessoa ativa", type: "checkbox", advanced: true, hint: "Pessoas não são apagadas: desative para manter o histórico." },
  ];

  const Branch = ({ m }: { m: OrgMember }) => {
    const kids = childrenOf(m.id);
    return (
      <li className="flex flex-col items-center">
        <PersonCard m={m} reports={kids.length} onOpen={() => setEditing(m)} />
        {kids.length > 0 && (
          <>
            <span aria-hidden className="h-6 w-px bg-white/15" />
            <ul className="relative flex flex-wrap justify-center gap-6 pt-6 before:absolute before:left-[15%] before:right-[15%] before:top-0 before:h-px before:bg-white/15">
              {kids.map((k) => (
                <div key={k.id} className="relative before:absolute before:-top-6 before:left-1/2 before:h-6 before:w-px before:bg-white/15">
                  <Branch m={k} />
                </div>
              ))}
            </ul>
          </>
        )}
      </li>
    );
  };

  return (
    <Page>
      <ModeBanner session={session} />
      <PageHeader
        eyebrow="Empresa"
        title="Organização"
        description="Estrutura da V3X em organograma. Estar no organograma não cria acesso ao Control: logins e permissões são gerenciados à parte."
        actions={
          <>
            <Btn variant="ghost" onClick={() => setShowInactive((v) => !v)}>{showInactive ? "Ocultar inativos" : "Mostrar inativos"}</Btn>
            <Btn variant="primary" icon={<Plus className="size-4" />} onClick={() => setEditing("new")} disabled={people.readonly}>Adicionar pessoa</Btn>
          </>
        }
      />
      {people.error && <ErrorBox message={people.error} onRetry={people.reload} />}
      {people.loading ? (
        <Skeleton rows={3} />
      ) : visible.length === 0 ? (
        <Empty icon={<Network className="size-5" />} title="Organograma vazio" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/6 bg-white/[0.01] p-8">
          <ul className="flex min-w-max justify-center gap-10">{roots.map((r) => <Branch key={r.id} m={r} />)}</ul>
        </div>
      )}
      <p className="mt-4 flex items-center gap-2 text-xs text-[#a0a0a0]"><UserRound className="size-3.5" /> Nomes e cargos iniciais vêm do cadastro dos fundadores no site. Clique em uma pessoa para editar.</p>
      <RecordForm open={editing !== null} title={editing === "new" ? "Adicionar pessoa" : "Pessoa"} subtitle="Não cria conta de acesso." fields={fields} initial={editing === "new" ? { active: true, role_confirmed: false, sort: people.rows.length } : (editing as unknown as Record<string, unknown>)} readonly={people.readonly} onClose={() => setEditing(null)} onSubmit={(v) => (editing === "new" ? people.create(v) : people.update((editing as OrgMember).id, v))} />
    </Page>
  );
}

/* ---------------- Integrations ---------------- */

type Integration = { id: string; name: string; state: "ok" | "pending" | "error" | "unknown"; summary: string; details: { label: string; value: string }[]; setup?: string[] };

const STATE = {
  ok: { label: "Verificada", tone: "success" as const, icon: CheckCircle2 },
  pending: { label: "Não configurada", tone: "warning" as const, icon: CircleDashed },
  error: { label: "Com erro", tone: "danger" as const, icon: XCircle },
  unknown: { label: "Não verificada", tone: "muted" as const, icon: HelpCircle },
};

export function Integrations() {
  const session = useSession();
  const [items, setItems] = useState<Integration[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [canVerify, setCanVerify] = useState(false);

  const load = useCallback(async (verify = false) => {
    setError(null);
    if (verify) setVerifying(true);
    try {
      const res = await api<{ data: Integration[]; canVerify: boolean }>(`/api/control/integrations${verify ? "?verify=1" : ""}`);
      setItems(res.data);
      setCanVerify(res.canVerify);
      if (verify) toast.success("Verificação concluída");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setVerifying(false);
    }
  }, []);

  useEffect(() => {
    let alive = true;
    api<{ data: Integration[]; canVerify: boolean }>("/api/control/integrations").then(
      (res) => {
        if (!alive) return;
        setItems(res.data);
        setCanVerify(res.canVerify);
      },
      (e) => alive && setError((e as Error).message),
    );
    return () => {
      alive = false;
    };
  }, []);

  return (
    <Page>
      <ModeBanner session={session} />
      <PageHeader
        eyebrow="Empresa"
        title="Integrações"
        description="Estado real de cada serviço. Uma variável definida não significa conexão funcionando: use Verificar para testar. Valores de chaves nunca aparecem aqui."
        actions={<Btn variant="primary" icon={<RefreshCw className="size-4" />} loading={verifying} onClick={() => load(true)} disabled={!canVerify}>Verificar agora</Btn>}
      />
      {error && <ErrorBox message={error} onRetry={() => load()} />}
      {!items ? (
        <Skeleton rows={6} />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {items.map((it) => {
            const st = STATE[it.state];
            const Icon = st.icon;
            return (
              <Card key={it.id} title={it.name} action={<Badge tone={st.tone}><Icon className="size-3.5" /> {st.label}</Badge>}>
                <p className="text-sm text-[#d6d6da]">{it.summary}</p>
                <dl className="mt-4 space-y-1.5 text-xs">
                  {it.details.map((d) => (
                    <div key={d.label} className="flex justify-between gap-4 border-b border-white/5 pb-1.5">
                      <dt className="shrink-0 text-[#a0a0a0]">{d.label}</dt>
                      <dd className="min-w-0 text-right font-medium [overflow-wrap:anywhere]">{d.value}</dd>
                    </div>
                  ))}
                </dl>
                {it.setup && (
                  <div className="mt-4 rounded-xl border border-[rgb(240_180_80/25%)] bg-[rgb(240_180_80/6%)] p-3">
                    <p className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#f3cf8b]"><AlertTriangle className="size-3.5" /> Para ativar</p>
                    <ol className="list-decimal space-y-1 pl-4 text-xs text-[#e7e7ea]">{it.setup.map((s) => <li key={s}>{s}</li>)}</ol>
                  </div>
                )}
                {it.id === "evolution" && <WhatsAppConnect session={session} />}
              </Card>
            );
          })}
        </div>
      )}
    </Page>
  );
}
