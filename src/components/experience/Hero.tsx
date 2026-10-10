"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { GridField } from "./GridField";
import { HeroMark } from "./HeroMark";
import { SplitReveal } from "./Reveal";
import { Logo } from "@/components/brand/Logo";
import { gsap, useGSAP, EASE, MOTION_OK } from "@/lib/motion";

const SERVICES = [
  { n: "01", slug: "web-design", label: "Web Design" },
  { n: "02", slug: "motion-design", label: "Motion Design" },
  { n: "03", slug: "software", label: "Software e Sistemas" },
  { n: "04", slug: "produtos-digitais", label: "Produtos Digitais" },
];

export function Hero({ onContact }: { onContact: () => void }) {
  const root = useRef<HTMLElement>(null);
  const mark = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const pre = gsap.utils.toArray<HTMLElement>(".hero-pre:not(.split-reveal)", el);
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        gsap.set(pre, { autoAlpha: 0 });
        pre.forEach((p) => p.classList.remove("hero-pre"));

        const intro = gsap.timeline({ defaults: { ease: EASE } });
        intro
          .fromTo(".hero-logo", { autoAlpha: 1, clipPath: "inset(0 100% 0 0)", filter: "blur(6px)" }, { clipPath: "inset(0 0% 0 0)", filter: "blur(0px)", duration: 1.3 }, 0.05)
          .fromTo(".hero-eyebrow", { autoAlpha: 1 }, { duration: 1.1, scrambleText: { text: "Digital Product Studio", chars: "V3X01", speed: 0.6, revealDelay: 0.15 } }, 0.3)
          .fromTo(".hero-lead", { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 1.1 }, 0.75)
          .fromTo(".hero-cta", { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.08 }, 0.85)
          .fromTo(".hero-index > *", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.06 }, 1.05)
          .fromTo(".hm-back", { x: 140, y: -110, autoAlpha: 0 }, { x: 0, y: 0, autoAlpha: 1, duration: 1.6 }, 0.15)
          .fromTo(".hm-front", { x: -140, y: -110, autoAlpha: 0 }, { x: 0, y: 0, autoAlpha: 1, duration: 1.6 }, 0.28)
          .fromTo(".hm-outline polygon", { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.2, ease: "power2.inOut", stagger: 0.2 }, 0.6)
          .fromTo(".hm-glow, .hm-ticks", { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.6 }, 0.6)
          .fromTo(".hero-mark-wrap", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, 0);

        gsap.to(".hero-float", { y: -12, duration: 3.6, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.8 });

        // Leaving the hero: the text recedes while the X grows and turns, handing over to the next section.
        const exit = gsap.timeline({ scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.6 } });
        exit
          .to(".hero-copy", { y: -110, autoAlpha: 0.1, ease: "none" }, 0)
          .to(".hero-mark-wrap", { yPercent: 28, scale: 1.22, rotate: -9, autoAlpha: 0.25, ease: "none" }, 0)
          .to(".hero-index", { y: -40, autoAlpha: 0, ease: "none" }, 0);
      });

      // Pointer depth on the X layers (desktop pointers only).
      mm.add(`${MOTION_OK} and (pointer: fine)`, () => {
        const m = mark.current;
        if (!m) return;
        const layers = gsap.utils.toArray<HTMLElement>("[data-depth]", m);
        const movers = layers.map((l) => ({
          depth: Number(l.dataset.depth),
          x: gsap.quickTo(l, "x", { duration: 1.2, ease: "power3.out" }),
          y: gsap.quickTo(l, "y", { duration: 1.2, ease: "power3.out" }),
        }));
        const rotY = gsap.quickTo(m, "rotationY", { duration: 1.2, ease: "power3.out" });
        const rotX = gsap.quickTo(m, "rotationX", { duration: 1.2, ease: "power3.out" });
        gsap.set(m, { transformPerspective: 1200 });
        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          movers.forEach((mv) => {
            mv.x(nx * 22 * mv.depth);
            mv.y(ny * 16 * mv.depth);
          });
          rotY(nx * 14);
          rotX(ny * -10);
        };
        el.addEventListener("pointermove", onMove);
        return () => el.removeEventListener("pointermove", onMove);
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="hero-glow relative isolate flex min-h-[100dvh] flex-col overflow-hidden">
      <GridField />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_55%,transparent_20%,var(--background)_80%)]" />

      <div className="hero-inner container-v3x relative z-10 grid flex-1 items-center gap-10 pb-10 pt-28 lg:grid-cols-12 lg:gap-6 lg:pb-12 lg:pt-32">
        <div className="hero-copy lg:col-span-7">
          <Logo className="hero-logo hero-pre w-[210px] sm:w-[250px] lg:w-[300px]" />
          <p aria-label="Digital Product Studio" className="hero-eyebrow hero-pre mt-4 whitespace-nowrap text-[0.7rem] font-semibold uppercase tracking-[0.42em] text-foreground/85 sm:text-xs">
            Digital Product Studio
          </p>

          <SplitReveal as="h1" immediate delay={0.4} className="hero-pre t-display mt-9 max-w-[17ch] font-semibold lg:mt-11">
            Criamos <span className="text-gradient-x">produtos digitais</span> que fazem empresas avançarem.
          </SplitReveal>

          <p className="hero-lead hero-pre t-lead mt-6 max-w-[34rem] text-muted-foreground">
            Estratégia, design e tecnologia no mesmo time: sites, sistemas e produtos que resolvem problemas reais.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-5">
            <button type="button" onClick={onContact} data-magnetic="0.25" data-track="cta_click" data-track-cta-name="abrir_formulario" data-track-area="hero" className="hero-cta hero-pre btn-primary btn-island">
              Começar um projeto
              <span className="btn-island-icon"><ArrowUpRight className="size-4" /></span>
            </button>
            <a href="#servicos" data-track="cta_click" data-track-cta-name="explorar_servicos" data-track-area="hero" className="hero-cta hero-pre link-underline text-base font-medium text-foreground">
              Explorar os serviços
            </a>
          </div>
        </div>

        <div aria-hidden className="pointer-events-none relative mx-auto w-[82%] max-w-[420px] lg:col-span-5 lg:w-full lg:max-w-none">
          <div className="hero-mark-wrap hero-pre">
            <div className="hero-float lg:w-[112%]">
              <HeroMark ref={mark} />
            </div>
          </div>
        </div>
      </div>

      <nav aria-label="Áreas de atuação" className="container-v3x relative z-10 hidden pb-8 lg:block">
        <ul className="hero-index grid grid-cols-4 border-t border-white/10">
          {SERVICES.map((s) => (
            <li key={s.slug} className="hero-pre">
              <Link href={`/servicos/${s.slug}`} className="group flex items-center justify-between gap-3 py-4 pr-6 text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground">
                <span>
                  <span className="mr-3 text-xs font-semibold tracking-[0.18em] text-[#7fb2ff]">{s.n}</span>
                  {s.label}
                </span>
                <ArrowUpRight className="size-4 -translate-x-1 opacity-0 transition-[transform,opacity] duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
