"use client";

import { useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SplitReveal } from "./Reveal";
import { Scaled } from "./showcase/Scaled";
import { OrbitDashboard } from "./showcase/OrbitDashboard";
import { PulsePhones } from "./showcase/PulsePhones";
import { MonolithSite } from "./showcase/MonolithSite";
import { MotionVideo } from "./showcase/MotionVideo";
import { cn } from "@/lib/utils";
import { gsap, ScrollTrigger, useGSAP, EASE, MOTION_OK, scrollToTarget } from "@/lib/motion";

type CaseInfo = {
  id: string;
  kind: string;
  title: string;
  challenge: string;
  deliver: string[];
  edge: string;
};

const cases = {
  orbit: {
    id: "case-orbit",
    kind: "Software e dashboards · Conceito",
    title: "Orbit Analytics",
    challenge: "Empresas com dados espalhados em planilhas não enxergam receita, clientes e cancelamentos no mesmo lugar.",
    deliver: ["Painéis gerenciais", "Integração de dados", "Design system", "Aplicação web"],
    edge: "Os quatro indicadores que importam aparecem primeiro. O detalhe vem depois, sem ruído.",
  },
  fold: {
    id: "case-fold",
    kind: "Motion design · Peça real da V3X",
    title: "Fold Motion",
    challenge: "Explicar quem é a V3X em um minuto, com a própria marca em movimento.",
    deliver: ["Roteiro", "Animação de marca", "Vídeo de 60 segundos"],
    edge: "O X da marca conduz a narrativa: formação, interseção, expansão e logo final.",
  },
  pulse: {
    id: "case-pulse",
    kind: "Produto digital · Conceito",
    title: "Pulse App",
    challenge: "Donos de pequenos negócios precisam entender as vendas do dia sem abrir um relatório.",
    deliver: ["App mobile", "Assistente com IA", "MVP", "Design de produto"],
    edge: "Duas telas coerentes: o resumo do dia e um assistente que responde em linguagem simples.",
  },
  monolith: {
    id: "case-monolith",
    kind: "Web design e desenvolvimento · Conceito",
    title: "Monolith Site",
    challenge: "Um estúdio de arquitetura precisa transmitir permanência e qualidade antes do primeiro contato.",
    deliver: ["Site institucional", "Direção de arte", "Versão mobile", "Desenvolvimento"],
    edge: "Tipografia expressiva, espaço vazio intencional e uma identidade própria para o cliente.",
  },
} satisfies Record<string, CaseInfo>;

const INDEX = [
  { id: "case-veredito", label: "Veredito" },
  { id: cases.orbit.id, label: "Orbit" },
  { id: cases.fold.id, label: "Fold Motion" },
  { id: cases.pulse.id, label: "Pulse" },
  { id: cases.monolith.id, label: "Monolith" },
];

function CaseText({ info, n, className }: { info: CaseInfo; n: string; className?: string }) {
  return (
    <div className={cn("case-text flex flex-col", className)}>
      <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#7fb2ff]">
        <span className="text-foreground/40">{n}</span>
        {info.kind}
      </p>
      <h3 className="t-h3 mt-4 font-semibold">{info.title}</h3>
      <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">{info.challenge}</p>
      <ul className="mt-6 flex flex-wrap gap-2" aria-label="O que a V3X entrega">
        {info.deliver.map((d) => (
          <li key={d} className="rounded-full border border-white/12 px-3 py-1.5 text-xs text-foreground/90">{d}</li>
        ))}
      </ul>
      <p className="mt-6 border-t border-border pt-5 text-sm leading-relaxed text-foreground/85">{info.edge}</p>
    </div>
  );
}

/** Stage frame: scroll motion lives on the outer element, pointer tilt on the inner one, so they never fight. */
function Stage({ outer, tilt = 3, className, children, tag }: { outer: string; tilt?: number; className?: string; children: ReactNode; tag?: string }) {
  return (
    <div className={outer}>
      <div data-tilt={tilt} className={cn("case-stage", className)}>
        {children}
        {tag && <span className="stage-tag">{tag}</span>}
        <span aria-hidden className="tilt-light" />
      </div>
    </div>
  );
}

function ProjectIndex({ current, visible }: { current: number; visible: boolean }) {
  return (
    <nav aria-label="Projetos desta seção" className={cn("project-index", visible && "is-visible")}>
      <span className="project-index-count" aria-hidden>
        {String(current + 1).padStart(2, "0")}
        <span className="opacity-40"> / {String(INDEX.length).padStart(2, "0")}</span>
      </span>
      <ol className="flex items-center gap-1">
        {INDEX.map((item, i) => (
          <li key={item.id}>
            <button
              type="button"
              aria-current={current === i ? "true" : undefined}
              onClick={() => scrollToTarget(document.getElementById(item.id), -90)}
              className={cn("project-index-item", current === i && "is-current")}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function Works() {
  const root = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState(0);
  const [indexVisible, setIndexVisible] = useState(false);

  useGSAP(
    () => {
      const el = root.current!;
      INDEX.forEach((item, i) => {
        ScrollTrigger.create({
          trigger: `#${item.id}`,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && setCurrent(i),
        });
      });
      ScrollTrigger.create({
        trigger: ".works-cases",
        start: "top 70%",
        end: "bottom 60%",
        onToggle: (self) => setIndexVisible(self.isActive),
      });

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const scrub = (trigger: string, start = "top bottom", end = "bottom top") => ({ trigger, start, end, scrub: 0.7 });

        // Case texts: details arrive in sequence.
        gsap.utils.toArray<HTMLElement>(".case-text", el).forEach((t) =>
          gsap.from(t.children, { y: 26, autoAlpha: 0, duration: 1, ease: EASE, stagger: 0.07, scrollTrigger: { trigger: t, start: "top 82%", once: true } }),
        );

        // Veredito: the screens land flat from a tilted plane, the pipeline rises faster than the dashboard.
        gsap.fromTo(".vd-scroll", { rotateX: 24, scale: 0.9, y: 70, transformPerspective: 1600, transformOrigin: "50% 100%" }, { rotateX: 0, scale: 1, y: 0, ease: "none", scrollTrigger: scrub("#case-veredito", "top bottom", "center 62%") });
        gsap.fromTo(".vd-a", { y: 40 }, { y: -10, ease: "none", scrollTrigger: scrub("#case-veredito") });
        gsap.fromTo(".vd-b", { y: 150 }, { y: -40, ease: "none", scrollTrigger: scrub("#case-veredito") });

        // Orbit: the frame opens up from a cropped view, then the interface fills in.
        gsap.fromTo(".orbit-scroll", { clipPath: "inset(9% 7% 9% 7% round 28px)" }, { clipPath: "inset(0% 0% 0% 0% round 28px)", ease: "none", scrollTrigger: scrub("#case-orbit", "top bottom", "center 60%") });
        gsap.fromTo(".orbit-zoom", { scale: 1.12 }, { scale: 1, ease: "none", scrollTrigger: scrub("#case-orbit", "top bottom", "center 60%") });
        const orbit = gsap.timeline({ scrollTrigger: { trigger: "#case-orbit", start: "top 55%", once: true }, defaults: { ease: EASE } });
        orbit
          .from(".orbit-kpi", { y: 22, autoAlpha: 0, duration: 0.9, stagger: 0.08 })
          .fromTo(".orbit-line", { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut" }, 0.2)
          .from(".orbit-area", { autoAlpha: 0, duration: 1.2 }, 0.8)
          .from(".orbit-dot", { scale: 0, transformOrigin: "50% 50%", duration: 0.6, ease: "back.out(3)" }, 1.6)
          .from(".orbit-bar", { scaleX: 0, duration: 1.1, stagger: 0.08 }, 0.4)
          .from(".orbit-row", { autoAlpha: 0, x: -14, duration: 0.7, stagger: 0.06 }, 0.7);

        // Fold Motion: the phone rises and straightens.
        gsap.fromTo(".fold-scroll", { y: 110, rotate: -7 }, { y: 0, rotate: 0, ease: "none", scrollTrigger: scrub("#case-fold", "top bottom", "center 55%") });

        // Pulse: the two screens travel at different speeds.
        gsap.fromTo(".pulse-a", { y: 70 }, { y: -30, ease: "none", scrollTrigger: scrub("#case-pulse") });
        gsap.fromTo(".pulse-b", { y: -30 }, { y: 70, ease: "none", scrollTrigger: scrub("#case-pulse") });

        // Monolith: an editorial curtain opens left to right, the phone slides in last.
        gsap.fromTo(".mono-scroll", { clipPath: "inset(0% 48% 0% 0% round 28px)" }, { clipPath: "inset(0% 0% 0% 0% round 28px)", ease: "none", scrollTrigger: scrub("#case-monolith", "top 92%", "center 58%") });
        gsap.fromTo(".mono-desk", { x: -50 }, { x: 0, ease: "none", scrollTrigger: scrub("#case-monolith", "top bottom", "center 58%") });
        gsap.fromTo(".mono-phone", { x: 140, y: 60, autoAlpha: 0 }, { x: 0, y: 0, autoAlpha: 1, ease: "none", scrollTrigger: scrub("#case-monolith", "top 70%", "center 55%") });
        gsap.fromTo(".mono-title", { yPercent: 30, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, ease: "none", scrollTrigger: scrub("#case-monolith", "top 75%", "center 60%") });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="projetos" className="container-v3x section-y relative">
      <div className="mb-14 grid gap-6 md:mb-20 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <span className="eyebrow">Projetos</span>
          <SplitReveal className="t-h2 mt-6 font-semibold">
            Explorações <span className="text-gradient-x">selecionadas.</span>
          </SplitReveal>
        </div>
        <p className="t-lead max-w-md text-muted-foreground lg:col-span-5 lg:justify-self-end">
          Um produto real em desenvolvimento e quatro conceitos que mostram como pensamos cada tipo de projeto. Os conceitos não são trabalhos de clientes.
        </p>
      </div>

      <ProjectIndex current={current} visible={indexVisible} />

      <div className="works-cases space-y-[clamp(5rem,10vw,9rem)]">
        {/* Veredito: real product */}
        <article id="case-veredito" className="grid items-center gap-10 lg:grid-cols-12">
          <div className="case-text lg:col-span-4">
            <span className="inline-flex w-fit items-center gap-2.5 rounded-full border border-white/15 px-3.5 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em]">
              <i className="size-2 rounded-full bg-gradient-x" />
              Projeto real em desenvolvimento
            </span>
            <h3 className="t-h2 mt-6 font-bold">Veredito</h3>
            <p className="mt-4 text-lg leading-relaxed text-foreground/90">
              CRM jurídico para advogados e operações jurídicas, do primeiro contato à assinatura do contrato.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              <li className="border-t border-border pt-3">Contatos, conversas, documentos e propostas em um só lugar.</li>
              <li className="border-t border-border pt-3">Pipeline com cards por etapa e histórico de cada negociação.</li>
              <li className="border-t border-border pt-3">Interface desenhada para a rotina de escritórios jurídicos.</li>
            </ul>
            <p className="mt-6 text-xs leading-relaxed text-muted-foreground">Ainda não lançado. Telas em modo demonstração, com dados fictícios.</p>
            <Link href="/projetos/veredito" className="link-underline mt-7 inline-flex w-fit items-center gap-2 font-medium">
              Ver o projeto <ArrowUpRight className="size-4" />
            </Link>
          </div>
          <Link href="/projetos/veredito" data-cursor="Ver projeto" aria-label="Ver o projeto Veredito" className="block lg:col-span-8">
            <Stage outer="vd-scroll" className="vd-stage px-5 pb-10 pt-6 sm:px-8 md:px-12 md:pt-12" tag="Demonstração">
              <div className="vd-a">
                <div className="vd-a-inner browser">
                  <div className="browser-bar"><i /><i /><i /><u>veredito · demonstração</u></div>
                  <Image src="/work/veredito/dashboard.jpg" alt="Veredito, visão geral do CRM com indicadores e funil" width={1800} height={1125} sizes="(min-width: 1024px) 60vw, 100vw" className="h-auto w-full" />
                </div>
              </div>
              <div className="vd-b relative z-10 -mt-[18%] ml-auto w-[52%]">
                <div className="vd-b-inner browser">
                  <div className="browser-bar"><i /><i /><i /><u>veredito · pipeline</u></div>
                  <Image src="/work/veredito/pipeline.jpg" alt="Veredito, pipeline comercial com cards por etapa" width={1800} height={1125} sizes="(min-width: 1024px) 32vw, 52vw" className="h-auto w-full" />
                </div>
              </div>
            </Stage>
          </Link>
        </article>

        {/* Orbit: wide analytic interface */}
        <article id="case-orbit" className="grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Stage outer="orbit-scroll" tilt={2.5} className="orbit-stage px-4 py-6 sm:px-8 sm:py-10" tag="Conceito · dados fictícios">
              <div className="orbit-zoom">
                <div className="browser">
                  <div className="browser-bar"><i /><i /><i /><u>app.orbit.com.br</u></div>
                  <Scaled width={1100} height={760}><OrbitDashboard /></Scaled>
                </div>
              </div>
            </Stage>
          </div>
          <CaseText info={cases.orbit} n="02" className="lg:col-span-4" />
        </article>

        {/* Fold Motion + Pulse: asymmetric pair */}
        <div className="grid gap-[clamp(5rem,10vw,9rem)] lg:grid-cols-12 lg:gap-8">
          <article id="case-fold" className="lg:col-span-5">
            <Stage outer="fold-scroll" tilt={4} className="fold-stage grid place-items-center px-6 py-10 sm:py-14" tag="Vídeo real">
              <MotionVideo />
            </Stage>
            <CaseText info={cases.fold} n="03" className="mt-8" />
          </article>
          <article id="case-pulse" className="lg:col-span-7 lg:pt-28">
            <Stage outer="pulse-scroll" tilt={4} className="pulse-stage px-4 py-8 sm:px-10 sm:py-12" tag="Conceito">
              <Scaled width={720} height={640}><PulsePhones /></Scaled>
            </Stage>
            <CaseText info={cases.pulse} n="04" className="mt-8 max-w-xl" />
          </article>
        </div>

        {/* Monolith: editorial */}
        <article id="case-monolith" className="grid items-center gap-10 lg:grid-cols-12">
          <CaseText info={cases.monolith} n="05" className="order-2 lg:order-1 lg:col-span-4" />
          <div className="order-1 lg:order-2 lg:col-span-8">
            <Stage outer="mono-scroll" tilt={2.5} className="mono-stage px-4 py-6 sm:px-8 sm:py-10" tag="Conceito">
              <Scaled width={1180} height={760}><MonolithSite /></Scaled>
            </Stage>
          </div>
        </article>
      </div>
    </section>
  );
}
