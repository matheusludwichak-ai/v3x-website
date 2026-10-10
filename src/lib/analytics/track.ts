import { ANALYTICS_MODE, pageType } from "./config";

/**
 * Event catalog. Every custom event sent by the site is listed here; the full description
 * (when it fires, parameters, purpose, conversion or not) is in docs/ANALYTICS.md.
 * page_view, scroll, outbound clicks (click), file_download and site search come from
 * GA4 enhanced measurement and are deliberately NOT sent again by this code.
 */
export const EVENTS = [
  "navigation_click",
  "menu_toggle",
  "cta_click",
  "contact_click",
  "select_content",
  "content_view",
  "content_filter",
  "faq_expand",
  "video_interaction",
  "lead_form_start",
  "lead_form_submit",
  "generate_lead",
  "lead_form_error",
  "lead_form_abandon",
  "page_not_found",
] as const;
export type EventName = (typeof EVENTS)[number];

/** Only these parameters ever leave the browser. Values are short labels, never form content. */
const PARAMS = [
  "page_type",
  "cta_name",
  "cta_location",
  "nav_location",
  "nav_item",
  "link_url",
  "link_domain",
  "contact_method",
  "content_type",
  "content_id",
  "filter_name",
  "filter_value",
  "faq_question",
  "video_title",
  "video_action",
  "menu_state",
  "form_name",
  "error_type",
  "last_field",
  "lead_source",
  "service_interest",
  "page_path",
] as const;
export type EventParams = Partial<Record<(typeof PARAMS)[number], string | number | boolean | null | undefined>>;

const ALLOWED = new Set<string>(PARAMS);
const EMAIL = /[^\s@]+@[^\s@]+\.[^\s@]+/;
const PHONE = /(\d[\s().-]*){8,}/;

/** Drops unknown keys and anything that looks like an e-mail or phone number. */
export function sanitize(params: Record<string, unknown>): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(params)) {
    if (!ALLOWED.has(key) || value === undefined || value === null || value === "") continue;
    if (typeof value === "number" || typeof value === "boolean") {
      out[key] = value;
      continue;
    }
    if (typeof value !== "string") continue;
    const text = value.replace(/\s+/g, " ").trim().slice(0, 100);
    if (!text || EMAIL.test(text) || PHONE.test(text)) continue;
    out[key] = text;
  }
  return out;
}

type Gtag = (...args: unknown[]) => void;
type AnalyticsWindow = Window & { dataLayer?: unknown[]; gtag?: Gtag; __v3xAnalyticsDebug?: { event: string; params: Record<string, unknown> }[] };

let enabled = false;
let debug = false;

/** Turned on by the provider only after consent for analytics, and only on public pages. */
export function setTrackingEnabled(value: boolean) {
  enabled = value;
}
export function setTrackingDebug(value: boolean) {
  debug = value;
}
export const trackingEnabled = () => enabled;

/** Sends one event (no-op without consent). Never pass personal data: it is dropped anyway. */
export function track(event: EventName, params: EventParams = {}) {
  if (!enabled || typeof window === "undefined" || ANALYTICS_MODE === "off") return;
  const w = window as AnalyticsWindow;
  const clean = sanitize({ page_type: pageType(window.location.pathname), ...params });

  if (ANALYTICS_MODE === "gtm") {
    // GTM keeps pushed keys in its data model; clear the ones this event does not set.
    const reset = Object.fromEntries(PARAMS.map((k) => [k, undefined]));
    (w.dataLayer ??= []).push({ ...reset, event, ...clean });
  } else {
    w.gtag?.("event", event, clean);
  }

  if (debug) {
    (w.__v3xAnalyticsDebug ??= []).push({ event, params: clean });
    console.info("[analytics]", event, clean);
  }
}
