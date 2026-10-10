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
