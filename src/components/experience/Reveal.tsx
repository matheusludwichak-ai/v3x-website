"use client";

import { useEffect, useRef, type ElementType, type ReactNode, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { gsap, SplitText, useGSAP, EASE, MOTION_OK } from "@/lib/motion";

export function useInView<T extends HTMLElement>(threshold = 0.2, observeParent = false) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(observeParent ? el.parentElement ?? el : el);
    return () => io.disconnect();
  }, [threshold, observeParent]);
  return ref;
}

export function Reveal({
  as: Tag = "div",
  className,
  children,
  delay = 0,
  mask = false,
}: {
  as?: ElementType;
  className?: string | undefined;
  children: ReactNode;
  delay?: number;
  mask?: boolean;
}) {
  const ref = useInView<HTMLElement>(0.1, mask);
  const style: CSSProperties = { transitionDelay: `${delay}ms` };
  return (
    <Tag ref={ref} style={style} className={cn(mask ? "reveal-mask" : "reveal", className)}>
      {children}
    </Tag>
  );
}

/**
 * Heading whose lines rise out of a mask when it scrolls into view.
 * Text stays in the DOM as real text (SplitText keeps an aria-label on the
 * element), and nothing is hidden without JavaScript or under reduced motion.
 */
export function SplitReveal({
  as: Tag = "h2",
  className,
  children,
  delay = 0,
  immediate = false,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  delay?: number;
  /** Plays on mount instead of on scroll (used above the fold). */
  immediate?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          onSplit(self) {
            return gsap.from(self.lines, {
              yPercent: 112,
              rotate: 2.5,
              duration: 1.25,
              ease: EASE,
              stagger: 0.09,
              delay,
              scrollTrigger: immediate ? undefined : { trigger: el, start: "top 88%", once: true },
            });
          },
        });
        el.classList.add("is-split");
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={cn("split-reveal", className)}>
      {children}
    </Tag>
  );
}

/** Kept for internal pages that still use word-by-word reveals. */
export function SplitWords({ text, className, stagger = 60 }: { text: string; className?: string; stagger?: number }) {
  const ref = useInView<HTMLSpanElement>(0.4);
  return (
    <span ref={ref} className={cn("block", className)} aria-label={text}>
      {text.split(" ").map((w, i) => (
        <span key={i} aria-hidden className="word-up inline-block overflow-hidden pb-[0.08em] align-bottom">
          <span style={{ transitionDelay: `${i * stagger}ms` }}><span className="interactive-word">{w}</span>&nbsp;</span>
        </span>
      ))}
    </span>
  );
}
