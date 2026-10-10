"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SplitReveal } from "./Reveal";
import { areaImages } from "@/data/areas";
import { cn } from "@/lib/utils";
import { gsap, ScrollTrigger, useGSAP, EASE, MOTION_OK } from "@/lib/motion";

const pillars = [
  { n: "01", slug: "web-design", title: "Web Design e Desenvolvimento", body: "Landing pages, sites institucionais e experiências web com execução técnica.", services: ["Landing pages", "Sites institucionais", "Redesign"] },
  { n: "02", slug: "motion-design", title: "Motion Design", body: "Animação de marcas e produtos, peças para campanhas e vídeos de 15 a 60 segundos.", services: ["Motion publicitário", "Animação 2D e 3D", "Vídeos curtos"] },
  { n: "03", slug: "software", title: "Software e Sistemas", body: "CRMs, dashboards e sistemas sob medida para organizar processos e centralizar informações.", services: ["CRMs", "Dashboards", "Sistemas internos"] },
  { n: "04", slug: "produtos-digitais", title: "Produtos Digitais", body: "SaaS, MVPs e plataformas, da concepção ao lançamento, com espaço para evoluir.", services: ["SaaS", "MVPs", "Aplicações web"] },
] as const;

type Slug = (typeof pillars)[number]["slug"];

/* Small animated interface fragments that show the nature of each service (decorative). */
function WebFragment() {
  return (
    <div className="frag-web">
      <div className="frag-web-cols">{Array.from({ length: 6 }, (_, i) => <i key={i} style={{ "--i": i } as React.CSSProperties} />)}</div>
      <div className="frag-web-blocks"><b /><b /><b /></div>
      <span className="frag-caption">Grade, hierarquia e responsividade</span>
    </div>
  );
}

function MotionFragment() {
  return (
    <div className="frag-motion">
      <div className="frag-motion-track">
        {[8, 30, 52, 74, 92].map((p) => <i key={p} style={{ left: `${p}%` }} />)}
        <u />
      </div>
      <div className="frag-motion-curve">
        <svg viewBox="0 0 400 44"><path pathLength={1} d="M4 40 C 130 40, 150 4, 396 4" /></svg>
      </div>
      <span className="frag-caption">Keyframes, curvas e ritmo</span>
    </div>
  );
}

function SoftwareFragment() {
  return (
    <div className="frag-soft">
      {["Entrada", "Proposta", "Fechado"].map((c, i) => (
        <div key={c} className="frag-soft-col">
          <span>{c}</span>
          <b />
          {i === 0 && <b className="frag-soft-moving" />}
          {i !== 1 && <b />}
        </div>
      ))}
      <span className="frag-caption">Processos organizados em um só lugar</span>
    </div>
  );
}

function ProductFragment() {
  return (
    <div className="frag-prod">
      <div className="frag-prod-steps">
        {["Ideia", "MVP", "Lançamento", "Evolução"].map((s) => <span key={s}>{s}</span>)}
        <i />
      </div>
      <span className="frag-caption">Da concepção ao produto em uso</span>
    </div>
  );
}

/** Short loop from the real V3X motion piece (the X forming), shown in the Motion Design box. */
function MotionClip({ className }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting) video.play().catch(() => undefined);
      else video.pause();
    });
    io.observe(video);
    return () => io.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      className={className}
      src="/work/areas/motion-x.mp4"
      poster="/work/areas/motion-x.jpg"
      muted
      loop
      playsInline
      preload="metadata"
      aria-label="Trecho do vídeo institucional da V3X: o X da marca se formando"
    />
  );
}

const FRAGMENTS: Record<Slug, () => React.JSX.Element> = {
  "web-design": WebFragment,
  "motion-design": MotionFragment,
  software: SoftwareFragment,
  "produtos-digitais": ProductFragment,
};

export function Pillars() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const hovering = useRef(false);

  useGSAP(
    () => {
      const rows = gsap.utils.toArray<HTMLElement>(".svc-row", root.current);
      // Scroll position chooses the highlighted service on large screens; hover and focus override it.
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        rows.forEach((row, i) =>
          ScrollTrigger.create({
            trigger: row,
            start: "top 58%",
            end: "bottom 58%",
            onToggle: (self) => {
              if (self.isActive && !hovering.current) setActive(i);
            },
          }),
        );
      });
      mm.add(MOTION_OK, () => {
        gsap.from(".svc-row", {
          y: 40,
          autoAlpha: 0,
          duration: 1.1,
          ease: EASE,
          stagger: 0.1,
          scrollTrigger: { trigger: ".svc-list", start: "top 80%", once: true },
        });
        gsap.fromTo(".svc-stage", { clipPath: "inset(14% 10% 14% 10% round 28px)" }, {
          clipPath: "inset(0% 0% 0% 0% round 28px)",
          ease: "none",
          scrollTrigger: { trigger: ".svc-list", start: "top 85%", end: "top 30%", scrub: 0.6 },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const choose = (i: number) => {
    hovering.current = true;
    setActive(i);
  };

  return (
    <section ref={root} id="servicos" className="container-v3x section-y relative">
      <div className="mb-12 grid gap-6 md:mb-16 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <span className="eyebrow">O que fazemos</span>
          <SplitReveal className="t-h2 mt-6 font-semibold">
            Quatro áreas de atuação, <span className="text-gradient-x">um só padrão de qualidade.</span>
          </SplitReveal>
        </div>
        <p className="t-lead max-w-md text-muted-foreground lg:col-span-5 lg:justify-self-end">
          Passe o cursor ou role pela lista para ver como cada área funciona. Cada uma leva à página completa do serviço.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <ol className="svc-list relative lg:col-span-7" onPointerLeave={() => (hovering.current = false)}>
          <span aria-hidden className="svc-rail" style={{ "--progress": (active + 1) / pillars.length } as React.CSSProperties} />
          {pillars.map(({ n, slug, title, body, services }, i) => {
            const img = areaImages[slug];
            const Fragment = FRAGMENTS[slug];
            return (
              <li key={slug} className="svc-row" data-active={active === i || undefined}>
                <Link
                  href={`/servicos/${slug}`}
                  data-cursor="Ver serviço"
                  onPointerEnter={() => choose(i)}
                  onFocus={() => choose(i)}
                  className="svc-link group grid gap-5 py-8 pl-6 md:py-9 lg:pl-10"
                >
                  <div className="flex items-start gap-5 md:gap-8">
                    <span className="svc-num mt-2 text-xs font-semibold tracking-[0.18em] text-[#7fb2ff]">{n}</span>
                    <div className="min-w-0 flex-1">
                      <h3 className="svc-title t-h3 font-medium">{title}</h3>
                      <div className="svc-more">
                        <div>
                          <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">{body}</p>
                          <ul className="mt-5 flex flex-wrap gap-2">
                            {services.map((s) => (
                              <li key={s} className="rounded-full border border-white/12 px-3 py-1 text-xs text-foreground/85">{s}</li>
                            ))}
                          </ul>
                          <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground/90">
                            Ver serviço <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                    <ArrowUpRight aria-hidden className="svc-arrow mt-2 hidden size-6 shrink-0 md:block" />
                  </div>

                  {img && (
                    <div className="case-stage relative overflow-hidden lg:hidden">
                      <div className="overflow-hidden">{slug === "motion-design" ? <MotionClip className="aspect-[4/3] w-full object-cover" /> : <Image src={img.src} alt={img.alt} width={img.width} height={img.height} sizes="100vw" className="aspect-[4/3] w-full object-cover" />}</div>
                      <div className="frag-panel"><Fragment /></div>
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ol>

        <div aria-hidden className="relative hidden lg:col-span-5 lg:block">
          <div className="sticky top-24">
            <div className="svc-stage-wrap" data-tilt="4">
              <div className="svc-stage case-stage relative aspect-[4/5] overflow-hidden">
                {pillars.map(({ slug }, i) => {
                  const img = areaImages[slug];
                  const Fragment = FRAGMENTS[slug];
                  return (
                    <div key={slug} className={cn("svc-slide absolute inset-0 flex flex-col", active === i && "is-active")}>
                      <div className="relative min-h-0 flex-1 overflow-hidden">
                        {slug === "motion-design" ? <MotionClip className="svc-slide-img h-full w-full object-cover" /> : img && <Image src={img.src} alt="" width={img.width} height={img.height} sizes="(min-width: 1024px) 460px, 0px" className="svc-slide-img h-full w-full object-cover" />}
                      </div>
                      <div className="frag-panel"><Fragment /></div>
                    </div>
                  );
                })}
                <div className="svc-counter">
                  <span>{pillars[active].n}</span>
                  <span className="opacity-40"> / 04</span>
                </div>
                <span className="tilt-light" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
