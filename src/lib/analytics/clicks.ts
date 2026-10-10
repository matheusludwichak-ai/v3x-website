import { contentFromPath } from "./config";
import { EVENTS, type EventName, type EventParams } from "./track";

/**
 * Turns one click into at most one analytics event. A single delegated listener uses this,
 * so a click can never be counted twice by overlapping handlers.
 *
 * Priority: contact channels (WhatsApp, e-mail, phone) > explicit [data-track] > content
 * cards (service, project, article links) > navigation in header, footer and menus.
 * Outbound links are left to GA4 enhanced measurement ("click" event).
 *
 * Markup conventions:
 *   data-track="cta_click" data-track-cta-name="comecar_projeto"  explicit event + params
 *   data-track-area="hero"                                         where on the page (container)
 */
const NAV_AREAS = new Set(["header", "footer", "mobile_menu", "breadcrumb", "not_found"]);
const KNOWN = new Set<string>(EVENTS);

function areaOf(el: Element): string {
  const marked = el.closest("[data-track-area]")?.getAttribute("data-track-area");
  if (marked) return marked;
  if (el.closest("[role='dialog']")) return "dialog";
  return el.closest("section[id]")?.id ?? "content";
}

function dataParams(el: Element): Record<string, string> {
  const out: Record<string, string> = {};
  for (const attr of Array.from(el.attributes)) {
    if (!attr.name.startsWith("data-track-") || attr.name === "data-track-area") continue;
    out[attr.name.slice("data-track-".length).replace(/-/g, "_")] = attr.value;
  }
  return out;
}

const labelOf = (el: Element) => (el.getAttribute("aria-label") ?? el.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 60);

export function contactMethod(url: URL): "whatsapp" | "email" | "phone" | null {
  if (url.protocol === "mailto:") return "email";
  if (url.protocol === "tel:") return "phone";
  if (/(^|\.)wa\.me$|(^|\.)whatsapp\.com$/.test(url.hostname)) return "whatsapp";
  return null;
}

export function describeClick(target: Element, origin: string): { event: EventName; params: EventParams } | null {
  const el = target.closest("a[href], button, [data-track]");
  if (!el) return null;
  const tracked = target.closest("[data-track]");
  const explicit = tracked && KNOWN.has(tracked.getAttribute("data-track") ?? "") ? (tracked.getAttribute("data-track") as EventName) : null;
  const extra = { ...dataParams(el), ...(tracked && tracked !== el ? dataParams(tracked) : {}) };
  const area = areaOf(el);
  const anchor = el.closest<HTMLAnchorElement>("a[href]");

  if (anchor) {
    let url: URL;
    try {
      url = new URL(anchor.getAttribute("href")!, origin);
    } catch {
      return null;
    }
    const method = contactMethod(url);
    if (method) return { event: "contact_click", params: { contact_method: method, cta_location: area, ...extra } };

    const internal = url.origin === origin;
    if (explicit) return { event: explicit, params: { cta_location: area, ...(internal ? { link_url: url.pathname } : { link_domain: url.hostname }), ...extra } };
    if (!internal) return null;

    const content = contentFromPath(url.pathname);
    if (content) return { event: "select_content", params: { ...content, cta_location: area } };
    if (NAV_AREAS.has(area)) return { event: "navigation_click", params: { nav_location: area, nav_item: extra.nav_item ?? labelOf(anchor), link_url: url.pathname + url.hash } };
    return null;
  }

  return explicit ? { event: explicit, params: { cta_location: area, ...extra } } : null;
}
