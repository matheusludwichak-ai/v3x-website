"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { GridField } from "./GridField";
import { Logo } from "@/components/brand/Logo";
import { XMark } from "@/components/brand/XMark";

export function Hero({ onContact }: { onContact: () => void }) {
  const artRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        if (artRef.current) artRef.current.style.transform = `translate3d(${x * -28}px, ${y * -20}px, 0)`;
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <section className="hero-glow relative isolate flex min-h-[100dvh] flex-col overflow-hidden">
      <GridField />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_55%,transparent_20%,var(--background)_80%)]" />


      <div className="container-v3x relative z-10 grid flex-1 items-center gap-12 pb-10 pt-28 lg:grid-cols-12 lg:gap-6 lg:pb-14 lg:pt-32">
        <div className="lg:col-span-7">
          <div className="hero-in">
            <Logo className="w-[220px] sm:w-[260px] lg:w-[320px]" />
            <p className="mt-4 whitespace-nowrap text-[0.7rem] font-semibold uppercase tracking-[0.42em] text-foreground/85 sm:text-xs">
              Digital Product Studio
            </p>
          </div>

          <h1 className="hero-in hero-in-2 t-display mt-9 max-w-[19ch] text-balance font-semibold lg:mt-12">
            Criamos <span className="text-gradient-x">produtos digitais</span> que fazem empresas avançarem.
          </h1>

          <p className="hero-in hero-in-3 t-lead mt-6 max-w-xl text-muted-foreground">
            Estratégia, design e tecnologia no mesmo time: sites, sistemas e produtos que resolvem problemas reais.
          </p>

          <div className="hero-in hero-in-4 mt-9 flex flex-wrap items-center gap-x-8 gap-y-5">
            <button
              type="button"
              onClick={onContact}
              className="btn-primary"
            >
              Começar um projeto
              <ArrowUpRight className="size-5" />
            </button>
            <a href="#servicos" className="link-underline text-base font-medium text-foreground">
              Explorar os serviços
            </a>
          </div>
        </div>

        <div aria-hidden className="pointer-events-none relative hidden lg:col-span-5 lg:block">
          <div ref={artRef} className="transition-transform duration-700 ease-out will-change-transform">
            <div className="scroll-drift"><XMark className="hero-x block h-auto w-[112%] max-w-none" /></div>
          </div>
        </div>
      </div>

      <div className="container-v3x relative z-10 hidden items-end justify-between pb-8 md:flex">
        <a href="#projetos" className="group inline-flex items-center gap-2 text-sm font-medium text-foreground/90 transition-colors hover:text-foreground">
          Conhecer os projetos
          <ArrowUpRight className="size-4 rotate-90 transition-transform duration-300 group-hover:translate-y-0.5" />
        </a>
        <span className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
          Design · Tecnologia · Produtos digitais
        </span>
      </div>
    </section>
  );
}
