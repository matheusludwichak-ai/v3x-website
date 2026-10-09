"use client";

import type { PointerEvent, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal, SplitWords } from "./Reveal";
import { Scaled } from "./showcase/Scaled";
import { OrbitDashboard } from "./showcase/OrbitDashboard";
import { PulsePhones } from "./showcase/PulsePhones";
import { MonolithSite } from "./showcase/MonolithSite";
import { MotionVideo } from "./showcase/MotionVideo";
import { cn } from "@/lib/utils";

type CaseInfo = {
  kind: string;
  title: string;
  challenge: string;
  deliver: string[];
  edge: string;
};

const cases: Record<"orbit" | "fold" | "pulse" | "monolith", CaseInfo> = {
  orbit: {
    kind: "Software e dashboards · Conceito",
    title: "Orbit Analytics",
    challenge: "Empresas com dados espalhados em planilhas não enxergam receita, clientes e cancelamentos no mesmo lugar.",
    deliver: ["Painéis gerenciais", "Integração de dados", "Design system", "Aplicação web"],
    edge: "Os quatro indicadores que importam aparecem primeiro. O detalhe vem depois, sem ruído.",
  },
  fold: {
    kind: "Motion design · Peça real da V3X",
    title: "Fold Motion",
    challenge: "Explicar quem é a V3X em um minuto, com a própria marca em movimento.",
    deliver: ["Roteiro", "Animação de marca", "Vídeo de 60 segundos"],
    edge: "O X da marca conduz a narrativa: formação, interseção, expansão e logo final.",
  },
  pulse: {
    kind: "Produto digital · Conceito",
    title: "Pulse App",
    challenge: "Donos de pequenos negócios precisam entender as vendas do dia sem abrir um relatório.",
    deliver: ["App mobile", "Assistente com IA", "MVP", "Design de produto"],
    edge: "Duas telas coerentes: o resumo do dia e um assistente que responde em linguagem simples.",
  },
  monolith: {
    kind: "Web design e desenvolvimento · Conceito",
    title: "Monolith Site",
    challenge: "Um estúdio de arquitetura precisa transmitir permanência e qualidade antes do primeiro contato.",
    deliver: ["Site institucional", "Direção de arte", "Versão mobile", "Desenvolvimento"],
    edge: "Tipografia expressiva, espaço vazio intencional e uma identidade própria para o cliente.",
  },
};

function track(e: PointerEvent<HTMLElement>) {
  if (e.pointerType !== "mouse") return;
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
  e.currentTarget.style.setProperty("--my", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
}

function reset(e: PointerEvent<HTMLElement>) {
  e.currentTarget.style.setProperty("--mx", "0");
  e.currentTarget.style.setProperty("--my", "0");
}

function CaseText({ info, className }: { info: CaseInfo; className?: string }) {
  return (
    <div className={cn("flex flex-col", className)}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7fb2ff]">{info.kind}</p>
      <h3 className="mt-4 text-3xl font-semibold tracking-[-0.03em] md:text-4xl">{info.title}</h3>
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

function Case({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Reveal className={className}>
      <article className="case h-full" onPointerMove={track} onPointerLeave={reset}>
        {children}
      </article>
    </Reveal>
  );
}

function Veredito() {
  return (
    <Reveal>
      <article className="case grid items-center gap-10 lg:grid-cols-12" onPointerMove={track} onPointerLeave={reset}>
        <div className="lg:col-span-4">
          <span className="inline-flex items-center gap-2.5 border border-white/15 px-3.5 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em]">
            <i className="size-2 rounded-full bg-gradient-x" />
            Projeto real em desenvolvimento
          </span>
          <h3 className="mt-6 text-5xl font-bold tracking-[-0.045em] md:text-6xl">Veredito</h3>
          <p className="mt-4 text-lg leading-relaxed text-foreground/90">
            CRM jurídico para advogados e operações jurídicas, do primeiro contato à assinatura do contrato.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
            <li className="border-t border-border pt-3">Contatos, conversas, documentos e propostas em um só lugar.</li>
            <li className="border-t border-border pt-3">Pipeline com cards por etapa e histórico de cada negociação.</li>
            <li className="border-t border-border pt-3">Interface desenhada para a rotina de escritórios jurídicos.</li>
          </ul>
          <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
            Ainda não lançado. Telas em modo demonstração, com dados fictícios.
          </p>
          <Link href="/projetos/veredito" className="link-underline mt-7 inline-flex items-center gap-2 font-medium">
            Ver o projeto <ArrowUpRight className="size-4" />
          </Link>
        </div>
        <div className="case-stage relative px-5 pb-10 pt-6 sm:px-8 md:px-12 md:pt-12 lg:col-span-8">
          <div className="case-float browser">
            <div className="browser-bar"><i /><i /><i /><u>veredito · demonstração</u></div>
            <Image src="/work/veredito/dashboard.jpg" alt="Veredito, visão geral do CRM com indicadores e funil" width={1800} height={1125} sizes="(min-width: 1024px) 60vw, 100vw" className="h-auto w-full" />
          </div>
          <div className="case-float-b browser -mt-[18%] ml-auto w-[52%]">
            <div className="browser-bar"><i /><i /><i /><u>veredito · pipeline</u></div>
            <Image src="/work/veredito/pipeline.jpg" alt="Veredito, pipeline comercial com cards por etapa" width={1800} height={1125} sizes="(min-width: 1024px) 32vw, 52vw" className="h-auto w-full" />
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export function Works() {
  return (
    <section id="projetos" className="relative px-6 py-28 md:px-12 md:py-40">
      <div className="mb-16 max-w-4xl md:mb-24">
        <span className="eyebrow">Projetos</span>
        <h2 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-[-0.035em] md:text-6xl lg:text-7xl">
          <SplitWords text="Explorações" />
          <SplitWords text="selecionadas." className="text-gradient-x" />
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Um produto real em desenvolvimento e quatro conceitos demonstrativos que mostram como pensamos cada tipo de projeto. Os conceitos não são trabalhos de clientes.
        </p>
      </div>

      <div className="space-y-24 md:space-y-36">
        <Veredito />

        <Case>
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="case-stage px-4 py-6 sm:px-8 sm:py-10 lg:col-span-8">
              <div className="case-float browser">
                <div className="browser-bar"><i /><i /><i /><u>app.orbit.com.br</u></div>
                <Scaled width={1100} height={760}><OrbitDashboard /></Scaled>
              </div>
            </div>
            <CaseText info={cases.orbit} className="lg:col-span-4" />
          </div>
        </Case>

        <div className="grid gap-16 lg:grid-cols-12 lg:gap-8">
          <Case className="lg:col-span-5">
            <div className="case-stage grid place-items-center px-6 py-10 sm:py-14">
              <MotionVideo />
            </div>
            <CaseText info={cases.fold} className="mt-8" />
          </Case>
          <Case className="lg:col-span-7">
            <div className="case-stage px-4 py-8 sm:px-10 sm:py-12">
              <Scaled width={720} height={640}><PulsePhones /></Scaled>
            </div>
            <CaseText info={cases.pulse} className="mt-8 max-w-xl" />
          </Case>
        </div>

        <Case>
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <CaseText info={cases.monolith} className="order-2 lg:order-1 lg:col-span-4" />
            <div className="case-stage order-1 px-4 py-6 sm:px-8 sm:py-10 lg:order-2 lg:col-span-8">
              <Scaled width={1180} height={760}><MonolithSite /></Scaled>
            </div>
          </div>
        </Case>
      </div>
    </section>
  );
}
