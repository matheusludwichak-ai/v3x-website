"use client";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { isPrivatePath } from "@/lib/analytics/config";

/** Vercel audience and performance metrics (cookieless), without the Control pages. */
const publicOnly = <T extends { url: string }>(event: T): T | null => {
  try {
    return isPrivatePath(new URL(event.url).pathname) ? null : event;
  } catch {
    return event;
  }
};

export function VercelMetrics() {
  return (
    <>
      <Analytics beforeSend={publicOnly} />
      <SpeedInsights beforeSend={publicOnly} />
    </>
  );
}
