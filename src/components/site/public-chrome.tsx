"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { whatsappHref } from "@/config/contact";
import { WhatsAppIcon } from "./whatsapp-icon";

const PRIVATE = ["/control", "/login"];

/** Site-wide public layer: cursor-reactive brand light and the floating WhatsApp shortcut. */
export function PublicChrome() {
  const path = usePathname();
  const glow = useRef<HTMLDivElement>(null);
  const isPrivate = PRIVATE.some((p) => path === p || path.startsWith(`${p}/`));

  useEffect(() => {
    if (isPrivate) return;
    const el = glow.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let x = 0;
    let y = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        el.style.transform = `translate3d(${x - 360}px, ${y - 360}px, 0)`;
        el.style.opacity = "1";
      });
    };
    const leave = () => (el.style.opacity = "0");
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [isPrivate]);

  if (isPrivate) return null;
  const wa = whatsappHref();

  return (
    <>
      <div aria-hidden className="cursor-glow" ref={glow} />
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
