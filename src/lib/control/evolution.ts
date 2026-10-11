import "server-only";
import { timingSafeEqual } from "node:crypto";
import { evolutionConfig } from "./env";

/**
 * Evolution API (WhatsApp) service, following docs.evolutionfoundation.com.br (API 2.3.x):
 *   GET    /instance/connectionState/{instance}   -> { instance: { instanceName, state: open|close|connecting } }
 *   GET    /instance/connect/{instance}           -> { pairingCode, code, base64 (QR image), count }
 *   DELETE /instance/logout/{instance}
 *   POST   /message/sendText/{instance}           body { number, text } (+ textMessage.text, older format)
 *   POST   /webhook/set/{instance}                body { enabled, url, events, headers, base64 }
 * Header "apikey" on every call. Paths can be overridden with EVOLUTION_PATH_* if the installed
 * version differs. All calls run on the server; the key never reaches the browser.
 */

export class EvolutionError extends Error {
  constructor(
    message: string,
    public status = 502,
    public code = "evolution_error",
  ) {
    super(message);
  }
}

function cfg() {
  const { baseUrl, apiKey, instance } = evolutionConfig();
  if (!baseUrl || !apiKey || !instance) throw new EvolutionError("Integração não configurada: defina EVOLUTION_API_URL, EVOLUTION_API_KEY e EVOLUTION_INSTANCE.", 503, "not_configured");
  return { baseUrl, apiKey, instance };
}

const path = (envName: string, fallback: string, instance: string) => (process.env[envName] ?? fallback).replace("{instance}", encodeURIComponent(instance));

/** Accepts Brazilian numbers or full JIDs and returns only digits for the API. */
export function normalizeNumber(input: string) {
  const digits = input.replace(/@.*/, "").replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) throw new EvolutionError("Número de WhatsApp inválido.", 400, "invalid_number");
  return digits;
}

export async function connectionState(): Promise<{ state: string; ok: boolean }> {
  const c = cfg();
  try {
    const res = await fetch(`${c.baseUrl}${path("EVOLUTION_PATH_STATE", "/instance/connectionState/{instance}", c.instance)}`, { headers: { apikey: c.apiKey }, signal: AbortSignal.timeout(10000), cache: "no-store" });
    if (res.status === 401 || res.status === 403) throw new EvolutionError("A Evolution recusou a chave configurada.", 503, "unauthorized");
    if (!res.ok) throw new EvolutionError(`A Evolution respondeu ${res.status}.`, 502);
    const json = (await res.json()) as { instance?: { state?: string }; state?: string };
    const state = json.instance?.state ?? json.state ?? "unknown";
    return { state, ok: state === "open" };
  } catch (e) {
    if (e instanceof EvolutionError) throw e;
    throw new EvolutionError("Sem resposta da instância da Evolution.", 502, "unreachable");
  }
}

export async function sendText(number: string, text: string, opts: { delay?: number } = {}): Promise<{ externalId: string | null }> {
  const c = cfg();
  const res = await fetch(`${c.baseUrl}${path("EVOLUTION_PATH_SEND", "/message/sendText/{instance}", c.instance)}`, {
    method: "POST",
    headers: { apikey: c.apiKey, "Content-Type": "application/json" },
    // v2 reads "text"; the published spec also lists "textMessage.text". Both are sent.
    body: JSON.stringify({ number: normalizeNumber(number), text, textMessage: { text }, ...(opts.delay ? { delay: Math.round(opts.delay) } : {}) }),
    signal: AbortSignal.timeout(20000),
  }).catch(() => {
    throw new EvolutionError("Não foi possível falar com a Evolution.", 502, "unreachable");
  });
  if (res.status === 401 || res.status === 403) throw new EvolutionError("A Evolution recusou a chave configurada.", 503, "unauthorized");
  if (!res.ok) throw new EvolutionError(`Envio recusado pela Evolution (${res.status}).`, 502, "send_failed");
  const json = (await res.json().catch(() => ({}))) as { key?: { id?: string } };
  return { externalId: json.key?.id ?? null };
}

/**
 * Constant-time comparison of the webhook secret, sent ONLY in the x-webhook-secret header
 * (a secret in the URL would end up in access logs). Without a configured secret, every event is refused.
 */
export function verifyWebhook(request: Request) {
  const secret = evolutionConfig().webhookSecret;
  if (!secret) return false;
  const given = request.headers.get("x-webhook-secret") ?? "";
  const a = Buffer.from(given);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

export type InboundEvent =
  | { kind: "message"; externalId: string; remoteJid: string; fromMe: boolean; name: string | null; body: string; at: string }
  | { kind: "status"; externalId: string; status: "sent" | "delivered" | "read" | "failed" }
  | { kind: "ignored"; reason: string };

const STATUS_MAP: Record<string, "sent" | "delivered" | "read" | "failed"> = { SERVER_ACK: "sent", DELIVERY_ACK: "delivered", READ: "read", PLAYED: "read", ERROR: "failed" };

/** Tolerant parser for Evolution v2 webhook payloads (messages.upsert / messages.update). */
export function parseWebhook(payload: unknown): InboundEvent[] {
  const p = (payload ?? {}) as { event?: string; data?: unknown };
  const event = String(p.event ?? "").toLowerCase().replace(/_/g, ".");
  const items = Array.isArray(p.data) ? p.data : [p.data];
  if (event === "messages.upsert") {
    return items.map((raw) => {
      const d = (raw ?? {}) as { key?: { id?: string; remoteJid?: string; fromMe?: boolean }; pushName?: string; message?: Record<string, unknown>; messageTimestamp?: number | string };
      const m = d.message ?? {};
      const body =
        (m.conversation as string | undefined) ??
        ((m.extendedTextMessage as { text?: string } | undefined)?.text) ??
        ((m.imageMessage as { caption?: string } | undefined)?.caption ? `[imagem] ${(m.imageMessage as { caption?: string }).caption}` : undefined) ??
        (Object.keys(m)[0] ? `[${Object.keys(m)[0]}]` : "");
      if (!d.key?.id || !d.key.remoteJid) return { kind: "ignored", reason: "payload sem chave" } as const;
      if (d.key.remoteJid.endsWith("@g.us")) return { kind: "ignored", reason: "grupo" } as const;
      const ts = Number(d.messageTimestamp);
      return { kind: "message", externalId: d.key.id, remoteJid: d.key.remoteJid, fromMe: !!d.key.fromMe, name: d.pushName ?? null, body: String(body).slice(0, 8000), at: Number.isFinite(ts) && ts > 0 ? new Date(ts * 1000).toISOString() : new Date().toISOString() } as const;
    });
  }
  if (event === "messages.update") {
    return items.map((raw) => {
      const d = (raw ?? {}) as { keyId?: string; key?: { id?: string }; status?: string };
      const id = d.keyId ?? d.key?.id;
      const status = STATUS_MAP[String(d.status ?? "").toUpperCase()];
      return id && status ? ({ kind: "status", externalId: id, status } as const) : ({ kind: "ignored", reason: "status desconhecido" } as const);
    });
  }
  return [{ kind: "ignored", reason: `evento ${event || "vazio"}` }];
}

async function call(method: "GET" | "POST" | "DELETE", envName: string, fallback: string, body?: unknown) {
  const c = cfg();
  const res = await fetch(`${c.baseUrl}${path(envName, fallback, c.instance)}`, {
    method,
    headers: { apikey: c.apiKey, ...(body ? { "Content-Type": "application/json" } : {}) },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(20000),
    cache: "no-store",
  }).catch(() => {
    throw new EvolutionError("Sem resposta da instância da Evolution.", 502, "unreachable");
  });
  if (res.status === 401 || res.status === 403) throw new EvolutionError("A Evolution recusou a chave configurada.", 503, "unauthorized");
  if (res.status === 404) throw new EvolutionError(`Instância "${c.instance}" não encontrada na Evolution.`, 404, "instance_not_found");
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    const msg = (json.error as { message?: string } | undefined)?.message ?? (typeof json.message === "string" ? json.message : null);
    throw new EvolutionError(msg ? `Evolution: ${msg}` : `A Evolution respondeu ${res.status}.`, 502);
  }
  return json;
}

/** Starts (or resumes) pairing: returns the QR image and/or pairing code to show to an admin. */
export async function connectInstance(): Promise<{ qr: string | null; pairingCode: string | null; state: string | null }> {
  const json = await call("GET", "EVOLUTION_PATH_CONNECT", "/instance/connect/{instance}");
  const base64 = typeof json.base64 === "string" && json.base64.startsWith("data:image/") ? json.base64 : null;
  const state = (json.instance as { state?: string } | undefined)?.state ?? null;
  return { qr: base64, pairingCode: typeof json.pairingCode === "string" ? json.pairingCode : null, state };
}

/** Disconnects the WhatsApp number from the instance (the instance itself is kept). */
export async function logoutInstance() {
  await call("DELETE", "EVOLUTION_PATH_LOGOUT", "/instance/logout/{instance}");
}

export const WEBHOOK_EVENTS = ["MESSAGES_UPSERT", "MESSAGES_UPDATE"];

/** Points the instance webhook to the Control. The secret travels in a header, never in the URL. */
export async function setWebhook(url: string, secret: string) {
  const config = { enabled: true, url, events: WEBHOOK_EVENTS, headers: { "x-webhook-secret": secret }, base64: false, byEvents: false };
  // Flat body as in the published spec; some v2 releases expect it under "webhook".
  await call("POST", "EVOLUTION_PATH_WEBHOOK", "/webhook/set/{instance}", { ...config, webhook: config });
}
