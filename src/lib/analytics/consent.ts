/**
 * Visitor consent for non-essential cookies (LGPD). Stored only in the visitor's own
 * browser; nothing is sent anywhere. A choice expires after 12 months and is asked again.
 */
/** Version 2 (10/10/2026): marketing removed, ads features off. Older choices are asked again. */
export const CONSENT_VERSION = 2;
export type ConsentChoice = { v: typeof CONSENT_VERSION; analytics: boolean; marketing: boolean; at: string };

export const CONSENT_EVENT = "v3x:consent";
export const OPEN_PREFERENCES_EVENT = "v3x:consent-open";
const KEY = "v3x-consent";
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

// Used when storage is blocked: the choice lasts for this page view only.
let memory: ConsentChoice | null = null;

export function readConsent(now = Date.now()): ConsentChoice | null {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    return memory;
  }
  if (!raw) return memory;
  try {
    const c = JSON.parse(raw) as Partial<ConsentChoice>;
    if (c.v !== CONSENT_VERSION || typeof c.analytics !== "boolean" || typeof c.marketing !== "boolean" || typeof c.at !== "string") return null;
    const at = Date.parse(c.at);
    if (!Number.isFinite(at) || now - at > MAX_AGE_MS) return null;
    return c as ConsentChoice;
  } catch {
    return null;
  }
}

export function saveConsent(choice: { analytics: boolean; marketing: boolean }): ConsentChoice {
  const c: ConsentChoice = { v: CONSENT_VERSION, analytics: choice.analytics, marketing: choice.marketing, at: new Date().toISOString() };
  memory = c;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(c));
  } catch {
    // Storage blocked: keep the in-memory choice.
  }
  window.dispatchEvent(new CustomEvent<ConsentChoice>(CONSENT_EVENT, { detail: c }));
  return c;
}

/** Reopens the preferences panel (footer link). */
export function openConsentPreferences() {
  window.dispatchEvent(new Event(OPEN_PREFERENCES_EVENT));
}
