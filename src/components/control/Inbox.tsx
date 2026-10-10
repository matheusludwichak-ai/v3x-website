"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Check, CheckCheck, Clock, MessageCircle, PlugZap, Search, Send, Sparkles, TriangleAlert } from "lucide-react";
import type { Conversation, Message } from "@/lib/control/schema";
import { AIBtn, Avatar, Badge, Btn, Empty, ModeBanner, Page, PageHeader, Select, Skeleton, Tabs, TextArea, TextInput, useDebounced } from "./ui";
import { ai, api, relative, useCollection, useSession } from "./lib/client";
import { CONVERSATION_STATUS_LABEL, MESSAGE_STATUS_LABEL } from "./lib/labels";
import { useLookups } from "./lib/lookups";
import { cn } from "@/lib/utils";

/* Visual-only examples, shown on request while the integration is not configured. Never stored, never sent. */
const now = Date.now();
const DEMO_CONVERSATIONS: (Conversation & { demo: true })[] = [
  { id: "demo-1", demo: true, remote_jid: "demo", contact_name: "Exemplo: Ana (demonstração)", phone: null, status: "pending", assignee_id: null, last_message_at: new Date(now - 6 * 60000).toISOString(), last_message_preview: "Vocês fazem site com área do cliente?", unread_count: 2, summary: null, created_at: "", updated_at: "" },
  { id: "demo-2", demo: true, remote_jid: "demo", contact_name: "Exemplo: Bruno (demonstração)", phone: null, status: "open", assignee_id: null, last_message_at: new Date(now - 3 * 3600000).toISOString(), last_message_preview: "Perfeito, aguardo a proposta.", unread_count: 0, summary: null, created_at: "", updated_at: "" },
];
const DEMO_MESSAGES: Record<string, Pick<Message, "id" | "direction" | "body" | "status" | "created_at">[]> = {
  "demo-1": [
    { id: "d1", direction: "in", body: "Olá! Conheci a V3X pelo site e gostaria de conversar sobre um projeto digital.", status: "received", created_at: new Date(now - 9 * 60000).toISOString() },
    { id: "d2", direction: "in", body: "Vocês fazem site com área do cliente?", status: "received", created_at: new Date(now - 6 * 60000).toISOString() },
  ],
  "demo-2": [
    { id: "d3", direction: "in", body: "Bom dia! Podemos marcar a conversa de descoberta?", status: "received", created_at: new Date(now - 5 * 3600000).toISOString() },
    { id: "d4", direction: "out", body: "Bom dia, Bruno! Claro, quinta às 10h funciona?", status: "read", created_at: new Date(now - 4 * 3600000).toISOString() },
    { id: "d5", direction: "in", body: "Perfeito, aguardo a proposta.", status: "received", created_at: new Date(now - 3 * 3600000).toISOString() },
  ],
};

function StatusIcon({ status }: { status: Message["status"] }) {
  if (status === "read") return <CheckCheck className="size-3.5 text-[#9cc2ff]" aria-label="Lida" />;
  if (status === "delivered") return <CheckCheck className="size-3.5 text-white/60" aria-label="Entregue" />;
  if (status === "sent") return <Check className="size-3.5 text-white/60" aria-label="Enviada" />;
  if (status === "failed") return <TriangleAlert className="size-3.5 text-[#f6a3af]" aria-label="Falhou" />;
  if (status === "pending") return <Clock className="size-3.5 text-white/50" aria-label="Enviando" />;
  return null;
}

export function Inbox() {
  const session = useSession();
  const configured = !!session?.whatsapp.configured;
  const [demo, setDemo] = useState(false);
  const conversations = useCollection("conversations");
  const look = useLookups();
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | Conversation["status"]>("all");
  const [query, setQuery] = useState("");
  const q = useDebounced(query).trim().toLowerCase();
  const [loaded, setLoaded] = useState<{ id: string; list: Message[] } | null>(null);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [aiBusy, setAiBusy] = useState<string | null>(null);
  const [aiNote, setAiNote] = useState<string | null>(null);
  const bottom = useRef<HTMLDivElement>(null);

  const source: Conversation[] = demo ? DEMO_CONVERSATIONS : conversations.rows;
  const list = useMemo(() => source.filter((c) => (filter === "all" || c.status === filter) && (!q || `${c.contact_name ?? ""} ${c.phone ?? ""} ${c.last_message_preview ?? ""}`.toLowerCase().includes(q))).sort((a, b) => (b.last_message_at ?? "").localeCompare(a.last_message_at ?? "")), [source, filter, q]);
  const current = source.find((c) => c.id === selected) ?? null;

  const messages = useMemo<Message[]>(() => (demo ? (((selected ? DEMO_MESSAGES[selected] : []) ?? []) as Message[]) : loaded && loaded.id === selected ? loaded.list : []), [demo, selected, loaded]);
  const loadingMessages = !demo && !!selected && loaded?.id !== selected;

  useEffect(() => {
    if (!selected || demo) return;
    let alive = true;
    const load = () =>
      api<{ data: Message[] }>(`/api/control/data/messages?where.conversation_id=${selected}`).then(
        (res) => alive && setLoaded({ id: selected, list: res.data.sort((a, b) => a.created_at.localeCompare(b.created_at)) }),
        (e) => alive && toast.error((e as Error).message),
      );
    load();
    const timer = setInterval(() => document.visibilityState === "visible" && load(), 15000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [selected, demo]);

  const choose = (id: string | null) => {
    setSelected(id);
    setAiNote(null);
  };

  useEffect(() => bottom.current?.scrollIntoView({ block: "end" }), [messages]);

  const markRead = conversations.update;
  const currentId = current?.id;
  const unread = current?.unread_count ?? 0;
  useEffect(() => {
    if (!currentId || demo || unread === 0) return;
    markRead(currentId, { unread_count: 0 }).catch(() => undefined);
  }, [currentId, unread, demo, markRead]);

  const send = async () => {
    if (!current || !text.trim()) return;
    setSending(true);
    try {
      const res = await api<{ data: Message }>("/api/control/whatsapp/send", { method: "POST", body: JSON.stringify({ conversation_id: current.id, text }) });
      setLoaded((l) => (l && l.id === current.id ? { ...l, list: [...l.list, res.data] } : l));
      setText("");
    } catch (e) {
      toast.error((e as Error).message, { description: "A mensagem não foi enviada. Nada foi reenviado automaticamente." });
    } finally {
      setSending(false);
    }
  };

  const assist = async (mode: "reply" | "summary" | "classify") => {
    if (!messages.length) return;
    setAiBusy(mode);
    try {
      const res = await ai<{ result: string | { topic: string; category: string; urgency: string; next_step: string } }>({ action: "conversation", mode, transcript: messages.map((m) => ({ direction: m.direction, body: m.body })) });
      if (mode === "reply") setText(String(res.result));
      else if (typeof res.result === "string") setAiNote(res.result);
      else setAiNote(`Assunto: ${res.result.topic}\nCategoria: ${res.result.category}\nUrgência: ${res.result.urgency}\nPróximo passo: ${res.result.next_step}`);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setAiBusy(null);
    }
  };

  const showInterface = configured || demo;

  return (
    <Page>
      <ModeBanner session={session} />
      <PageHeader eyebrow="Dia a dia" title="Atendimento" description="Central de conversas do WhatsApp via Evolution API. A IA só sugere respostas; quem envia é sempre uma pessoa." />

      {!configured && (
        <div className="cx-card mb-6 border-[rgb(240_180_80/30%)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[rgb(240_180_80/12%)] text-[#f3cf8b]"><PlugZap className="size-5" /></span>
              <div>
                <p className="font-semibold">Integração não configurada</p>
                <p className="mt-1 max-w-2xl text-sm text-[#a0a0a0]">Para ativar: defina <code className="text-[#d6d6da]">EVOLUTION_API_URL</code>, <code className="text-[#d6d6da]">EVOLUTION_API_KEY</code>, <code className="text-[#d6d6da]">EVOLUTION_INSTANCE</code> e <code className="text-[#d6d6da]">EVOLUTION_WEBHOOK_SECRET</code> no servidor e cadastre o webhook na Evolution. Passo a passo em <Link href="/control/integracoes" className="text-[#9cc2ff] underline">Integrações</Link>.</p>
              </div>
            </div>
            <Btn variant={demo ? "secondary" : "ghost"} onClick={() => { setDemo((d) => !d); choose(null); }}>{demo ? "Ocultar exemplo" : "Ver a interface com exemplo"}</Btn>
          </div>
        </div>
      )}

      {!showInterface ? null : (
        <div className="grid min-h-[70vh] overflow-hidden rounded-2xl border border-white/8 lg:grid-cols-[340px_minmax(0,1fr)]">
          <aside className={cn("flex flex-col border-white/8 bg-[#0b0c12] lg:border-r", current && "hidden lg:flex")}>
            <div className="space-y-3 border-b border-white/8 p-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#6e6e76]" />
                <TextInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar conversa" className="pl-9" aria-label="Buscar conversas" />
              </div>
              <Tabs value={filter} onChange={setFilter} items={[{ value: "all", label: "Todas" }, { value: "pending", label: "Pendentes", count: source.filter((c) => c.status === "pending").length }, { value: "open", label: "Em atendimento" }, { value: "closed", label: "Encerradas" }]} />
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.loading && !demo ? (
                <div className="p-4"><Skeleton rows={4} /></div>
              ) : list.length === 0 ? (
                <p className="p-6 text-center text-sm text-[#a0a0a0]">Nenhuma conversa{configured ? ". Mensagens recebidas pelo webhook aparecem aqui." : "."}</p>
              ) : (
                list.map((c) => (
                  <button key={c.id} onClick={() => choose(c.id)} className={cn("flex w-full items-start gap-3 border-b border-white/5 px-4 py-3 text-left transition-colors hover:bg-white/[0.03]", selected === c.id && "bg-[rgb(56_130_246/9%)]")}>
                    <Avatar name={c.contact_name ?? c.phone} className="!size-9" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold">{c.contact_name ?? c.phone ?? "Contato"}</p>
                        <span className="shrink-0 text-[11px] text-[#a0a0a0]">{relative(c.last_message_at)}</span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-[#a0a0a0]">{c.last_message_preview ?? ""}</p>
                    </div>
                    {c.unread_count > 0 && <span className="cx-nav-count !ml-0">{c.unread_count}</span>}
                  </button>
                ))
              )}
            </div>
          </aside>

          <section className={cn("flex min-w-0 flex-col bg-[#08090d]", !current && "hidden lg:flex")}>
            {!current ? (
              <div className="grid flex-1 place-items-center p-6">
                <Empty icon={<MessageCircle className="size-5" />} title="Selecione uma conversa" text="O histórico, as sugestões da IA e o campo de resposta aparecem aqui." />
              </div>
            ) : (
              <>
                <header className="flex flex-wrap items-center gap-3 border-b border-white/8 px-4 py-3">
                  <button className="cx-btn cx-btn-ghost cx-btn-sm lg:hidden" onClick={() => choose(null)}>Voltar</button>
                  <Avatar name={current.contact_name ?? current.phone} className="!size-9" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{current.contact_name ?? "Contato"}</p>
                    <p className="text-xs text-[#a0a0a0]">{demo ? "Conversa de demonstração" : current.phone}</p>
                  </div>
                  {demo ? <Badge tone="warning">Demonstração</Badge> : (
                    <>
                      <Select aria-label="Status da conversa" value={current.status} onChange={(e) => conversations.update(current.id, { status: e.target.value }).catch((er) => toast.error(er.message))} options={Object.entries(CONVERSATION_STATUS_LABEL).map(([value, l]) => ({ value, label: l }))} className="!w-auto !py-1.5 text-xs" />
                      <Select aria-label="Responsável" value={current.assignee_id ?? ""} onChange={(e) => conversations.update(current.id, { assignee_id: e.target.value || null }).catch((er) => toast.error(er.message))} options={look.peopleOptions} placeholder="Sem responsável" className="!w-auto !py-1.5 text-xs" />
                    </>
                  )}
                </header>
                <div className="flex-1 space-y-2 overflow-y-auto p-4" data-lenis-prevent>
                  {loadingMessages ? <Skeleton rows={4} /> : messages.map((m) => (
                    <div key={m.id} className={cn("flex", m.direction === "out" ? "justify-end" : "justify-start")}>
                      <div className={cn("max-w-[78%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed", m.direction === "out" ? "rounded-br-md bg-[linear-gradient(135deg,#2f6fd6,#7449b8)] text-white" : "rounded-bl-md bg-white/[0.06]")}>
                        <p className="whitespace-pre-wrap">{m.body}</p>
                        <p className="mt-1 flex items-center justify-end gap-1 text-[10px] opacity-70">
                          {new Date(m.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                          {m.direction === "out" && <StatusIcon status={m.status} />}
                          {m.status === "failed" && <span>{MESSAGE_STATUS_LABEL.failed}</span>}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={bottom} />
                </div>
                {aiNote && (
                  <div className="mx-4 mb-2 rounded-xl border border-[rgb(136_86_207/35%)] bg-[rgb(136_86_207/7%)] p-3 text-sm">
                    <p className="mb-1 flex items-center gap-2 text-xs font-semibold text-[#dccbfa]"><Sparkles className="size-3.5" /> Análise da IA</p>
                    <p className="whitespace-pre-wrap text-[#e7e7ea]">{aiNote}</p>
                    <button className="mt-1 text-xs text-[#a0a0a0] hover:text-white" onClick={() => setAiNote(null)}>Fechar</button>
                  </div>
                )}
                <footer className="border-t border-white/8 p-3">
                  <div className="mb-2 flex flex-wrap gap-2">
                    <AIBtn session={session} size="sm" loading={aiBusy === "reply"} onClick={() => assist("reply")} disabled={demo || !messages.length}>Sugerir resposta</AIBtn>
                    <AIBtn session={session} size="sm" loading={aiBusy === "summary"} onClick={() => assist("summary")} disabled={demo || !messages.length}>Resumir</AIBtn>
                    <AIBtn session={session} size="sm" loading={aiBusy === "classify"} onClick={() => assist("classify")} disabled={demo || !messages.length}>Classificar</AIBtn>
                  </div>
                  <div className="flex items-end gap-2">
                    <TextArea value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if (!demo) send(); } }} placeholder={demo ? "Envio desativado na demonstração" : "Escreva a resposta (Enter envia, Shift+Enter quebra linha)"} disabled={demo} className="!min-h-[2.75rem] max-h-40" aria-label="Mensagem" />
                    <Btn variant="primary" icon={<Send className="size-4" />} loading={sending} onClick={send} disabled={demo || !text.trim() || !session?.canWrite}>Enviar</Btn>
                  </div>
                  <p className="mt-1.5 text-[11px] text-[#6e6e76]">Sugestões da IA preenchem o campo para você revisar. Nada é enviado automaticamente.</p>
                </footer>
              </>
            )}
          </section>
        </div>
      )}
    </Page>
  );
}
