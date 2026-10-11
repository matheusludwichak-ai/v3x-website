import "server-only";
import tls from "node:tls";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

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

/** True for loopback, private, link-local, CGNAT, multicast and reserved IPv4/IPv6 addresses. */
export function isPrivateIp(ip: string) {
  if (isIP(ip) === 4) {
    const [a, b] = ip.split(".").map(Number) as [number, number];
    return a === 0 || a === 10 || a === 127 || (a === 100 && b >= 64 && b <= 127) || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 198 && (b === 18 || b === 19)) || a >= 224;
  }
  const v6 = ip.toLowerCase();
  if (v6.startsWith("::ffff:")) return isPrivateIp(v6.slice(7));
  return v6 === "::" || v6 === "::1" || v6.startsWith("fc") || v6.startsWith("fd") || v6.startsWith("fe8") || v6.startsWith("fe9") || v6.startsWith("fea") || v6.startsWith("feb") || v6.startsWith("ff");
}

/** Resolves the host and refuses it when any address is internal (protects against DNS pointing inside). */
async function assertPublicHost(url: URL) {
  assertPublicUrl(url.toString());
  const host = url.hostname.replace(/^\[|\]$/g, "");
  const addresses = isIP(host) ? [{ address: host }] : await lookup(host, { all: true });
  if (!addresses.length || addresses.some((a) => isPrivateIp(a.address))) throw new Error("O endereço aponta para uma rede interna e não pode ser monitorado.");
}

/** Follows up to 5 redirects manually, validating every hop. */
async function safeFetch(url: URL) {
  let current = url;
  for (let hop = 0; hop <= 5; hop++) {
    await assertPublicHost(current);
    const res = await fetch(current, { method: "GET", redirect: "manual", signal: AbortSignal.timeout(15000), headers: { "user-agent": "V3X-Control-Monitor/1.0" }, cache: "no-store" });
    const location = res.headers.get("location");
    if (res.status >= 300 && res.status < 400 && location) {
      await res.body?.cancel().catch(() => undefined);
      current = new URL(location, current);
      continue;
    }
    return { res, finalUrl: current };
  }
  throw new Error("Redirecionamentos demais.");
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
  try {
    await assertPublicHost(url);
  } catch (e) {
    return { ok: false, status: "unknown", httpStatus: null, latencyMs: null, tlsExpiresAt: null, error: (e as Error).message, checkedAt };
  }
  const started = performance.now();
  try {
    const { res, finalUrl } = await safeFetch(url);
    const latencyMs = Math.round(performance.now() - started);
    await res.body?.cancel().catch(() => undefined);
    const tlsExpiresAt = finalUrl.protocol === "https:" ? await tlsExpiry(finalUrl.hostname) : null;
    const status = res.status >= 500 ? "down" : res.status >= 400 ? "degraded" : latencyMs > 3000 ? "degraded" : "up";
    return { ok: status === "up", status, httpStatus: res.status, latencyMs, tlsExpiresAt, error: null, checkedAt };
  } catch (e) {
    const latencyMs = Math.round(performance.now() - started);
    const timeout = (e as Error).name === "TimeoutError";
    const blocked = /rede interna|Redirecionamentos/.test((e as Error).message);
    if (blocked) return { ok: false, status: "unknown", httpStatus: null, latencyMs: null, tlsExpiresAt: null, error: (e as Error).message, checkedAt };
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

/** One real check of a monitor: stores the result and opens/resolves its incident. */
export async function runMonitorCheck(
  store: import("./store/types").ControlStore,
  monitor: import("./schema").Monitor,
  onIncident?: (title: string) => Promise<void>,
) {
  const result = await checkUrl(monitor.url);
  const updated = await store.update("monitors", monitor.id, {
    last_status: result.status,
    last_http_status: result.httpStatus,
    last_latency_ms: result.latencyMs,
    tls_expires_at: result.tlsExpiresAt,
    last_checked_at: result.checkedAt,
    last_error: result.error,
  });
  const signal = incidentFrom(result, monitor.last_status);
  const open = (await store.list("incidents", { where: { monitor_id: monitor.id, status: "open" } }))[0];
  if (signal && !open) {
    await store.insert("incidents", { monitor_id: monitor.id, ...signal, status: "open", opened_at: result.checkedAt, resolved_at: null });
    await onIncident?.(signal.title);
  } else if (!signal && open) {
    await store.update("incidents", open.id, { status: "resolved", resolved_at: result.checkedAt });
  }
  return { updated, result, incident: signal?.title ?? null };
}
