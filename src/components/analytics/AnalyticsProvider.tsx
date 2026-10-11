"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ANALYTICS_MODE, GA_ID, GTM_ID, contentFromPath, isPrivatePath } from "@/lib/analytics/config";
import { CONSENT_EVENT, readConsent, type ConsentChoice } from "@/lib/analytics/consent";
import { pendingCampaign, rememberLanding, rememberLandingCampaign } from "@/lib/analytics/campaign";
import { describeClick } from "@/lib/analytics/clicks";
import { setTrackingDebug, setTrackingEnabled, track, trackingEnabled } from "@/lib/analytics/track";

type W = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void; __v3xConsentDefault?: boolean } & Record<string, unknown>;

let tagsLoaded = false;
let lastContextPath: string | null = null;

function inject(src: string) {
  const s = document.createElement("script");
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

/** Loads GTM or GA4 once, after consent. Never in development, so local tests send nothing to Google. */
function loadTags(debug: boolean) {
  if (tagsLoaded) return;
  tagsLoaded = true;
  if (process.env.NODE_ENV !== "production") return;
  const w = window as unknown as W;
  const campaign = pendingCampaign(window.location.search);
  if (ANALYTICS_MODE === "gtm") {
    if (Object.keys(campaign).length) w.dataLayer!.push({ landing_campaign: campaign });
    w.dataLayer!.push({ "gtm.start": Date.now(), event: "gtm.js" });
    inject(`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`);
  } else {
    w.gtag!("js", new Date());
    // The config hit is the page_view of the current page; later navigations are measured by
    // GA4 enhanced measurement (browser history), so no page_view is sent manually.
    w.gtag!("config", GA_ID, { ...campaign, ...(debug ? { debug_mode: true } : {}) });
    inject(`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`);
  }
}

/** Removes GA cookies when analytics consent is withdrawn. */
function clearGaCookies() {
  const host = window.location.hostname;
  const domains = ["", host, `.${host.split(".").slice(-3).join(".")}`, `.${host.split(".").slice(-2).join(".")}`];
  for (const name of document.cookie.split(";").map((c) => c.split("=")[0]!.trim())) {
    if (name !== "_ga" && !name.startsWith("_ga_")) continue;
    for (const d of domains) document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ""}`;
  }
}

/** content_view on detail pages and page_not_found on the 404 page, once per path. */
function trackPageContext(path: string) {
  if (!trackingEnabled() || lastContextPath === path) return;
  lastContextPath = path;
  if (document.querySelector("[data-page-not-found]")) {
    track("page_not_found", { page_path: path });
    return;
  }
  const content = contentFromPath(path);
  if (content) track("content_view", content);
}

/**
 * Measurement for the public site: Consent Mode defaults (everything denied), tags only
 * after the visitor allows analytics, one delegated click listener and page context events.
 * Does nothing on the Control (/control, /login).
 */
export function AnalyticsProvider() {
  const path = usePathname();

  useEffect(() => {
    if (ANALYTICS_MODE === "off" || isPrivatePath(window.location.pathname)) return;
    const w = window as unknown as W;
    let debug = false;
    try {
      if (new URLSearchParams(window.location.search).get("analytics_debug") === "1") window.sessionStorage.setItem("v3x-analytics-debug", "1");
      debug = window.sessionStorage.getItem("v3x-analytics-debug") === "1";
    } catch {
      // Storage blocked: no debug mode.
    }
    setTrackingDebug(debug || process.env.NODE_ENV !== "production");
    rememberLandingCampaign(window.location.search);
    rememberLanding(window.location.pathname, document.referrer);

    w.dataLayer ??= [];
    w.gtag ??= function gtag() {
      // gtag.js expects the Arguments object itself.
      // eslint-disable-next-line prefer-rest-params
      w.dataLayer!.push(arguments);
    };
    if (!w.__v3xConsentDefault) {
      w.__v3xConsentDefault = true;
      w.gtag("consent", "default", {
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        analytics_storage: "denied",
        functionality_storage: "granted",
        security_storage: "granted",
      });
    }

    const apply = (c: ConsentChoice | null) => {
      const analytics = !!c?.analytics;
      const marketing = !!c?.marketing;
      if (c) {
        w.gtag!("consent", "update", {
          analytics_storage: analytics ? "granted" : "denied",
          ad_storage: marketing ? "granted" : "denied",
          ad_user_data: marketing ? "granted" : "denied",
          ad_personalization: marketing ? "granted" : "denied",
        });
      }
      if (GA_ID) w[`ga-disable-${GA_ID}`] = !analytics;
      const wasEnabled = trackingEnabled();
      setTrackingEnabled(analytics);
      if (analytics) {
        loadTags(debug);
        if (!wasEnabled) trackPageContext(window.location.pathname);
      } else if (c) {
        clearGaCookies();
      }
    };
    apply(readConsent());

    const onConsent = (e: Event) => apply((e as CustomEvent<ConsentChoice>).detail);
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || !(e.target instanceof Element)) return;
      const hit = describeClick(e.target, window.location.origin);
      if (hit) track(hit.event, hit.params);
    };
    const onToggle = (e: Event) => {
      const d = e.target;
      if (!(d instanceof HTMLDetailsElement) || !d.open) return;
      track("faq_expand", { faq_question: d.querySelector("summary")?.textContent ?? "", content_type: contentFromPath(window.location.pathname)?.content_type });
    };
    window.addEventListener(CONSENT_EVENT, onConsent);
    document.addEventListener("click", onClick, true);
    document.addEventListener("toggle", onToggle, true);
    return () => {
      window.removeEventListener(CONSENT_EVENT, onConsent);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("toggle", onToggle, true);
    };
  }, []);

  useEffect(() => {
    if (isPrivatePath(path)) {
      setTrackingEnabled(false);
      return;
    }
    trackPageContext(path);
  }, [path]);

  return null;
}
