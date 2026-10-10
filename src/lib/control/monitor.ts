import "server-only";
import tls from "node:tls";

export type CheckResult = {
  ok: boolean;
  status: "up" | "degraded" | "down" | "unknown";
  httpStatus: number | null;
  latencyMs: number | null;
  tlsExpiresAt: string | null;
  error: string | null;
  checkedAt: string;
};

const PRIVATE_HOST = /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|0\.|\[?::1\]?|.*\.local$|.*\.internal$)/i;

/** Only public http(s) URLs: the checker must not be usable to probe internal networks (SSRF). */
export function assertPublicUrl(raw: string) {
  const url = new URL(raw);
  if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("Use uma URL http(s).");
  if (PRIVATE_HOST.test(url.hostname)) throw new Error("Endereços internos não podem ser monitorados.");
  return url;
}

function tlsExpiry(host: string, port = 443): Promise<string | null> {
  return new Promise((resolve) => {
    const socket = tls.connect({ host, port, servername: host, timeout: 8000 }, () => {
      const cert = socket.getPeerCertificate();
      socket.end();
      resolve(cert?.valid_to ? new Date(cert.valid_to).toISOString() : null);
    });
    socket.on("error", () => resolve(null));
    socket.on("timeout", () => {
      socket.destroy();
      resolve(null);
    });
  });
}

/**
 * External check of a public URL: HTTP status, response time and TLS certificate expiry.
 * This is what can be verified from outside. It says nothing about builds, logs or
 * internal errors, which need an integration with the hosting provider.
 */
export async function checkUrl(raw: string): Promise<CheckResult> {
  const checkedAt = new Date().toISOString();
  let url: URL;
  try {
    url = assertPublicUrl(raw);
  } catch (e) {
    return { ok: false, status: "unknown", httpStatus: null, latencyMs: null, tlsExpiresAt: null, error: (e as Error).message, checkedAt };
  }
  const started = performance.now();
  try {
    const res = await fetch(url, { method: "GET", redirect: "follow", signal: AbortSignal.timeout(15000), headers: { "user-agent": "V3X-Control-Monitor/1.0" }, cache: "no-store" });
    const latencyMs = Math.round(performance.now() - started);
    await res.body?.cancel().catch(() => undefined);
    const tlsExpiresAt = url.protocol === "https:" ? await tlsExpiry(url.hostname) : null;
    const status = res.status >= 500 ? "down" : res.status >= 400 ? "degraded" : latencyMs > 3000 ? "degraded" : "up";
    return { ok: status === "up", status, httpStatus: res.status, latencyMs, tlsExpiresAt, error: null, checkedAt };
  } catch (e) {
    const latencyMs = Math.round(performance.now() - started);
    const timeout = (e as Error).name === "TimeoutError";
    return { ok: false, status: "down", httpStatus: null, latencyMs: timeout ? latencyMs : null, tlsExpiresAt: null, error: timeout ? "Sem resposta em 15 segundos." : "Falha de conexão (DNS, rede ou certificado).", checkedAt };
  }
}

/**
 * Turns a check into an incident signal. Never claims an attack or a confirmed
 * outage from a single check: it reports what was observed and a confidence level.
 */
export function incidentFrom(result: CheckResult, previousStatus: string) {
  if (result.status === "down") {
    return { title: "Site sem resposta adequada", signal: result.error ?? `HTTP ${result.httpStatus}`, severity: "high" as const, confidence: previousStatus === "down" ? ("high" as const) : ("medium" as const) };
  }
  if (result.status === "degraded") {
    return { title: result.httpStatus && result.httpStatus >= 400 ? `Resposta HTTP ${result.httpStatus}` : "Lentidão acima de 3 segundos", signal: `HTTP ${result.httpStatus ?? "?"} em ${result.latencyMs ?? "?"} ms`, severity: "medium" as const, confidence: "medium" as const };
  }
  if (result.tlsExpiresAt) {
    const days = (new Date(result.tlsExpiresAt).getTime() - Date.now()) / 86400000;
    if (days < 14) return { title: "Certificado TLS perto de vencer", signal: `Vence em ${Math.max(0, Math.floor(days))} dias`, severity: days < 3 ? ("high" as const) : ("low" as const), confidence: "high" as const };
  }
  return null;
}
