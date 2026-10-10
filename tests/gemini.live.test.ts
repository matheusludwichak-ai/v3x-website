import { describe, expect, it } from "vitest";

/**
 * Live test against the real Gemini API. Skipped unless GEMINI_LIVE=1 and
 * GEMINI_API_KEY are set in the environment of this command (never in the repo):
 *   GEMINI_LIVE=1 GEMINI_API_KEY=... npx vitest run tests/gemini.live.test.ts
 */
const live = process.env.GEMINI_LIVE === "1" && !!process.env.GEMINI_API_KEY;

describe.skipIf(!live)("Gemini (live)", () => {
  it("connects and finds the configured model", async () => {
    const { pingGemini } = await import("@/lib/control/ai/gemini");
    const res = await pingGemini();
    expect(res.ok, res.message).toBe(true);
  }, 30000);

  it("suggests blog topics with only internal links from the site", async () => {
    const { suggestTopics } = await import("@/lib/control/ai/actions");
    const res = await suggestTopics({ theme: "quando uma empresa precisa de um sistema sob medida", count: 3 });
    expect(res.topics.length).toBeGreaterThan(0);
    for (const t of res.topics) {
      expect(t.primary_keyword.length).toBeGreaterThan(2);
      for (const l of t.internal_links) expect(l.url.startsWith("/")).toBe(true);
    }
    console.info("[live] pautas:", res.topics.map((t) => t.title));
  }, 120000);

  it("writes a checklist for a task", async () => {
    const { checklistFor } = await import("@/lib/control/ai/actions");
    const res = await checklistFor({ title: "Publicar landing page do cliente", description: "Revisar SEO, formulários e performance antes de ir ao ar." });
    expect(res.items.length).toBeGreaterThanOrEqual(3);
  }, 60000);

  it("generates a full article draft that passes structure checks", async () => {
    const { generateArticle } = await import("@/lib/control/ai/actions");
    const { seoChecklist } = await import("@/lib/control/seo");
    const { article, model } = await generateArticle({ title: "Como saber se sua empresa precisa de um CRM sob medida", primary_keyword: "CRM sob medida", length: "short" });
    expect(article.content_md.length).toBeGreaterThan(2000);
    expect(/^#\s/m.test(article.content_md)).toBe(false);
    const checks = seoChecklist({ ...article, primary_keyword: "CRM sob medida" });
    console.info("[live] modelo:", model, "| título:", article.title, "| checklist:", checks.map((c) => `${c.ok ? "ok" : "x"} ${c.id}`).join(", "));
    expect(checks.find((c) => c.id === "structure")?.ok).toBe(true);
  }, 180000);
});
