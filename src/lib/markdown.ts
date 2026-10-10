import { Marked, type Tokens } from "marked";

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const safeHref = (href: string) => {
  const h = href.trim();
  if (h.startsWith("/") || h.startsWith("#")) return h;
  try {
    const url = new URL(h);
    return url.protocol === "https:" || url.protocol === "http:" || url.protocol === "mailto:" ? url.toString() : null;
  } catch {
    return null;
  }
};

const slugId = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * Markdown renderer for articles written in the Control. Raw HTML is escaped
 * (never executed), links are limited to http(s), mailto and site paths, and
 * external links open with rel="noopener nofollow".
 */
const md = new Marked({
  gfm: true,
  renderer: {
    html({ text }: Tokens.HTML | Tokens.Tag) {
      return escapeHtml(text);
    },
    link({ href, title, tokens }: Tokens.Link) {
      const label = this.parser.parseInline(tokens);
      const url = safeHref(href);
      if (!url) return label;
      const external = /^https?:/i.test(url) && !url.includes("grupov3x.com.br");
      return `<a href="${escapeHtml(url)}"${title ? ` title="${escapeHtml(title)}"` : ""}${external ? ' target="_blank" rel="noopener nofollow"' : ""}>${label}</a>`;
    },
    image({ href, text }: Tokens.Image) {
      const url = safeHref(href);
      return url ? `<img src="${escapeHtml(url)}" alt="${escapeHtml(text)}" loading="lazy" />` : "";
    },
    heading({ tokens, depth }: Tokens.Heading) {
      const text = this.parser.parseInline(tokens);
      // The article title is the only H1 on the page.
      const level = Math.max(2, depth);
      return `<h${level} id="${slugId(text)}">${text}</h${level}>`;
    },
  },
});

export function renderMarkdown(source: string) {
  return md.parse(source, { async: false }) as string;
}

export function wordCount(source: string) {
  return source.replace(/[#>*_`[\]()-]/g, " ").split(/\s+/).filter(Boolean).length;
}
