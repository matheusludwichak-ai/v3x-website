import { describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

/**
 * Route-level live test: calls the real route handlers (guard + validation + Gemini)
 * in local mode, as the browser does. Skipped unless GEMINI_LIVE=1 and GEMINI_API_KEY are set.
 */
const live = process.env.GEMINI_LIVE === "1" && !!process.env.GEMINI_API_KEY;

vi.mock("next/headers", () => ({
  headers: async () => new Headers({ host: "localhost:3000" }),
  cookies: async () => ({ getAll: () => [], set: () => undefined }),
}));
vi.mock("next/cache", () => ({ revalidatePath: () => undefined }));

const post = (body: unknown) => new Request("http://localhost:3000/api/control/ai", { method: "POST", headers: { "Content-Type": "application/json", origin: "http://localhost:3000", host: "localhost:3000" }, body: JSON.stringify(body) });

describe.skipIf(!live)("AI routes (live, local mode)", () => {
  it("rejects invalid payloads before calling the model", async () => {
    const { POST } = await import("@/app/api/control/ai/route");
    const res = await POST(post({ action: "text", op: "hack", text: "x" }));
    expect(res.status).toBe(400);
  });

  it("improves a text through the route", async () => {
    const { POST } = await import("@/app/api/control/ai/route");
    const res = await POST(post({ action: "text", op: "improve", text: "a gente faz site e sistema pra empresa que quer crescer e organizar os processo" }));
    const json = (await res.json()) as { text: string; model: string };
    expect(res.status).toBe(200);
    expect(json.text.length).toBeGreaterThan(20);
    console.info("[live] melhorar:", json.text.slice(0, 160));
  }, 60000);

  it("suggests a reply for a conversation (suggestion only, nothing is sent)", async () => {
    const { POST } = await import("@/app/api/control/ai/route");
    const res = await POST(post({ action: "conversation", mode: "classify", transcript: [{ direction: "in", body: "Oi, quanto custa um site institucional com blog?" }] }));
    const json = (await res.json()) as { result: { category: string } };
    expect(res.status).toBe(200);
    expect(json.result.category).toBeTruthy();
  }, 60000);

  it("writes a report from real local data and states its limitations", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "v3x-report-"));
    const cwd = process.cwd();
    process.chdir(dir);
    try {
      vi.resetModules();
      const { POST } = await import("@/app/api/control/reports/route");
      const today = new Date().toISOString().slice(0, 10);
      const res = await POST(new Request("http://localhost:3000/api/control/reports", { method: "POST", headers: { "Content-Type": "application/json", origin: "http://localhost:3000", host: "localhost:3000" }, body: JSON.stringify({ type: "monitoring", audience: "internal", period_start: today, period_end: today }) }));
      const json = (await res.json()) as { data: { content_md: string }; limitations: string[] };
      expect(res.status).toBe(200);
      expect(json.limitations.join(" ")).toMatch(/verificação|projeto|tarefa/i);
      expect(json.data.content_md).toMatch(/Limita/i);
      console.info("[live] relatório:", json.data.content_md.slice(0, 200).replace(/\n/g, " "));
    } finally {
      process.chdir(cwd);
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }, 120000);
});
