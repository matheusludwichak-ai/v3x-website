import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { StatusBadge } from "@/components/status-badge";
import { CtaBand } from "@/components/site/cta-band";
import { projects } from "@/data/projects";
import { getPublicPortfolio } from "@/lib/control/portfolio";

/* Picks up portfolio items approved in the V3X Control. */
export const revalidate = 300;

const CATEGORY: Record<string, string> = { site: "Site", system: "Sistema", app: "Aplicativo", saas: "SaaS", motion: "Motion", other: "Projeto" };

export const metadata: Metadata = {
  title: "Projetos",
  description: "Produto em desenvolvimento, projeto próprio e explorações conceituais da V3X.",
  alternates: { canonical: "https://grupov3x.com.br/projetos" },
};

const concepts = [
  { title: "Orbit Analytics", kind: "Software e dashboards", text: "Painel que reúne receita, clientes e cancelamentos." },
  { title: "Fold Motion", kind: "Motion design", text: "O motion institucional da V3X, em um minuto." },
  { title: "Pulse App", kind: "Produto digital", text: "Resumo de vendas do dia e um assistente com IA." },
  { title: "Monolith Site", kind: "Web design", text: "Site editorial para um estúdio de arquitetura." },
];

export default async function ProjetosPage() {
  const delivered = await getPublicPortfolio();
  return (
    <>
      <PageHero
        eyebrow="Projetos"
        crumb="Projetos"
        title={<>O que construímos, <span className="text-gradient-x">com o status à vista.</span></>}
        lead="Mostramos o que é real: o estágio de cada projeto está sempre indicado, nunca escondido."
      />

      <section className="container-v3x section-y space-y-[clamp(4.5rem,9vw,7rem)]">
        {projects.map((project, i) => (
          <Reveal key={project.slug}>
            <Link href={`/projetos/${project.slug}`} className="case group grid items-center gap-10 lg:grid-cols-12">
              <div className={`case-stage relative p-4 sm:p-8 lg:col-span-7 ${i % 2 ? "lg:order-2" : ""}`}>
                <div className="browser">
                  <div className="browser-bar"><i /><i /><i /><u>{project.name.toLowerCase()}</u></div>
                  <Image
                    src={project.cover}
                    alt={project.gallery[0]?.alt ?? project.name}
                    width={project.gallery[0]?.width ?? 1800}
                    height={project.gallery[0]?.height ?? 1125}
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    className="h-auto w-full transition-transform duration-[1200ms] ease-out group-hover:scale-[1.02]"
                  />
                </div>
              </div>
              <div className={`lg:col-span-5 ${i % 2 ? "lg:order-1" : ""}`}>
                <StatusBadge status={project.status} />
                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-[#7fb2ff]">{project.category}</p>
                <h2 className="mt-4 text-4xl font-semibold tracking-[-0.035em] md:text-5xl">{project.name}</h2>
                <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-muted-foreground">{project.summary}</p>
                <span className="link-underline mt-8 inline-flex items-center gap-2 font-medium">
                  Ver o projeto <ArrowUpRight className="size-4" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </section>

      {delivered.length > 0 && (
        <section className="container-v3x section-y border-t border-border">
          <Reveal>
            <p className="eyebrow">Entregas</p>
            <h2 className="mt-6 max-w-[22ch] text-3xl font-semibold tracking-[-0.03em] md:text-5xl">Projetos entregues pela V3X.</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {delivered.map((item, i) => (
              <Reveal key={item.id} delay={i * 60}>
                <article className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-white/10 bg-[#07080f]">
                  {item.cover_url && (
                    <div className="aspect-[16/10] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.cover_url} alt={`${item.name}, projeto da V3X`} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7fb2ff]">{CATEGORY[item.category] ?? "Projeto"}</p>
                    <h3 className="mt-3 text-xl font-semibold">{item.name}</h3>
                    {item.description && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>}
                    {item.technologies.length > 0 && <p className="mt-4 text-xs text-muted-foreground">{item.technologies.join(" · ")}</p>}
                    {item.public_url && (
                      <a href={item.public_url} target="_blank" rel="noopener noreferrer" className="link-underline mt-auto inline-flex w-fit items-center gap-2 pt-6 text-sm font-medium">
                        Ver o projeto <ArrowUpRight className="size-4" />
                      </a>
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="border-t border-border bg-[#07080f] py-24 md:py-28">
        <div className="container-v3x">
          <Reveal>
            <p className="eyebrow">Explorações conceituais</p>
            <h2 className="mt-6 max-w-[22ch] text-3xl font-semibold tracking-[-0.03em] md:text-5xl">
              Quatro conceitos que mostram como pensamos cada área.
            </h2>
            <p className="mt-4 max-w-[56ch] text-muted-foreground">Demonstrações construídas pela V3X. Não são trabalhos de clientes.</p>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {concepts.map((c, i) => (
              <Reveal key={c.title} delay={i * 80}>
                <Link href="/#projetos" className="group flex h-full flex-col rounded-2xl border border-white/10 p-6 transition-colors hover:border-white/25 hover:bg-white/[0.03]">
                  <span className="text-xs text-muted-foreground">{c.kind}</span>
                  <span className="mt-3 text-xl font-semibold">{c.title}</span>
                  <span className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.text}</span>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-medium">
                    Ver na home <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title="Tem um projeto parecido em mente?" highlight="Vamos conversar." />
    </>
  );
}
