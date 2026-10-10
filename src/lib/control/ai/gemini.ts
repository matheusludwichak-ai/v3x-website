import "server-only";
import { geminiConfig } from "../env";

/**
 * Central AI service of the V3X Control (Google Gemini, REST generateContent).
 * Every module calls the model through here: model choice, timeouts, quota
 * handling, JSON validation and error messages live in one place.
 * The API key is read on the server and never leaves it.
 */

export type AIErrorCode = "not_configured" | "quota" | "timeout" | "invalid_response" | "blocked" | "upstream" | "daily_limit";

export class AIError extends Error {
  constructor(
    public code: AIErrorCode,
    message: string,
    public status = 502,
  ) {
    super(message);
  }
}

type GenerateOptions = {
  system: string;
  prompt: string;
  /** JSON Schema (OpenAPI subset) for structured output. */
  schema?: Record<string, unknown>;
  speed?: "fast" | "quality";
  temperature?: number;
  maxOutputTokens?: number;
};

const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";

/* Best-effort daily counter per server instance; the provider quota is the real limit. */
const usage = { day: "", count: 0 };
function countUse(limit: number) {
  const today = new Date().toISOString().slice(0, 10);
  if (usage.day !== today) Object.assign(usage, { day: today, count: 0 });
  if (usage.count >= limit) throw new AIError("daily_limit", "Limite diário de uso da IA no Control atingido. Ajuste CONTROL_AI_DAILY_LIMIT se necessário.", 429);
  usage.count += 1;
}

export function aiStatus() {
  const cfg = geminiConfig();
  return { configured: cfg.configured, model: cfg.model, fastModel: cfg.fastModel };
}

async function call(options: GenerateOptions) {
  const cfg = geminiConfig();
  if (!cfg.apiKey) throw new AIError("not_configured", "A IA ainda não foi configurada. Defina GEMINI_API_KEY no ambiente do servidor.", 503);
  countUse(cfg.dailyLimit);
  const model = options.speed === "fast" ? cfg.fastModel : cfg.model;

  const body = {
    systemInstruction: { parts: [{ text: options.system }] },
    contents: [{ role: "user", parts: [{ text: options.prompt }] }],
    generationConfig: {
      temperature: options.temperature ?? 0.7,
      maxOutputTokens: options.maxOutputTokens ?? 8192,
      ...(options.schema ? { responseMimeType: "application/json", responseJsonSchema: options.schema } : {}),
    },
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), cfg.timeoutMs);
  let res: Response;
  try {
    res = await fetch(`${ENDPOINT}/${encodeURIComponent(model)}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": cfg.apiKey },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (error) {
    if ((error as Error).name === "AbortError") throw new AIError("timeout", "A IA demorou demais para responder. Tente novamente.", 504);
    throw new AIError("upstream", "Não foi possível falar com a IA agora.", 502);
  } finally {
    clearTimeout(timer);
  }

  if (res.status === 429) throw new AIError("quota", "Limite de uso da API do Gemini atingido. Aguarde alguns minutos ou revise a cota.", 429);
  if (res.status === 401 || res.status === 403) throw new AIError("not_configured", "A chave do Gemini foi recusada. Verifique GEMINI_API_KEY.", 503);
  if (!res.ok) {
    console.error("[control/ai] gemini http", res.status);
    throw new AIError("upstream", "A IA retornou um erro. Tente novamente em instantes.", 502);
  }

  const json = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] }; finishReason?: string }[];
    promptFeedback?: { blockReason?: string };
  };
  if (json.promptFeedback?.blockReason) throw new AIError("blocked", "O pedido foi bloqueado pelos filtros de segurança da IA.", 422);
  const candidate = json.candidates?.[0];
  const text = candidate?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
  if (!text.trim()) throw new AIError("invalid_response", candidate?.finishReason === "SAFETY" ? "A resposta foi bloqueada pelos filtros de segurança." : "A IA não retornou conteúdo. Tente novamente.", 502);
  return { text, model, truncated: candidate?.finishReason === "MAX_TOKENS" };
}

export async function generateText(options: GenerateOptions) {
  return call(options);
}

/** Structured output: parses and validates JSON; one retry when the model returns malformed JSON. */
export async function generateJSON<T>(options: GenerateOptions & { schema: Record<string, unknown> }, validate: (value: unknown) => T): Promise<{ data: T; model: string }> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const { text, model } = await call(options);
    try {
      const cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/```$/, "");
      return { data: validate(JSON.parse(cleaned)), model };
    } catch {
      if (attempt === 1) throw new AIError("invalid_response", "A IA retornou um formato inesperado. Tente novamente.", 502);
    }
  }
  throw new AIError("invalid_response", "A IA retornou um formato inesperado.", 502);
}

/** Lightweight connectivity check used by the Integrations page (lists models, generates nothing). */
export async function pingGemini(): Promise<{ ok: boolean; message: string }> {
  const cfg = geminiConfig();
  if (!cfg.apiKey) return { ok: false, message: "GEMINI_API_KEY ausente." };
  try {
    const res = await fetch(`${ENDPOINT}/${encodeURIComponent(cfg.model)}`, { headers: { "x-goog-api-key": cfg.apiKey }, signal: AbortSignal.timeout(8000) });
    if (res.ok) return { ok: true, message: `Chave aceita. Modelo ${cfg.model} disponível.` };
    if (res.status === 404) return { ok: false, message: `Chave aceita, mas o modelo ${cfg.model} não foi encontrado. Ajuste GEMINI_MODEL.` };
    if (res.status === 401 || res.status === 403) return { ok: false, message: "Chave recusada pelo Google." };
    if (res.status === 429) return { ok: false, message: "Cota atingida no momento." };
    return { ok: false, message: `Resposta inesperada (${res.status}).` };
  } catch {
    return { ok: false, message: "Sem resposta do serviço do Gemini." };
  }
}

export function aiErrorResponse(error: unknown) {
  if (error instanceof AIError) return Response.json({ error: error.message, code: error.code }, { status: error.status });
  return null;
}
