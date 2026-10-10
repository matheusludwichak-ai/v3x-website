import { guard, isResponse } from "@/lib/control/guard";
import { controlMode, evolutionConfig, geminiConfig, maskPresence, supabaseConfig, SITE_URL } from "@/lib/control/env";
import { pingGemini } from "@/lib/control/ai/gemini";
import { connectionState, EvolutionError } from "@/lib/control/evolution";
import { supabasePublic } from "@/lib/control/supabase";
import { checkUrl } from "@/lib/control/monitor";

type State = "ok" | "pending" | "error" | "unknown";
type Integration = { id: string; name: string; state: State; summary: string; details: { label: string; value: string }[]; setup?: string[] };

/** Real, safe checks of each integration. Never returns secret values. */
export async function GET(request: Request) {
  const session = await guard("read");
  if (isResponse(session)) return session;
  const verify = new URL(request.url).searchParams.get("verify") === "1" && session.canWrite;

  const sb = supabaseConfig();
  const gm = geminiConfig();
  const ev = evolutionConfig();
  const list: Integration[] = [];

  // Supabase
  let sbState: State = sb.configured ? "unknown" : "pending";
  let sbSummary = sb.configured ? "Variáveis definidas. Clique em Verificar para testar a conexão." : "Banco de dados não configurado: o Control usa armazenamento local (desenvolvimento) ou modo demonstração (produção).";
  if (sb.configured && verify) {
    const { error } = (await supabasePublic()?.from("articles").select("id", { head: true, count: "exact" }).eq("status", "published")) ?? { error: { message: "sem cliente" } };
    sbState = error ? "error" : "ok";
    sbSummary = error ? "Não foi possível consultar a tabela articles. Verifique se as migrations foram aplicadas." : "Conexão verificada: consulta pública de artigos respondeu.";
  }
  list.push({
    id: "supabase",
    name: "Supabase (banco e autenticação)",
    state: sbState,
    summary: sbSummary,
    details: [
      { label: "Modo atual do Control", value: { supabase: "Supabase", local: "Local (desenvolvimento)", demo: "Demonstração (somente leitura)" }[controlMode()] },
      { label: "NEXT_PUBLIC_SUPABASE_URL", value: maskPresence(sb.url) },
      { label: "NEXT_PUBLIC_SUPABASE_ANON_KEY", value: maskPresence(sb.anonKey) },
      { label: "SUPABASE_SERVICE_ROLE_KEY (só servidor)", value: maskPresence(sb.serviceKey) },
    ],
    setup: sb.configured ? undefined : ["Aplicar supabase/migrations no projeto Supabase da V3X.", "Definir NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY na Vercel (Production).", "Definir SUPABASE_SERVICE_ROLE_KEY na Vercel (apenas para o webhook do WhatsApp).", "Criar os usuários em Authentication e liberar cada um na tabela control_users."],
  });

  // Gemini
  let gmState: State = gm.configured ? "unknown" : "pending";
  let gmSummary = gm.configured ? "Chave definida. Clique em Verificar para testar." : "IA não configurada. As ações de IA aparecem desativadas com essa explicação.";
  if (gm.configured && verify) {
    const ping = await pingGemini();
    gmState = ping.ok ? "ok" : "error";
    gmSummary = ping.message;
  }
  list.push({
    id: "gemini",
    name: "Google Gemini (IA)",
    state: gmState,
    summary: gmSummary,
    details: [
      { label: "GEMINI_API_KEY", value: maskPresence(gm.apiKey) },
      { label: "Modelo para conteúdo longo", value: gm.model },
      { label: "Modelo para ações rápidas", value: gm.fastModel },
      { label: "Limite diário no Control", value: String(gm.dailyLimit) },
    ],
    setup: gm.configured ? undefined : ["Criar uma chave em aistudio.google.com.", "Definir GEMINI_API_KEY na Vercel (Production), nunca com prefixo NEXT_PUBLIC_.", "Opcional: GEMINI_MODEL, GEMINI_MODEL_FAST e CONTROL_AI_DAILY_LIMIT."],
  });

  // Evolution
  let evState: State = ev.configured ? "unknown" : "pending";
  let evSummary = ev.configured ? "Variáveis definidas. Clique em Verificar para consultar a instância." : "Integração não configurada. Aguardando URL da instância, chave e nome da instância.";
  if (ev.configured && verify) {
    try {
      const st = await connectionState();
      evState = st.ok ? "ok" : "error";
      evSummary = st.ok ? "Instância conectada ao WhatsApp." : `Instância respondeu com estado "${st.state}".`;
    } catch (e) {
      evState = "error";
      evSummary = e instanceof EvolutionError ? e.message : "Falha ao consultar a instância.";
    }
  }
  list.push({
    id: "evolution",
    name: "Evolution API (WhatsApp)",
    state: evState,
    summary: evSummary,
    details: [
      { label: "EVOLUTION_API_URL", value: maskPresence(ev.baseUrl) },
      { label: "EVOLUTION_API_KEY", value: maskPresence(ev.apiKey) },
      { label: "EVOLUTION_INSTANCE", value: maskPresence(ev.instance) },
      { label: "EVOLUTION_WEBHOOK_SECRET", value: maskPresence(ev.webhookSecret) },
      { label: "Webhook a cadastrar na Evolution", value: `${SITE_URL}/api/control/whatsapp/webhook` },
    ],
    setup: ev.configured ? undefined : ["Definir EVOLUTION_API_URL, EVOLUTION_API_KEY e EVOLUTION_INSTANCE na Vercel.", "Gerar um segredo longo e definir EVOLUTION_WEBHOOK_SECRET.", "Na Evolution, cadastrar o webhook com os eventos MESSAGES_UPSERT e MESSAGES_UPDATE, enviando o segredo no header x-webhook-secret (ou ?token=).", "Supabase configurado com SUPABASE_SERVICE_ROLE_KEY para gravar mensagens recebidas."],
  });

  // Public site
  let siteState: State = "unknown";
  let siteSummary = "Clique em Verificar para checar o site público.";
  if (verify) {
    const r = await checkUrl(`${SITE_URL}/blog`);
    siteState = r.ok ? "ok" : "error";
    siteSummary = r.ok ? `Blog público respondeu HTTP ${r.httpStatus} em ${r.latencyMs} ms. Publicações do Control aparecem em até 5 minutos.` : `Blog público com problema: ${r.error ?? `HTTP ${r.httpStatus}`}.`;
  }
  list.push({
    id: "site",
    name: "Site público (blog)",
    state: siteState,
    summary: siteSummary,
    details: [
      { label: "Endereço", value: SITE_URL },
      { label: "Integração", value: "Mesmo repositório: o blog lê os artigos publicados no banco (revalidação a cada 5 minutos e imediata ao publicar)." },
    ],
  });

  return Response.json({ data: list, mode: session.mode, canVerify: session.canWrite });
}
