"use client";

import { useEffect, useRef, type ElementType, type ReactNode, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

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

/** Splits a line into words that slide up from a mask. */
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
