import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Plus } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { CtaBand } from "@/components/site/cta-band";
import { getService, services } from "@/data/services";
import { areaImages } from "@/data/areas";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: service.name,
    description: service.short,
    alternates: { canonical: `https://grupov3x.com.br/servicos/${slug}` },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  const img = areaImages[service.slug];
  const others = services.filter((s) => s.slug !== service.slug);

  return (
    <>
      <PageHero eyebrow={`Serviço ${service.number} · ${service.name}`} crumb={service.name} title={service.heroLine}>
        <p className="hero-in hero-in-2 mt-6 max-w-[60ch] text-lg leading-relaxed text-muted-foreground">{service.description}</p>
        <div className="hero-in hero-in-3 mt-9 flex flex-wrap gap-4">
          <Link href="/contato" className="btn-primary">
            Começar um projeto <ArrowUpRight className="size-5" />
          </Link>
          <Link href="/servicos" className="btn-outline">
            Todos os serviços
          </Link>
        </div>
      </PageHero>

      <section className="mx-auto grid max-w-[1280px] items-center gap-14 px-6 py-24 md:px-12 md:py-32 lg:grid-cols-12">
        {img && (
          <Reveal className="lg:col-span-6">
            <div className="case-stage overflow-hidden">
              <Image src={img.src} alt={img.alt} width={img.width} height={img.height} sizes="(min-width: 1024px) 45vw, 100vw" className="h-auto w-full" />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Conceito demonstrativo, não é trabalho de cliente.</p>
          </Reveal>
        )}
        <div className="space-y-14 lg:col-span-6 lg:pl-6">
          <Reveal>
            <p className="eyebrow">Quando faz sentido</p>
            <ul className="mt-6">
              {service.problems.map((p) => (
                <li key={p} className="flex gap-4 border-t border-border py-4 text-[15px] leading-relaxed text-foreground/85">
                  <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-gradient-x" />
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={100}>
            <p className="eyebrow">O que entregamos</p>
            <ul className="mt-6 flex flex-wrap gap-2.5">
              {service.scope.map((s) => (
                <li key={s} className="rounded-2xl border border-white/12 bg-white/[0.03] px-4 py-2.5 text-sm text-foreground/90">
                  {s}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-border bg-[#07080f] py-24 md:py-32">
        <div className="mx-auto max-w-[1280px] px-6 md:px-12">
          <Reveal>
            <p className="eyebrow">Como trabalhamos</p>
            <h2 className="mt-6 max-w-[20ch] text-4xl font-semibold leading-[1.05] tracking-[-0.035em] md:text-5xl">
              Um processo simples, <span className="text-gradient-x">sem burocracia.</span>
            </h2>
          </Reveal>
          <div className="relative mt-16">
            <span aria-hidden className="absolute left-0 right-0 top-[7px] hidden h-[2px] bg-gradient-x opacity-60 lg:block" />
            <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[repeat(var(--steps),minmax(0,1fr))]" style={{ "--steps": service.process.length } as CSSProperties}>
              {service.process.map((step, i) => (
                <Reveal as="li" key={step.title} delay={i * 90}>
                  <span aria-hidden className="relative block size-4 rounded-full border-[3px] border-[#3882F6] bg-[#07080f]" />
                  <p className="mt-6 text-5xl font-bold tracking-[-0.05em] text-foreground/15">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight">{step.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{step.body}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {service.faq.length > 0 && (
        <section className="mx-auto max-w-[1280px] px-6 py-24 md:px-12 md:py-32">
          <div className="grid gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-4">
              <p className="eyebrow">Perguntas frequentes</p>
              <h2 className="mt-6 text-3xl font-semibold tracking-[-0.03em] md:text-4xl">Antes de começar</h2>
            </Reveal>
            <div className="lg:col-span-8">
              {service.faq.map((item) => (
                <details key={item.q} className="group border-t border-border py-6 last:border-b">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium marker:hidden">
                    {item.q}
                    <Plus className="size-5 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-45" />
                  </summary>
                  <p className="mt-4 max-w-[62ch] text-[15px] leading-relaxed text-muted-foreground">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-[1280px] px-6 pb-24 md:px-12">
        <p className="eyebrow">Outras áreas</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {others.map((s) => (
            <Link key={s.slug} href={`/servicos/${s.slug}`} className="group flex items-center justify-between rounded-2xl border border-white/10 p-6 transition-colors hover:border-white/25 hover:bg-white/[0.03]">
              <span>
                <span className="block text-xs text-muted-foreground">{s.number}</span>
                <span className="mt-1 block text-lg font-medium">{s.name}</span>
              </span>
              <ArrowUpRight className="size-5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
            </Link>
          ))}
        </div>
      </section>

      <CtaBand title={`Vamos conversar sobre ${service.name.toLowerCase().startsWith("motion") ? "motion design" : "o seu projeto"}?`} highlight="Respondemos em até 1 dia útil." />
    </>
  );
}
