"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal, SplitWords } from "./Reveal";
import { areaImages } from "@/data/areas";

const pillars = [
  { n: "01", slug: "web-design", title: "Web Design e Desenvolvimento", body: "Landing pages, sites institucionais e experiências web com execução técnica.", services: ["Landing pages", "Sites institucionais", "Redesign"] },
  { n: "02", slug: "motion-design", title: "Motion Design", body: "Animação de marcas e produtos, peças para campanhas e vídeos de 15 a 60 segundos.", services: ["Motion publicitário", "Animação 2D e 3D", "Vídeos curtos"] },
  { n: "03", slug: "software", title: "Software e Sistemas", body: "CRMs, dashboards e sistemas sob medida para organizar processos e centralizar informações.", services: ["CRMs", "Dashboards", "Sistemas internos"] },
  { n: "04", slug: "produtos-digitais", title: "Produtos Digitais", body: "SaaS, MVPs e plataformas, da concepção ao lançamento, com espaço para evoluir.", services: ["SaaS", "MVPs", "Aplicações web"] },
] as const;

export function Pillars() {
  return (
    <section id="servicos" className="container-v3x section-y relative">
      <div className="mb-12 max-w-3xl md:mb-16">
        <span className="eyebrow">O que fazemos</span>
        <h2 className="t-h2 mt-6 font-semibold">
          <SplitWords text="Quatro áreas de atuação," />
          <SplitWords text="um só padrão de qualidade." className="text-gradient-x" />
        </h2>
      </div>

      <div className="border-t border-border">
        {pillars.map(({ n, slug, title, body, services }, i) => {
          const img = areaImages[slug];
          return (
            <Reveal key={n} delay={i * 80}>
              <Link
                href={`/servicos/${slug}`}
                className="group relative grid items-center gap-6 border-b border-border py-9 transition-colors duration-500 hover:bg-white/[0.025] md:grid-cols-12 md:gap-8 md:py-10"
              >
                <span className="text-xs font-semibold tracking-[0.18em] text-[#7fb2ff] md:col-span-1 md:self-start md:pt-3">{n}</span>
                <div className="md:col-span-6">
                  <h3 className="t-h3 font-medium transition-transform duration-500 group-hover:translate-x-2">
                    {title}
                  </h3>
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
                {img && (
                  <div className="md:col-span-5 md:flex md:justify-end">
                    <div className="case-stage w-full overflow-hidden md:max-w-[300px]">
                      <Image
                        src={img.src}
                        alt={img.alt}
                        width={img.width}
                        height={img.height}
                        sizes="(min-width: 768px) 300px, 100vw"
                        className="aspect-[4/3] w-full object-cover opacity-80 transition-[transform,opacity] duration-700 ease-out group-hover:scale-[1.05] group-hover:opacity-100 md:aspect-square"
                      />
                    </div>
                  </div>
                )}
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
