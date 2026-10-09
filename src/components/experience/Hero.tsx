"use client";

import { useEffect, useRef } from "react";
import { ArrowDownRight } from "lucide-react";
import { GridField } from "./GridField";
import { Logo } from "@/components/brand/Logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero({ onContact }: { onContact: () => void }) {
  const markRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        if (markRef.current)
          markRef.current.style.transform = `translate3d(${x * -24}px, ${y * -16}px, 0) rotateX(${y * 6}deg) rotateY(${x * -8}deg)`;
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("pointermove", onMove); };
  }, []);

  return (
    <section className="relative isolate overflow-hidden">
      <GridField />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--background)_85%)]" />

      <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
        <Logo className="text-2xl" />
        <nav aria-label="Studio navigation" className="flex items-center gap-3 text-sm text-muted-foreground md:gap-6">
          <a href="#pillars" className="hidden transition-colors hover:text-foreground sm:inline">Studio</a>
          <a href="#work" className="hidden transition-colors hover:text-foreground sm:inline">Work</a>
          <Link href="/login" className="label-mono transition-colors hover:text-primary">Control ↗</Link>
          <Button onClick={onContact} className="rounded-full">
            Contact
          </Button>
        </nav>
      </header>

      <div className="relative z-10 grid min-h-[min(780px,calc(90svh-88px))] grid-rows-[1fr_auto] px-6 md:px-12">
        <div className="flex flex-col justify-center [perspective:1200px]">
          <div className="label-mono mb-6 flex items-center gap-3">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" /> Digital Product Studio
          </div>
          <div ref={markRef} className="transition-transform duration-500 ease-out will-change-transform">
            <h1 className="sr-only">V3X</h1>
            <Logo className="w-full max-w-[950px]" />
          </div>
          <p className="mt-8 max-w-3xl text-3xl font-medium leading-tight md:text-5xl lg:text-6xl">
            We turn ideas into <span className="text-gradient-x">digital products.</span>
          </p>
        </div>

        <div className="flex flex-col gap-6 border-t border-border py-8 md:flex-row md:items-end md:justify-between">
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Design, technology and motion, built to move businesses forward.
          </p>
          <div className="label-mono hidden gap-5 xl:flex">
            <span>01 Web</span><span>02 Motion</span><span>03 Systems</span><span>04 Products</span>
          </div>
          <a href="#pillars" className="group inline-flex items-center gap-3 self-start text-lg font-medium">
            Explore the studio
            <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-x text-primary-foreground transition-transform duration-300 group-hover:rotate-45">
              <ArrowDownRight className="h-5 w-5" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
