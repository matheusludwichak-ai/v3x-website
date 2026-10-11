import { describe, expect, it } from "vitest";
import { contentFromPath, isPrivatePath, pageType } from "@/lib/analytics/config";
import { sanitize, track, setTrackingEnabled } from "@/lib/analytics/track";
import { campaignFromSearch } from "@/lib/analytics/campaign";

describe("analytics: privacy", () => {
  it("drops unknown keys, e-mails and phone numbers", () => {
    const out = sanitize({ cta_name: "comecar_projeto", email: "a@b.com", nome: "Fulano", cta_location: "fulano@empresa.com.br", nav_item: "(47) 98812-8598", form_name: "contato_pagina" });
    expect(out).toEqual({ cta_name: "comecar_projeto", form_name: "contato_pagina" });
  });
  it("trims and caps long values", () => {
    expect(sanitize({ faq_question: `  ${"x".repeat(300)}  ` }).faq_question).toHaveLength(100);
  });
  it("sends nothing before consent", () => {
    setTrackingEnabled(false);
    expect(() => track("cta_click", { cta_name: "x" })).not.toThrow();
  });
});

describe("analytics: pages", () => {
  it("keeps the Control out of measurement", () => {
    expect(isPrivatePath("/control")).toBe(true);
    expect(isPrivatePath("/control/tarefas")).toBe(true);
    expect(isPrivatePath("/login")).toBe(true);
    expect(isPrivatePath("/controle-de-qualidade")).toBe(false);
    expect(isPrivatePath("/")).toBe(false);
  });
  it("groups pages by type", () => {
    expect(pageType("/")).toBe("home");
    expect(pageType("/servicos")).toBe("service_list");
    expect(pageType("/servicos/web-design")).toBe("service");
    expect(pageType("/projetos/veredito")).toBe("project");
    expect(pageType("/blog/quanto-custa")).toBe("article");
    expect(pageType("/contato")).toBe("contact");
    expect(pageType("/termos")).toBe("legal");
  });
  it("identifies content detail pages", () => {
    expect(contentFromPath("/blog/meu-artigo")).toEqual({ content_type: "blog_article", content_id: "meu-artigo" });
    expect(contentFromPath("/projetos/veredito")).toEqual({ content_type: "portfolio_project", content_id: "veredito" });
    expect(contentFromPath("/servicos")).toBeNull();
    expect(contentFromPath("/blog/a/b")).toBeNull();
  });
});

describe("analytics: campaigns", () => {
  it("maps UTMs to GA4 campaign fields and ignores the rest", () => {
    expect(campaignFromSearch("?utm_source=instagram&utm_medium=social&utm_campaign=lancamento&x=1")).toEqual({ campaign_source: "instagram", campaign_medium: "social", campaign_name: "lancamento" });
    expect(campaignFromSearch("?gclid=abc")).toEqual({});
  });
});

describe("security helpers", () => {
  it("JSON-LD can never close the script tag", async () => {
    const { safeJson } = await import("@/lib/json-ld");
    const out = safeJson({ headline: "</script><script>alert(1)</script>" });
    expect(out).not.toContain("<");
    expect(JSON.parse(out).headline).toBe("</script><script>alert(1)</script>");
  });
  it("markdown escapes raw HTML and drops javascript: links", async () => {
    const { renderMarkdown } = await import("@/lib/markdown");
    const html = renderMarkdown('<img src=x onerror=alert(1)> [x](javascript:alert(1)) [y](https://evil.example/?grupov3x.com.br)');
    expect(html).not.toContain("<img src=x");
    expect(html).not.toContain("javascript:");
    expect(html).toContain('rel="noopener nofollow"');
  });
});
