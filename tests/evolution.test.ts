import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { connectInstance, connectionState, logoutInstance, sendText, setWebhook } from "@/lib/control/evolution";

type Call = { url: string; method: string; headers: Record<string, string>; body: unknown };
let calls: Call[] = [];

function mockFetch(responses: Record<string, { status?: number; json: unknown }>) {
  vi.stubGlobal("fetch", async (url: string, init: RequestInit = {}) => {
    calls.push({ url, method: init.method ?? "GET", headers: init.headers as Record<string, string>, body: init.body ? JSON.parse(String(init.body)) : undefined });
    const key = Object.keys(responses).find((k) => url.includes(k));
    const r = key ? responses[key]! : { status: 404, json: { success: false } };
    return new Response(JSON.stringify(r.json), { status: r.status ?? 200, headers: { "Content-Type": "application/json" } });
  });
}

describe("Evolution API (docs 2.3.x)", () => {
  beforeEach(() => {
    calls = [];
    vi.stubEnv("EVOLUTION_API_URL", "https://evo.exemplo.com/");
    vi.stubEnv("EVOLUTION_API_KEY", "chave-teste");
    vi.stubEnv("EVOLUTION_INSTANCE", "v3x principal");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("connect: GET /instance/connect/{instance} with apikey, returns QR and pairing code", async () => {
    mockFetch({ "/instance/connect/": { json: { pairingCode: "ABCD1234", code: "2@x", base64: "data:image/png;base64,AAAA", count: 1 } } });
    const r = await connectInstance();
    expect(calls[0]!.url).toBe("https://evo.exemplo.com/instance/connect/v3x%20principal");
    expect(calls[0]!.method).toBe("GET");
    expect(calls[0]!.headers.apikey).toBe("chave-teste");
    expect(r).toEqual({ qr: "data:image/png;base64,AAAA", pairingCode: "ABCD1234", state: null });
  });

  it("connect: ignores anything that is not an image data URL", async () => {
    mockFetch({ "/instance/connect/": { json: { pairingCode: null, base64: "javascript:alert(1)" } } });
    expect((await connectInstance()).qr).toBeNull();
  });

  it("connection state: reads instance.state", async () => {
    mockFetch({ "/instance/connectionState/": { json: { instance: { instanceName: "v3x", state: "open" } } } });
    expect(await connectionState()).toEqual({ state: "open", ok: true });
  });

  it("logout: DELETE /instance/logout/{instance}", async () => {
    mockFetch({ "/instance/logout/": { json: { success: true, message: "Instance logged out successfully" } } });
    await logoutInstance();
    expect(calls[0]!.method).toBe("DELETE");
    expect(calls[0]!.url).toContain("/instance/logout/v3x%20principal");
  });

  it("send text: number digits + text (and textMessage.text)", async () => {
    mockFetch({ "/message/sendText/": { json: { key: { id: "MSG1" }, status: "PENDING" } } });
    const r = await sendText("+55 (47) 98812-8598", "Olá");
    expect(calls[0]!.body).toEqual({ number: "5547988128598", text: "Olá", textMessage: { text: "Olá" } });
    expect(r.externalId).toBe("MSG1");
  });

  it("webhook: secret goes in a header, events are message upsert/update", async () => {
    mockFetch({ "/webhook/set/": { json: { success: true } } });
    await setWebhook("https://grupov3x.com.br/api/control/whatsapp/webhook", "segredo");
    const b = calls[0]!.body as Record<string, unknown>;
    expect(calls[0]!.method).toBe("POST");
    expect(b.url).toBe("https://grupov3x.com.br/api/control/whatsapp/webhook");
    expect(b.headers).toEqual({ "x-webhook-secret": "segredo" });
    expect(b.events).toEqual(["MESSAGES_UPSERT", "MESSAGES_UPDATE"]);
    expect(String(b.url)).not.toContain("segredo");
  });

  it("maps documented errors", async () => {
    mockFetch({ "/instance/connect/": { status: 401, json: { success: false, error: { code: "UNAUTHORIZED", message: "x" } } } });
    await expect(connectInstance()).rejects.toThrow("recusou a chave");
    mockFetch({});
    await expect(logoutInstance()).rejects.toThrow("não encontrada");
  });
});
