import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { articleSchema, slugify, taskSchema, monitorSchema } from "@/lib/control/schema";
import { seoChecklist, blockingIssues } from "@/lib/control/seo";
import { renderMarkdown } from "@/lib/markdown";
import { normalizeNumber, parseWebhook, verifyWebhook } from "@/lib/control/evolution";
import { assertPublicUrl, incidentFrom, isPrivateIp } from "@/lib/control/monitor";
import { enforceEntityRules } from "@/lib/control/rules";
import { FileStore } from "@/lib/control/store/memory";

describe("schema", () => {
  it("slugify removes accents and symbols", () => {
    expect(slugify("Quanto custa um Site Institucional? (2026)")).toBe("quanto-custa-um-site-institucional-2026");
    expect(slugify("Automação de processos & IA")).toBe("automacao-de-processos-ia");
  });
  it("rejects invalid slugs", () => {
    expect(articleSchema.safeParse({ title: "Título válido", slug: "Slug Com Espaço" }).success).toBe(false);
    expect(articleSchema.safeParse({ title: "Título válido", slug: "slug-valido" }).success).toBe(true);
  });
  it("applies task defaults", () => {
    const t = taskSchema.parse({ title: "Revisar layout" });
    expect(t).toMatchObject({ status: "todo", priority: "medium", checklist: [], source: "manual" });
  });
  it("new monitors start as unknown", () => {
    expect(monitorSchema.parse({ name: "Site", url: "https://exemplo.com" }).last_status).toBe("unknown");
  });
});

describe("SEO checklist", () => {
  const para = "Texto útil para o leitor sobre o tema, com contexto e exemplos práticos. ".repeat(20);
  const good = {
    title: "Como escolher a stack de um site institucional",
    seo_title: "Stack de site institucional: como escolher",
    slug: "stack-site-institucional",
    meta_description: "Entenda como escolher a stack de um site institucional: critérios práticos de desempenho, manutenção, SEO e custo para decidir com segurança.",
    primary_keyword: "stack de site institucional",
    content_md: `A escolha da stack de site institucional define custo e manutenção. ${para}\n\n## Critérios\n\n${para}\n\n## Custos\n\n${para}\n\n## Decisão\n\n${para} [Serviços](/servicos) e [contato](/contato).`,
  };
  it("passes a complete article", () => {
    expect(blockingIssues(seoChecklist(good))).toEqual([]);
  });
  it("blocks [VERIFICAR] markers, H1 in body and taken slugs", () => {
    const issues = blockingIssues(seoChecklist({ ...good, content_md: `# H1 duplicado\n${good.content_md} [VERIFICAR]` }, ["stack-site-institucional"])).map((i) => i.id);
    expect(issues).toEqual(expect.arrayContaining(["slug", "structure", "verify"]));
  });
});

describe("markdown renderer", () => {
  it("escapes raw HTML and scripts", () => {
    const html = renderMarkdown('Olá <script>alert(1)</script> <img src=x onerror="alert(2)">');
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<img src=x");
    expect(html).toContain("&lt;script&gt;");
  });
  it("drops javascript: links and marks external links", () => {
    expect(renderMarkdown("[x](javascript:alert(1))")).not.toContain("javascript:");
    expect(renderMarkdown("[x](https://example.com)")).toContain('rel="noopener nofollow"');
    expect(renderMarkdown("[x](/servicos)")).toContain('href="/servicos"');
  });
  it("never outputs H1 (the title is the H1)", () => {
    expect(renderMarkdown("# Título")).toMatch(/^<h2/);
  });
});

describe("Evolution webhook", () => {
  const OLD = { ...process.env };
  afterEach(() => {
    process.env = { ...OLD };
  });
  it("refuses everything without a configured secret", () => {
    delete process.env.EVOLUTION_WEBHOOK_SECRET;
    expect(verifyWebhook(new Request("https://x/api", { method: "POST", headers: { "x-webhook-secret": "abc" } }))).toBe(false);
  });
  it("accepts the right secret only via header and rejects others", () => {
    process.env.EVOLUTION_WEBHOOK_SECRET = "s3cr3t-value";
    expect(verifyWebhook(new Request("https://x/api", { headers: { "x-webhook-secret": "s3cr3t-value" } }))).toBe(true);
    expect(verifyWebhook(new Request("https://x/api?token=s3cr3t-value"))).toBe(false);
    expect(verifyWebhook(new Request("https://x/api", { headers: { "x-webhook-secret": "s3cr3t-valuf" } }))).toBe(false);
  });
  it("parses inbound messages, ignores groups and maps delivery status", () => {
    const events = parseWebhook({
      event: "messages.upsert",
      data: [
        { key: { id: "M1", remoteJid: "5547999999999@s.whatsapp.net", fromMe: false }, pushName: "Ana", message: { conversation: "Olá" }, messageTimestamp: 1760000000 },
        { key: { id: "G1", remoteJid: "123@g.us", fromMe: false }, message: { conversation: "grupo" } },
      ],
    });
    expect(events[0]).toMatchObject({ kind: "message", externalId: "M1", body: "Olá", fromMe: false, name: "Ana" });
    expect(events[1]).toMatchObject({ kind: "ignored" });
    expect(parseWebhook({ event: "MESSAGES_UPDATE", data: { keyId: "M1", status: "READ" } })[0]).toMatchObject({ kind: "status", status: "read" });
  });
  it("normalizes phone numbers", () => {
    expect(normalizeNumber("+55 (47) 98812-8598")).toBe("5547988128598");
    expect(() => normalizeNumber("123")).toThrow();
  });
});

describe("monitoring", () => {
  it("blocks internal addresses (SSRF)", () => {
    for (const url of ["http://localhost:3000", "http://127.0.0.1", "http://10.0.0.5", "http://192.168.1.1", "http://169.254.169.254/latest", "file:///etc/passwd"]) {
      expect(() => assertPublicUrl(url)).toThrow();
    }
    expect(assertPublicUrl("https://grupov3x.com.br").hostname).toBe("grupov3x.com.br");
  });
  it("classifies resolved IPs (DNS pointing inside is refused)", () => {
    for (const ip of ["127.0.0.1", "10.1.2.3", "172.20.0.1", "192.168.0.10", "169.254.169.254", "100.64.0.1", "0.0.0.0", "::1", "fd00::1", "fe80::1", "::ffff:10.0.0.1"]) expect(isPrivateIp(ip), ip).toBe(true);
    for (const ip of ["76.76.21.21", "8.8.8.8", "2606:4700::1111"]) expect(isPrivateIp(ip), ip).toBe(false);
  });
  it("reports signals with confidence, never certainty from one failure", () => {
    const down = incidentFrom({ ok: false, status: "down", httpStatus: null, latencyMs: null, tlsExpiresAt: null, error: "Falha", checkedAt: "" }, "up");
    expect(down).toMatchObject({ severity: "high", confidence: "medium" });
    expect(incidentFrom({ ok: true, status: "up", httpStatus: 200, latencyMs: 100, tlsExpiresAt: new Date(Date.now() + 90 * 86400000).toISOString(), error: null, checkedAt: "" }, "up")).toBeNull();
  });
});

describe("business rules", () => {
  it("refuses publishing and public approval through the generic API", () => {
    expect(enforceEntityRules("articles", { status: "published" }, "update")?.status).toBe(400);
    expect(enforceEntityRules("portfolio_items", { public_approved: true }, "update")?.status).toBe(400);
    expect(enforceEntityRules("monitors", { last_status: "up" }, "update")?.status).toBe(400);
    expect(enforceEntityRules("tasks", { status: "done" }, "update")).toBeNull();
  });
});

describe("FileStore (local development store)", () => {
  let dir: string;
  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "v3x-control-"));
  });
  afterEach(() => fs.rmSync(dir, { recursive: true, force: true }));

  it("seeds the real founders and the site monitor", async () => {
    const store = new FileStore(path.join(dir, "c.json"));
    const people = await store.list("org_members");
    expect(people.map((p) => p.name).sort()).toEqual(["Emmanuelle Assanté", "Isabella Christina", "Matheus Ludwichak"]);
    const monitors = await store.list("monitors");
    expect(monitors.map((m) => m.url).sort()).toEqual(["https://control.grupov3x.com.br/login", "https://grupov3x.com.br"]);
    expect(monitors.every((m) => m.last_status === "unknown")).toBe(true);
  });
  it("supports CRUD and enforces unique slugs", async () => {
    const store = new FileStore(path.join(dir, "c.json"));
    const a = await store.insert("articles", { title: "A", slug: "mesmo-slug", status: "draft" });
    await expect(store.insert("articles", { title: "B", slug: "mesmo-slug" })).rejects.toMatchObject({ status: 409 });
    const updated = await store.update("articles", a.id, { title: "A2" });
    expect(updated.title).toBe("A2");
    expect(await store.list("articles", { where: { status: "draft" } })).toHaveLength(1);
    await store.remove("articles", a.id);
    expect(await store.get("articles", a.id)).toBeNull();
  });
});

describe("Gemini service", () => {
  const OLD = { ...process.env };
  afterEach(() => {
    process.env = { ...OLD };
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it("explains when the key is missing", async () => {
    delete process.env.GEMINI_API_KEY;
    const { generateText, AIError } = await import("@/lib/control/ai/gemini");
    await expect(generateText({ system: "s", prompt: "p" })).rejects.toBeInstanceOf(AIError);
    await expect(generateText({ system: "s", prompt: "p" })).rejects.toMatchObject({ code: "not_configured" });
  });

  it("sends the key only in the header and parses JSON output (mocked HTTP)", async () => {
    process.env.GEMINI_API_KEY = "test-key";
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: '{"items":["a","b"]}' }] }, finishReason: "STOP" }] }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const { generateJSON } = await import("@/lib/control/ai/gemini");
    const res = await generateJSON({ system: "s", prompt: "p", schema: { type: "object" } }, (v) => v as { items: string[] });
    expect(res.data.items).toEqual(["a", "b"]);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).not.toContain("test-key");
    expect((init.headers as Record<string, string>)["x-goog-api-key"]).toBe("test-key");
  });

  it("maps quota errors (mocked HTTP 429)", async () => {
    process.env.GEMINI_API_KEY = "test-key";
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 429 })));
    const { generateText } = await import("@/lib/control/ai/gemini");
    await expect(generateText({ system: "s", prompt: "p" })).rejects.toMatchObject({ code: "quota", status: 429 });
  });
});

describe("tasks by deadline", () => {
  it("buckets open tasks relative to today and skips done ones", async () => {
    const { deadlineBuckets } = await import("@/components/control/lib/deadline");
    const now = "2026-10-10";
    const t = (due_date: string | null, status: "todo" | "done" = "todo") => ({ status, due_date });
    const out = Object.fromEntries(
      deadlineBuckets([t("2026-10-08"), t(now), t("2026-10-17"), t("2026-10-18"), t(null), t("2026-10-01", "done")], now).map((b) => [b.key, b.items.length]),
    );
    expect(out).toEqual({ late: 1, today: 1, week: 1, later: 1, none: 1 });
  });
});

describe("client navigation", () => {
  it("client accounts only get client-facing pages", async () => {
    const { navFor, NAV } = await import("@/components/control/nav");
    const hrefs = navFor("client_viewer").flatMap((g) => g.items.map((i) => i.href));
    expect(hrefs).toEqual(["/control", "/control/projetos", "/control/monitoramento", "/control/relatorios"]);
    expect(navFor("member")).toBe(NAV);
  });
});
