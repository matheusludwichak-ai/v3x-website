"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useGSAP } from "@gsap/react";
import type Lenis from "lenis";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, useGSAP);
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/** Shared easing language of the site: fast start, long precise settle. */
export const EASE = "expo.out";
export const EASE_SOFT = "power3.out";

/** Media condition every non-essential animation is gated behind. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

let lenis: Lenis | null = null;
export const setLenis = (instance: Lenis | null) => {
  lenis = instance;
};
export const getLenis = () => lenis;

/** Smooth-scrolls to an element (or top) using Lenis when active, native scrolling otherwise. */
export function scrollToTarget(target: HTMLElement | null, offset = -64) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (lenis && !reduce) {
    // Lenis already applies the element's scroll-margin-top, so only the remainder is passed.
    const margin = target ? parseFloat(getComputedStyle(target).scrollMarginTop) || 0 : 0;
    lenis.scrollTo(target ?? 0, { offset: target ? offset + margin : 0, duration: 1.4 });
    return;
  }
  if (!target) return window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  const top = target.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
}

/** Pauses page scrolling while an overlay (dialog, mobile menu) is open. */
export function lockScroll(locked: boolean) {
  if (!lenis) return;
  if (locked) lenis.stop();
  else lenis.start();
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
