"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Bot, BookOpen, Plus, ShieldCheck, Sparkles } from "lucide-react";
import type { KnowledgeItem } from "@/lib/control/schema";
import { AIBtn, Badge, Btn, Card, Empty, ErrorBox, Field, ModeBanner, Page, PageHeader, Skeleton, TextArea, TextInput } from "./ui";
import { RecordForm, type FieldDef } from "./RecordForm";
import { api, useCollection, useSession } from "./lib/client";

type Settings = { enabled: boolean; max_replies_per_hour: number; quiet_minutes: number; debounce_seconds: number };
type SettingsResponse = { settings: Settings; ready: { whatsapp: boolean; ai: boolean }; canEdit: boolean };
type Draft = { reply: string; handoff: boolean; handoff_reason: string; lead: { is_opportunity: boolean; name: string; company: string; need: string; service: string } };

const CATEGORY_LABEL: Record<string, string> = { servicos: "Serviços", processo: "Processo", prazos: "Prazos", precos: "Preços", horarios: "Horários", politicas: "Políticas", outros: "Outros" };

const FIELDS: FieldDef[] = [
  { name: "title", label: "Título", required: true, placeholder: "Ex.: Horário de atendimento" },
  { name: "category", label: "Categoria", type: "select", options: Object.entries(CATEGORY_LABEL).map(([value, label]) => ({ value, label })), half: true },
  { name: "active", label: "Usar nas respostas", type: "checkbox", half: true },
  { name: "content", label: "Conteúdo", type: "textarea", required: true, hint: "Escreva como você explicaria ao cliente. Tudo aqui pode ser dito no WhatsApp: não coloque senhas, dados de clientes ou informações internas." },
];

/** WhatsApp assistant: on/off and limits (admins), the team's knowledge base and a reply simulator. */
export function Assistant() {
  const session = useSession();
  const knowledge = useCollection("knowledge_items");
  const [state, setState] = useState<SettingsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<KnowledgeItem | "new" | null>(null);
  const [message, setMessage] = useState("");
  const [testing, setTesting] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);

  useEffect(() => {
    let alive = true;
    api<SettingsResponse>("/api/control/assistant/settings").then(
      (r) => alive && setState(r),
      (e) => alive && setError((e as Error).message),
    );
    return () => {
      alive = false;
    };
  }, []);

  const save = async (patch: Partial<Settings>) => {
    if (!state) return;
    setSaving(true);
    try {
      const r = await api<{ settings: Settings }>("/api/control/assistant/settings", { method: "PUT", body: JSON.stringify({ ...state.settings, ...patch }) });
      setState({ ...state, settings: r.settings });
      toast.success(r.settings.enabled ? "Respostas automáticas ativadas" : "Configuração salva");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const test = async () => {
    setTesting(true);
    setDraft(null);
    try {
      const r = await api<{ draft: Draft }>("/api/control/assistant/test", { method: "POST", body: JSON.stringify({ message }) });
      setDraft(r.draft);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setTesting(false);
    }
  };

  const s = state?.settings;
  const ready = state ? state.ready.whatsapp && state.ready.ai : false;

  return (
    <Page>
      <ModeBanner session={session} />
      <PageHeader eyebrow="Atendimento" title="Assistente do WhatsApp" description="Responde clientes com o conhecimento real da V3X, em tom natural, e passa para uma pessoa quando precisa. Nunca diz que é humano e nunca inventa preço ou prazo." />
      {error && <ErrorBox message={error} />}

      <div className="grid gap-5 xl:grid-cols-[1fr_1.2fr]">
        <div className="space-y-5">
          <Card title="Respostas automáticas" action={s ? <Badge tone={s.enabled ? (ready ? "success" : "warning") : "muted"} dot>{s.enabled ? (ready ? "Ativas" : "Ativas, aguardando integração") : "Desligadas"}</Badge> : null}>
            {!state ? (
              <Skeleton rows={3} />
            ) : (
              <>
                {!ready && (
                  <p className="mb-4 rounded-lg border border-[rgb(240_180_80/25%)] bg-[rgb(240_180_80/6%)] p-3 text-xs text-[#f3cf8b]">
                    {!state.ready.whatsapp && "Evolution API não configurada. "}
                    {!state.ready.ai && "Gemini não configurado. "}
                    Enquanto isso, nada é enviado, mesmo com as respostas ligadas.
                  </p>
                )}
                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="Respostas por hora (por conversa)">
                    <TextInput type="number" min={1} max={30} defaultValue={s!.max_replies_per_hour} disabled={!state.canEdit} onBlur={(e) => Number(e.target.value) !== s!.max_replies_per_hour && save({ max_replies_per_hour: Number(e.target.value) })} />
                  </Field>
                  <Field label="Pausa após resposta humana (min)">
                    <TextInput type="number" min={10} max={1440} defaultValue={s!.quiet_minutes} disabled={!state.canEdit} onBlur={(e) => Number(e.target.value) !== s!.quiet_minutes && save({ quiet_minutes: Number(e.target.value) })} />
                  </Field>
                  <Field label="Espera antes de responder (s)">
                    <TextInput type="number" min={2} max={30} defaultValue={s!.debounce_seconds} disabled={!state.canEdit} onBlur={(e) => Number(e.target.value) !== s!.debounce_seconds && save({ debounce_seconds: Number(e.target.value) })} />
                  </Field>
                </div>
                <ul className="mt-4 space-y-1.5 text-xs text-[#a0a0a0]">
                  <li className="flex gap-2"><ShieldCheck className="size-3.5 shrink-0 text-[#9cc2ff]" /> Para de responder quando alguém do time escreve na conversa (pelo Control ou pelo celular).</li>
                  <li className="flex gap-2"><ShieldCheck className="size-3.5 shrink-0 text-[#9cc2ff]" /> Passa para uma pessoa em pedidos de atendente, reclamações, valores, contratos ou dúvidas fora da base.</li>
                  <li className="flex gap-2"><ShieldCheck className="size-3.5 shrink-0 text-[#9cc2ff]" /> Ignora tentativas de mudar suas regras pela conversa e só envia links do site da V3X.</li>
                </ul>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  {state.canEdit ? (
                    <Btn variant={s!.enabled ? "danger" : "primary"} icon={<Bot className="size-4" />} loading={saving} onClick={() => save({ enabled: !s!.enabled })}>
                      {s!.enabled ? "Desligar respostas automáticas" : "Ligar respostas automáticas"}
                    </Btn>
                  ) : (
                    <p className="text-xs text-[#a0a0a0]">Somente administradores ligam ou desligam.</p>
                  )}
                </div>
              </>
            )}
          </Card>

          <Card title={<span className="inline-flex items-center gap-2"><Sparkles className="size-4 text-[#b89cf0]" /> Testar o assistente</span>}>
            <p className="mb-3 text-xs text-[#a0a0a0]">Escreva como um cliente escreveria. A resposta aparece aqui e não é enviada para ninguém.</p>
            <TextArea rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ex.: Oi! Quanto custa um site institucional?" aria-label="Mensagem de teste" />
            <div className="mt-3 flex justify-end">
              <AIBtn session={session} loading={testing} disabled={!message.trim()} onClick={test}>Simular resposta</AIBtn>
            </div>
            {draft && (
              <div className="mt-4 space-y-2">
                <div className="rounded-2xl rounded-tl-sm bg-[rgb(56_130_246/14%)] p-3 text-sm whitespace-pre-wrap">{draft.reply || "(sem resposta)"}</div>
                <div className="flex flex-wrap gap-2 text-xs">
                  {draft.handoff ? <Badge tone="warning">Passaria para a equipe: {draft.handoff_reason || "atendimento humano"}</Badge> : <Badge tone="success">Continuaria respondendo</Badge>}
                  {draft.lead.is_opportunity && <Badge tone="blue">Oportunidade: {draft.lead.need || draft.lead.service || "interesse identificado"}</Badge>}
                </div>
              </div>
            )}
          </Card>
        </div>

        <Card
          title={<span className="inline-flex items-center gap-2"><BookOpen className="size-4" /> Base de conhecimento</span>}
          action={<Btn size="sm" icon={<Plus className="size-3.5" />} onClick={() => setEditing("new")} disabled={knowledge.readonly}>Adicionar</Btn>}
        >
          <p className="mb-4 text-xs text-[#a0a0a0]">
            O assistente já conhece os serviços, o processo, as perguntas frequentes e os projetos publicados no site. Use esta base para o que só a equipe sabe: horário de atendimento, prazos médios, como funciona o orçamento, formas de pagamento, políticas. Sem isso, ele não informa esses pontos e chama alguém do time.
          </p>
          {knowledge.loading ? (
            <Skeleton rows={4} />
          ) : knowledge.rows.length === 0 ? (
            <Empty icon={<BookOpen className="size-5" />} title="Base vazia" text="Comece pelo horário de atendimento e por como funciona o orçamento." action={!knowledge.readonly && <Btn onClick={() => setEditing("new")}>Adicionar informação</Btn>} />
          ) : (
            <ul className="divide-y divide-white/5">
              {knowledge.rows.map((k) => (
                <li key={k.id}>
                  <button type="button" className="w-full py-3 text-left" onClick={() => setEditing(k)}>
                    <div className="flex items-center gap-2">
                      <span className="min-w-0 flex-1 truncate text-sm font-medium">{k.title}</span>
                      <Badge tone="neutral">{CATEGORY_LABEL[k.category] ?? k.category}</Badge>
                      {!k.active && <Badge tone="muted">Desativado</Badge>}
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-[#a0a0a0]">{k.content}</p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <RecordForm
        open={editing !== null}
        title={editing === "new" ? "Nova informação" : "Informação"}
        subtitle="Revisada pela equipe. O assistente usa somente o que estiver ativo."
        fields={FIELDS}
        initial={editing === "new" ? { category: "outros", active: true } : (editing as unknown as Record<string, unknown>)}
        readonly={knowledge.readonly}
        onClose={() => setEditing(null)}
        onSubmit={(v) => (editing === "new" ? knowledge.create(v) : knowledge.update((editing as KnowledgeItem).id, v))}
        onDelete={editing && editing !== "new" ? () => knowledge.remove(editing.id) : undefined}
      />
    </Page>
  );
}
