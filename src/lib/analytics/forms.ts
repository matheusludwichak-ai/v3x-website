"use client";

import { useEffect, useRef, type FocusEvent } from "react";
import { track } from "./track";

export type LeadFormError = "validation" | "server" | "unavailable" | "network";

/**
 * Lead form funnel: start (first field focused) > submit (attempt) > generate_lead (the server
 * confirmed) or lead_form_error. Abandon = started, never succeeded, and the visitor left the
 * page or closed the dialog. Only the form name and field NAMES are sent, never values.
 */
export function useLeadFormTracking(formName: string) {
  const state = useRef({ started: false, done: false, lastField: "", invalidAt: 0 });

  const abandon = () => {
    const s = state.current;
    if (!s.started || s.done) return;
    s.done = true;
    track("lead_form_abandon", { form_name: formName, last_field: s.lastField });
  };

  useEffect(() => {
    const onHide = () => abandon();
    window.addEventListener("pagehide", onHide);
    return () => {
      window.removeEventListener("pagehide", onHide);
      abandon();
    };
    // abandon only reads the ref; re-subscribing on every render is unnecessary.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    /** Spread on the <form>. */
    onFocusCapture: (e: FocusEvent<HTMLFormElement>) => {
      const name = (e.target as unknown as HTMLInputElement).name;
      if (!name) return;
      const s = state.current;
      s.lastField = name;
      if (!s.started) {
        s.started = true;
        s.done = false;
        track("lead_form_start", { form_name: formName });
      }
    },
    submitted: () => track("lead_form_submit", { form_name: formName }),
    succeeded: (serviceInterest?: string) => {
      state.current.done = true;
      track("generate_lead", { form_name: formName, lead_source: "site_form", service_interest: serviceInterest });
    },
    failed: (error: LeadFormError) => track("lead_form_error", { form_name: formName, error_type: error }),
    /** Browser validation fires "invalid" once per field; report one error per attempt. */
    invalid: () => {
      const now = Date.now();
      if (now - state.current.invalidAt < 1000) return;
      state.current.invalidAt = now;
      track("lead_form_error", { form_name: formName, error_type: "validation" });
    },
    /** Dialog closed: counts as abandon if it was started, then a new attempt can begin. */
    closed: () => {
      abandon();
      state.current = { started: false, done: false, lastField: "", invalidAt: 0 };
    },
  };
}
