/**
 * Campaign attribution. GA4 reads utm_* from the URL of the first hit, but tags only load
 * after consent: if the visitor navigates before accepting, the landing UTMs would be gone.
 * The landing campaign is kept for the session (sessionStorage, this browser only) and handed
 * to GA4 through its documented campaign_* fields. Nothing is invented: only values that were
 * really in the landing URL are used.
 */
const KEY = "v3x-landing-campaign";
const FIELDS = { utm_source: "campaign_source", utm_medium: "campaign_medium", utm_campaign: "campaign_name", utm_term: "campaign_term", utm_content: "campaign_content", utm_id: "campaign_id" } as const;

export type Campaign = Partial<Record<(typeof FIELDS)[keyof typeof FIELDS], string>>;

export function campaignFromSearch(search: string): Campaign {
  const params = new URLSearchParams(search);
  const out: Campaign = {};
  for (const [utm, field] of Object.entries(FIELDS)) {
    const value = params.get(utm)?.trim();
    if (value) out[field as keyof Campaign] = value.slice(0, 100);
  }
  return out;
}

/** Called once on the first page of the visit. */
export function rememberLandingCampaign(search: string) {
  const campaign = campaignFromSearch(search);
  if (!Object.keys(campaign).length) return;
  try {
    if (!window.sessionStorage.getItem(KEY)) window.sessionStorage.setItem(KEY, JSON.stringify(campaign));
  } catch {
    // Storage blocked: GA4 still reads UTMs when consent is given on the landing page.
  }
}

/** Landing campaign to apply when tags load on a later page without UTMs. */
export function pendingCampaign(currentSearch: string): Campaign {
  if (Object.keys(campaignFromSearch(currentSearch)).length) return {};
  try {
    const raw = window.sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Campaign) : {};
  } catch {
    return {};
  }
}

const LANDING_KEY = "v3x-landing";

/**
 * First page of the visit and the site that sent the visitor (domain only). Kept for the
 * session and sent ONLY together with a contact form the visitor chooses to submit, so the
 * Control can show which channels bring leads. Not shared with third parties.
 */
export function rememberLanding(path: string, referrer: string) {
  try {
    if (window.sessionStorage.getItem(LANDING_KEY)) return;
    let ref = "";
    try {
      const host = referrer ? new URL(referrer).hostname : "";
      ref = host && host !== window.location.hostname ? host : "";
    } catch {
      ref = "";
    }
    window.sessionStorage.setItem(LANDING_KEY, JSON.stringify({ landing_page: path.slice(0, 200), referrer: ref }));
  } catch {
    // Storage blocked: the lead is saved without attribution.
  }
}

/** Attribution sent with the lead form: landing page, referrer domain and landing UTMs. */
export function leadAttribution(): Record<string, string> {
  const out: Record<string, string> = {};
  try {
    Object.assign(out, JSON.parse(window.sessionStorage.getItem(LANDING_KEY) ?? "{}"));
    const utm = JSON.parse(window.sessionStorage.getItem(KEY) ?? "{}") as Campaign;
    const back: Record<string, string> = { campaign_source: "utm_source", campaign_medium: "utm_medium", campaign_name: "utm_campaign", campaign_term: "utm_term", campaign_content: "utm_content", campaign_id: "utm_id" };
    for (const [field, value] of Object.entries(utm)) if (value && back[field]) out[back[field]] = value;
  } catch {
    // No attribution available.
  }
  for (const k of Object.keys(out)) if (!out[k]) delete out[k];
  return out;
}
