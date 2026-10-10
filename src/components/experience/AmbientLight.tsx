"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/motion";

/* Where the blue and violet lights sit while each section is on screen (viewport %, opacity). */
const SCENES: Record<string, { a: [number, number, number]; b: [number, number, number] }> = {
  servicos: { a: [12, 18, 0.9], b: [88, 78, 0.55] },
  projetos: { a: [86, 22, 0.75], b: [10, 82, 0.8] },
  fundadores: { a: [70, 70, 0.45], b: [20, 20, 0.4] },
  contato: { a: [62, 38, 1], b: [32, 70, 1] },
};

/**
 * Fixed light layer behind the content. The two brand lights glide to a new
 * position when a section takes over, so the lighting changes gradually from
 * one chapter to the next. Static under reduced motion.
 */
export function AmbientLight() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const [a, b] = gsap.utils.toArray<HTMLElement>(".ambient-light", root.current);
        gsap.set([a!, b!], { xPercent: -50, yPercent: -50 });
        const go = (id: string | null) => {
          const scene = id ? SCENES[id] : null;
          const vw = window.innerWidth / 100;
          const vh = window.innerHeight / 100;
          gsap.to(a!, { x: (scene?.a[0] ?? 15) * vw, y: (scene?.a[1] ?? 20) * vh, autoAlpha: scene?.a[2] ?? 0, duration: 2.2, ease: "power2.inOut", overwrite: true });
          gsap.to(b!, { x: (scene?.b[0] ?? 85) * vw, y: (scene?.b[1] ?? 80) * vh, autoAlpha: scene?.b[2] ?? 0, duration: 2.6, ease: "power2.inOut", overwrite: true });
        };
        go(null);
        Object.keys(SCENES).forEach((id) =>
          ScrollTrigger.create({
            trigger: `#${id}`,
            start: "top 60%",
            end: "bottom 60%",
            onToggle: (self) => self.isActive && go(id),
            onLeaveBack: id === "servicos" ? () => go(null) : undefined,
          }),
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} aria-hidden className="ambient">
      <span className="ambient-light ambient-a" />
      <span className="ambient-light ambient-b" />
    </div>
  );
}
