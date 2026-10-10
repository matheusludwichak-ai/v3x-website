/**
 * Measurement configuration for the public site.
 *
 * - GA4 measurement ID: public identifier (not a secret). The V3X property already
 *   exists ("V3X WEBSITE" stream), so its ID is the default.
 * - GTM container ID: optional. When set, the site loads ONLY the GTM container and
 *   GA4 must be configured inside it, so the same events are never sent twice.
 * Nothing loads before the visitor allows analytics cookies, and nothing loads on the
 * Control (/control, /login), which is not part of the marketing funnel.
 */
const GA_PATTERN = /^G-[A-Z0-9]{6,}$/;
const GTM_PATTERN = /^GTM-[A-Z0-9]{4,}$/;

const rawGa = (process.env.NEXT_PUBLIC_GA_ID ?? "G-H3NVMRK99E").trim();
const rawGtm = (process.env.NEXT_PUBLIC_GTM_ID ?? "").trim();

export const GA_ID = GA_PATTERN.test(rawGa) ? rawGa : "";
export const GTM_ID = GTM_PATTERN.test(rawGtm) ? rawGtm : "";

/** "gtm": container manages every tag. "gtag": GA4 loaded directly. "off": no IDs. */
export const ANALYTICS_MODE: "gtm" | "gtag" | "off" = GTM_ID ? "gtm" : GA_ID ? "gtag" : "off";

export const PRIVATE_PATHS = ["/control", "/login"];
export const isPrivatePath = (path: string) => PRIVATE_PATHS.some((p) => path === p || path.startsWith(`${p}/`));

/** Page groups sent as page_type, so reports can compare services, cases and articles. */
export function pageType(path: string): string {
  if (path === "/") return "home";
  const [, first, second] = path.split("/");
  const groups: Record<string, [string, string]> = {
    servicos: ["service_list", "service"],
    projetos: ["project_list", "project"],
    blog: ["blog_list", "article"],
  };
  if (first && groups[first]) return second ? groups[first][1] : groups[first][0];
  if (first === "contato") return "contact";
  if (first === "sobre") return "about";
  if (first === "privacidade" || first === "termos") return "legal";
  return "other";
}

/** Detail pages whose views and card clicks are measured as content. */
export function contentFromPath(path: string): { content_type: string; content_id: string } | null {
  const m = /^\/(servicos|projetos|blog)\/([^/?#]+)\/?$/.exec(path);
  if (!m) return null;
  const type = { servicos: "service", projetos: "portfolio_project", blog: "blog_article" }[m[1] as "servicos" | "projetos" | "blog"];
  return { content_type: type, content_id: decodeURIComponent(m[2]!) };
}
