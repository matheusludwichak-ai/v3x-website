"use client";

import { openConsentPreferences } from "@/lib/analytics/consent";

/** Footer link that reopens the cookie preferences. */
export function CookiePreferencesButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={openConsentPreferences} className={className}>
      Preferências de cookies
    </button>
  );
}
