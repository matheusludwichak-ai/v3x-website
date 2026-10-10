"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { whatsappHref } from "@/config/contact";
import { gsap, ScrollTrigger, setLenis } from "@/lib/motion";
import { WhatsAppIcon } from "./whatsapp-icon";

const PRIVATE = ["/control", "/login"];
const INTERACTIVE = "a, button, [role='button'], summary, label[for], select";

/** Inertial page scrolling (Lenis) kept in sync with ScrollTrigger. Off under reduced motion. */
function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.95, anchors: false });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, [enabled]);
}

/**
 * One pointer listener drives every desktop pointer effect:
 * brand light behind the content, a cursor ring that grows over interactive
 * elements and shows a label on [data-cursor], magnetic pull on [data-magnetic]
 * and a moderate 3D tilt plus light position on [data-tilt].
 * The native cursor is never hidden.
 */
function usePointerFX(enabled: boolean, glow: React.RefObject<HTMLDivElement | null>, ring: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    if (!enabled) return;
    const glowEl = glow.current;
    const ringEl = ring.current;
    if (!glowEl || !ringEl) return;
    if (!window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const label = ringEl.querySelector<HTMLSpanElement>("span")!;
    gsap.set([glowEl, ringEl], { xPercent: -50, yPercent: -50 });
    const glowX = gsap.quickTo(glowEl, "x", { duration: 1.1, ease: "power3.out" });
    const glowY = gsap.quickTo(glowEl, "y", { duration: 1.1, ease: "power3.out" });
    const ringX = gsap.quickTo(ringEl, "x", { duration: 0.28, ease: "power3.out" });
    const ringY = gsap.quickTo(ringEl, "y", { duration: 0.28, ease: "power3.out" });

    let magnet: HTMLElement | null = null;
    let tilt: HTMLElement | null = null;
    let shown = false;

    const release = (el: HTMLElement | null, kind: "magnet" | "tilt") => {
      if (!el) return;
      if (kind === "magnet") gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.55)" });
      else {
        gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.9, ease: "power3.out" });
        el.style.removeProperty("--px");
        el.style.removeProperty("--py");
        el.removeAttribute("data-hover");
      }
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!shown) {
        shown = true;
        gsap.set([ringEl, glowEl], { x: e.clientX, y: e.clientY });
        gsap.to([ringEl, glowEl], { autoAlpha: 1, duration: 0.4 });
      }
      glowX(e.clientX);
      glowY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);

      const target = e.target as Element | null;
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      if (labelled && label.textContent !== labelled.dataset.cursor) label.textContent = labelled.dataset.cursor ?? "";

      const nextMagnet = target?.closest<HTMLElement>("[data-magnetic]") ?? null;
      if (nextMagnet !== magnet) {
        release(magnet, "magnet");
        magnet = nextMagnet;
      }
      if (magnet) {
        const r = magnet.getBoundingClientRect();
        const strength = Number(magnet.dataset.magnetic) || 0.3;
        gsap.to(magnet, { x: (e.clientX - (r.left + r.width / 2)) * strength, y: (e.clientY - (r.top + r.height / 2)) * strength, duration: 0.5, ease: "power3.out", overwrite: "auto" });
      }

      const nextTilt = target?.closest<HTMLElement>("[data-tilt]") ?? null;
      if (nextTilt !== tilt) {
        release(tilt, "tilt");
        tilt = nextTilt;
        tilt?.setAttribute("data-hover", "");
      }
      if (tilt) {
        const r = tilt.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const max = Number(tilt.dataset.tilt) || 5;
        tilt.style.setProperty("--px", `${(px * 100).toFixed(1)}%`);
        tilt.style.setProperty("--py", `${(py * 100).toFixed(1)}%`);
        gsap.to(tilt, { rotateY: (px - 0.5) * max * 2, rotateX: (0.5 - py) * max * 2, transformPerspective: 1400, duration: 0.8, ease: "power3.out", overwrite: "auto" });
      }
    };

    const over = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      const typing = target?.closest("input, textarea, [contenteditable='true']");
      const interactive = target?.closest(INTERACTIVE);
      ringEl.dataset.state = typing ? "hidden" : labelled ? "label" : interactive ? "link" : "idle";
      label.textContent = labelled?.dataset.cursor ?? "";
    };

    const leave = () => {
      shown = false;
      gsap.to([ringEl, glowEl], { autoAlpha: 0, duration: 0.3 });
      release(magnet, "magnet");
      release(tilt, "tilt");
      magnet = tilt = null;
    };
    const down = () => ringEl.setAttribute("data-down", "");
    const up = () => ringEl.removeAttribute("data-down");

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      gsap.killTweensOf([glowEl, ringEl]);
    };
  }, [enabled, glow, ring]);
}

/** Site-wide public layer: smooth scrolling, pointer effects and the floating WhatsApp shortcut. */
export function PublicChrome() {
  const path = usePathname();
  const glow = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const isPrivate = PRIVATE.some((p) => path === p || path.startsWith(`${p}/`));

  useSmoothScroll(!isPrivate);
  usePointerFX(!isPrivate, glow, ring);

  if (isPrivate) return null;
  const wa = whatsappHref();

  return (
    <>
      <div aria-hidden className="cursor-glow" ref={glow} />
      <div aria-hidden className="cursor-ring" ref={ring} data-state="idle">
        <span />
      </div>
      {wa && (
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Conversar com a V3X no WhatsApp (abre em nova aba)"
          className="wa-float group"
        >
          <WhatsAppIcon className="size-[22px] shrink-0" />
          <span className="wa-float-label">Conversar no WhatsApp</span>
        </a>
      )}
    </>
  );
}
