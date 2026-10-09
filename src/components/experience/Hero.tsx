"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { GridField } from "./GridField";
import { Logo } from "@/components/brand/Logo";
import { XMark } from "@/components/brand/XMark";

const nav = [
  { href: "#servicos", label: "Serviços" },
  { href: "#projetos", label: "Projetos" },
  { href: "#fundadores", label: "Fundadores" },
];

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

      <header className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12">
        <a href="#" aria-label="V3X, início" className="block w-11 transition-transform duration-300 hover:-rotate-6">
          <XMark className="block h-auto w-full" />
        </a>
        <nav aria-label="Navegação principal" className="flex items-center gap-2 text-sm md:gap-8">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="nav-link hidden text-muted-foreground transition-colors hover:text-foreground md:inline">
              {item.label}
            </a>
          ))}
          <Link href="/login" className="nav-link hidden text-muted-foreground transition-colors hover:text-foreground sm:inline">
            Control
          </Link>
          <button
            type="button"
            onClick={onContact}
            className="ml-2 rounded-full border border-white/25 px-4 py-2 text-sm font-medium transition-colors duration-300 hover:border-white hover:bg-white hover:text-background active:scale-[0.97]"
          >
            Contato
          </button>
        </nav>
      </header>

      <div className="relative z-10 grid flex-1 items-center gap-12 px-6 pb-10 pt-6 md:px-12 lg:grid-cols-12 lg:gap-6 lg:pb-16">
        <div className="lg:col-span-7">
          <div className="hero-in">
            <Logo className="w-[220px] sm:w-[260px] lg:w-[320px]" />
            <p className="mt-4 whitespace-nowrap text-[0.7rem] font-semibold uppercase tracking-[0.42em] text-foreground/85 sm:text-xs">
              Digital Product Studio
            </p>
          </div>

          <h1 className="hero-in hero-in-2 mt-10 max-w-3xl text-balance text-[2.5rem] font-semibold leading-[1.04] tracking-[-0.035em] sm:text-5xl lg:mt-14 lg:text-[3.75rem]">
            Criamos <span className="text-gradient-x">produtos digitais</span> que fazem empresas avançarem.
          </h1>

          <p className="hero-in hero-in-3 mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Estratégia, design e tecnologia no mesmo time: sites, sistemas e produtos que resolvem problemas reais.
          </p>

          <div className="hero-in hero-in-4 mt-9 flex flex-wrap items-center gap-x-8 gap-y-5">
            <button
              type="button"
              onClick={onContact}
              className="group inline-flex h-13 items-center gap-3 rounded-full bg-gradient-x px-7 text-base font-semibold text-white shadow-[0_18px_40px_-18px_rgba(56,130,246,0.9)] transition-[transform,filter] duration-300 hover:brightness-110 active:scale-[0.97]"
            >
              Começar um projeto
              <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
            <a href="#servicos" className="link-underline text-base font-medium text-foreground">
              Ver o que fazemos
            </a>
          </div>
        </div>

        <div aria-hidden className="pointer-events-none relative hidden lg:col-span-5 lg:block">
          <div ref={artRef} className="transition-transform duration-700 ease-out will-change-transform">
            <XMark className="hero-x block h-auto w-[118%] max-w-none" />
          </div>
        </div>
      </div>

      <div className="relative z-10 hidden items-end justify-between px-6 pb-8 md:flex md:px-12">
        <a href="https://grupov3x.com.br" className="text-sm tracking-wide text-foreground/90">
          grupov3x.com.br
          <span className="mt-2 block h-[3px] w-full bg-gradient-x" />
        </a>
        <span className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
          Design · Tecnologia · Produtos digitais
        </span>
      </div>
    </section>
  );
}
