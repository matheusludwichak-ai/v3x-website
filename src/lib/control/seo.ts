import type { Article } from "./schema";

export type SeoCheck = { id: string; label: string; ok: boolean; level: "required" | "recommended"; hint?: string };

const words = (md: string) => md.replace(/[#>*_`[\]()-]/g, " ").split(/\s+/).filter(Boolean).length;

/**
 * Editorial and technical SEO checklist for an article. "required" items block
 * publication; "recommended" items are shown as guidance. Shared by the editor
 * (live feedback) and the publish endpoint (enforcement).
 */
export function seoChecklist(a: Partial<Article>, takenSlugs: string[] = []): SeoCheck[] {
  const content = a.content_md ?? "";
  const kw = (a.primary_keyword ?? "").trim().toLowerCase();
  const seoTitle = (a.seo_title || a.title || "").trim();
  const meta = (a.meta_description ?? "").trim();
  const h2 = (content.match(/^##\s+/gm) ?? []).length;
  const h1InBody = /^#\s+/m.test(content);
  const intro = content.split(/\n#{2,3}\s/)[0]?.toLowerCase() ?? "";
  const links = (content.match(/\]\(\/[^)]+\)/g) ?? []).length;
  const count = words(content);
  return [
    { id: "title", label: "Título editorial definido", ok: (a.title ?? "").trim().length >= 10, level: "required" },
    { id: "slug", label: "Slug válido e único", ok: /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(a.slug ?? "") && !takenSlugs.includes(a.slug ?? ""), level: "required", hint: takenSlugs.includes(a.slug ?? "") ? "Este slug já está em uso no site." : undefined },
    { id: "meta", label: "Meta descrição entre 120 e 160 caracteres", ok: meta.length >= 120 && meta.length <= 160, level: "required", hint: `${meta.length} caracteres` },
    { id: "length", label: "Conteúdo com pelo menos 600 palavras", ok: count >= 600, level: "required", hint: `${count} palavras` },
    { id: "structure", label: "Pelo menos 3 seções H2 e nenhum H1 no corpo", ok: h2 >= 3 && !h1InBody, level: "required", hint: h1InBody ? "Use ## no corpo: o título já é o H1." : `${h2} seções H2` },
    { id: "seoTitle", label: "Título SEO com até 60 caracteres", ok: seoTitle.length > 0 && seoTitle.length <= 60, level: "recommended", hint: `${seoTitle.length} caracteres` },
    { id: "keyword", label: "Palavra-chave principal definida", ok: kw.length > 0, level: "recommended" },
    { id: "kwTitle", label: "Palavra-chave no título SEO", ok: !!kw && seoTitle.toLowerCase().includes(kw), level: "recommended" },
    { id: "kwIntro", label: "Palavra-chave na introdução", ok: !!kw && intro.includes(kw), level: "recommended" },
    { id: "links", label: "Ao menos 2 links internos", ok: links >= 2, level: "recommended", hint: `${links} links internos` },
    { id: "verify", label: "Sem marcações [VERIFICAR] pendentes", ok: !content.includes("[VERIFICAR]"), level: "required", hint: "Revise as afirmações marcadas antes de publicar." },
    { id: "cover", label: "Texto alternativo da capa (se houver capa)", ok: !a.cover_url || !!(a.cover_alt ?? "").trim(), level: "recommended" },
  ];
}

export const blockingIssues = (checks: SeoCheck[]) => checks.filter((c) => c.level === "required" && !c.ok);
