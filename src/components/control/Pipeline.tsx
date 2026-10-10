"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Building2, GitBranch, Mail, Phone, Plus, Search } from "lucide-react";
import type { Client, Lead } from "@/lib/control/schema";
import { Avatar, Badge, Btn, Empty, ErrorBox, ModeBanner, Page, PageHeader, Skeleton, Tabs, TextInput, optionsOf, useDebounced } from "./ui";
import { RecordForm, type FieldDef } from "./RecordForm";
import { fmtDate, today, useCollection, useSession } from "./lib/client";
import { useLookups } from "./lib/lookups";
import { LEAD_STAGE_LABEL } from "./lib/labels";

const STAGES = Object.keys(LEAD_STAGE_LABEL) as Lead["stage"][];
const money = (cents?: number | null) => (typeof cents === "number" ? (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }) : null);

export function Pipeline() {
  const session = useSession();
  const leads = useCollection("leads");
  const look = useLookups();
  const [editing, setEditing] = useState<Lead | "new" | null>(null);
  const [over, setOver] = useState<string | null>(null);

  const fields: FieldDef[] = [
    { name: "company", label: "Empresa ou contato", required: true },
    { name: "stage", label: "Etapa", type: "select", options: optionsOf(LEAD_STAGE_LABEL), required: true, half: true },
    { name: "service", label: "Serviço de interesse", half: true, placeholder: "Ex.: site institucional" },
    { name: "contact", label: "Pessoa de contato", half: true, advanced: true },
    { name: "value_cents", label: "Valor estimado (R$)", type: "money", half: true, advanced: true, hint: "Informado por você; não é calculado." },
    { name: "owner_id", label: "Responsável", type: "select", options: look.peopleOptions, half: true, advanced: true },
    { name: "next_action_date", label: "Data da próxima ação", type: "date", half: true, advanced: true },
    { name: "next_action", label: "Próxima ação", advanced: true },
    { name: "notes", label: "Anotações", type: "textarea", advanced: true },
  ];

  const move = async (id: string, stage: Lead["stage"]) => {
    if (leads.rows.find((l) => l.id === id)?.stage === stage) return;
    try {
      await leads.update(id, { stage });
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <Page>
      <ModeBanner session={session} />
      <PageHeader
        eyebrow="Projetos"
        title="Pipeline comercial"
        description={<>Oportunidades de venda, do primeiro contato ao fechamento. Quando fechar, crie o projeto em <Link href="/control/projetos">Projetos</Link> para acompanhar a entrega.</>}
        actions={<Btn variant="primary" icon={<Plus className="size-4" />} onClick={() => setEditing("new")} disabled={leads.readonly}>Nova oportunidade</Btn>}
      />
      {leads.error && <ErrorBox message={leads.error} onRetry={leads.reload} />}
      {leads.loading ? (
        <Skeleton rows={5} />
      ) : leads.rows.length === 0 ? (
        <Empty icon={<GitBranch className="size-5" />} title="Nenhuma oportunidade registrada" text="Registre conversas comerciais reais para acompanhar cada etapa até o fechamento." action={!leads.readonly && <Btn onClick={() => setEditing("new")}>Registrar oportunidade</Btn>} />
      ) : (
        <div className="cx-board" style={{ gridAutoColumns: "minmax(250px, 1fr)" }}>
          {STAGES.map((stage) => {
            const list = leads.rows.filter((l) => l.stage === stage);
            const total = list.reduce((s, l) => s + (l.value_cents ?? 0), 0);
            return (
              <section key={stage} className="cx-col" data-over={over === stage} aria-label={LEAD_STAGE_LABEL[stage]} onDragOver={(e) => { e.preventDefault(); setOver(stage); }} onDragLeave={() => setOver(null)} onDrop={(e) => { e.preventDefault(); setOver(null); move(e.dataTransfer.getData("text/plain"), stage); }}>
                <div className="cx-col-head">
                  <span>{LEAD_STAGE_LABEL[stage]}</span>
                  <span className="cx-tab-count">{list.length}</span>
                </div>
                {total > 0 && <p className="-mt-1 px-1.5 text-[11px] text-[#a0a0a0]">{money(total)} informados</p>}
                {list.map((l) => {
                  const late = l.next_action_date && l.next_action_date < today() && !["won", "lost"].includes(l.stage);
                  return (
                    <button key={l.id} className="cx-tile w-full" draggable={!leads.readonly} onDragStart={(e) => e.dataTransfer.setData("text/plain", l.id)} onClick={() => setEditing(l)}>
                      <p className="text-sm font-semibold">{l.company}</p>
                      {l.service && <p className="mt-0.5 text-xs text-[#a0a0a0]">{l.service}</p>}
                      {l.next_action && <p className={late ? "mt-2 text-xs font-medium text-[#f6a3af]" : "mt-2 text-xs text-[#d6d6da]"}>→ {l.next_action} · {fmtDate(l.next_action_date)}</p>}
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs font-semibold">{money(l.value_cents) ?? ""}</span>
                        {l.owner_id && <Avatar name={look.personName(l.owner_id)} className="!size-6" />}
                      </div>
                    </button>
                  );
                })}
              </section>
            );
          })}
        </div>
      )}
      <RecordForm
        open={editing !== null}
        title={editing === "new" ? "Nova oportunidade" : "Oportunidade"}
        fields={fields}
        initial={editing === "new" ? { stage: "new" } : (editing as unknown as Record<string, unknown>)}
        readonly={leads.readonly}
        onClose={() => setEditing(null)}
        onSubmit={(v) => (editing === "new" ? leads.create(v) : leads.update((editing as Lead).id, v))}
        onDelete={editing && editing !== "new" ? () => leads.remove(editing.id) : undefined}
      />
    </Page>
  );
}

export function Clients() {
  const session = useSession();
  const clients = useCollection("clients");
  const projects = useCollection("projects");
  const [editing, setEditing] = useState<Client | "new" | null>(null);
  const [status, setStatus] = useState<"all" | Client["status"]>("all");
  const [query, setQuery] = useState("");
  const q = useDebounced(query).trim().toLowerCase();
  const list = useMemo(() => clients.rows.filter((c) => (status === "all" || c.status === status) && (!q || `${c.name} ${c.company ?? ""} ${c.email ?? ""}`.toLowerCase().includes(q))), [clients.rows, status, q]);

  const fields: FieldDef[] = [
    { name: "name", label: "Nome", required: true },
    { name: "company", label: "Empresa", half: true },
    { name: "status", label: "Situação", type: "select", required: true, half: true, options: [{ value: "prospect", label: "Prospecto" }, { value: "active", label: "Ativo" }, { value: "inactive", label: "Inativo" }] },
    { name: "email", label: "E-mail", type: "email", half: true, advanced: true },
    { name: "phone", label: "Telefone", half: true, advanced: true },
    { name: "notes", label: "Anotações internas", type: "textarea", advanced: true },
  ];

  return (
    <Page>
      <ModeBanner session={session} />
      <PageHeader eyebrow="Projetos" title="Clientes" description="Cadastro das empresas atendidas. Cada cliente separa seus projetos, monitores e relatórios dos demais." actions={<Btn variant="primary" icon={<Plus className="size-4" />} onClick={() => setEditing("new")} disabled={clients.readonly}>Novo cliente</Btn>} />
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Tabs value={status} onChange={setStatus} items={[{ value: "all", label: "Todos", count: clients.rows.length }, { value: "active", label: "Ativos" }, { value: "prospect", label: "Prospectos" }, { value: "inactive", label: "Inativos" }]} />
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#6e6e76]" />
          <TextInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar cliente" className="pl-9" aria-label="Buscar clientes" />
        </div>
      </div>
      {clients.error && <ErrorBox message={clients.error} onRetry={clients.reload} />}
      {clients.loading ? (
        <Skeleton rows={4} />
      ) : list.length === 0 ? (
        <Empty icon={<Building2 className="size-5" />} title={clients.rows.length ? "Nada neste filtro" : "Nenhum cliente cadastrado"} text="Clientes reais entram aqui. Nenhum cliente é criado automaticamente." action={!clients.readonly && <Btn onClick={() => setEditing("new")}>Cadastrar cliente</Btn>} />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {list.map((c) => {
            const count = projects.rows.filter((p) => p.client_id === c.id).length;
            return (
              <button key={c.id} className="cx-card text-left" onClick={() => setEditing(c)}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <Avatar name={c.name} className="!size-9" />
                    <div>
                      <p className="font-semibold">{c.name}</p>
                      <p className="text-xs text-[#a0a0a0]">{c.company ?? "Sem empresa"}</p>
                    </div>
                  </div>
                  <Badge tone={c.status === "active" ? "blue" : c.status === "prospect" ? "violet" : "muted"}>{c.status === "active" ? "Ativo" : c.status === "prospect" ? "Prospecto" : "Inativo"}</Badge>
                </div>
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#a0a0a0]">
                  {c.email && <span className="inline-flex items-center gap-1"><Mail className="size-3.5" />{c.email}</span>}
                  {c.phone && <span className="inline-flex items-center gap-1"><Phone className="size-3.5" />{c.phone}</span>}
                  <span>{count} projeto{count === 1 ? "" : "s"}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
      <RecordForm open={editing !== null} title={editing === "new" ? "Novo cliente" : "Cliente"} fields={fields} initial={editing === "new" ? { status: "active" } : (editing as unknown as Record<string, unknown>)} readonly={clients.readonly} onClose={() => setEditing(null)} onSubmit={(v) => (editing === "new" ? clients.create(v) : clients.update((editing as Client).id, v))} onDelete={editing && editing !== "new" ? () => clients.remove(editing.id) : undefined} deleteText="O cliente será removido. Projetos vinculados ficam sem cliente." />
    </Page>
  );
}
