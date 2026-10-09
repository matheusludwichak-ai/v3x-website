import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { getService, services } from "@/data/services";

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

  return (
    <>
      <PageHero eyebrow={`Serviço ${service.number}`} crumb={service.name} title={service.heroLine}>
        <p className="mt-6 max-w-[56ch] text-lg leading-relaxed text-dark-600">{service.description}</p>
      </PageHero>

      <section className="bg-paper py-20 md:py-28">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-16 px-6 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow text-neutral-600">Quando faz sentido</p>
            <ul className="mt-6 flex flex-col gap-4">
              {service.problems.map((p) => (
                <li key={p} className="flex gap-3 border-t border-neutral-200 pt-4 text-[15px] leading-relaxed text-neutral-800">
                  <span className="mt-2 h-[5px] w-[5px] shrink-0 bg-accent" />
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={100}>
            <p className="eyebrow text-neutral-600">Escopo</p>
            <ul className="mt-6 flex flex-col gap-4">
              {service.scope.map((s) => (
                <li key={s} className="flex gap-3 border-t border-neutral-200 pt-4 text-[15px] leading-relaxed text-neutral-800">
                  <span className="mt-2 h-[5px] w-[5px] shrink-0 bg-accent" />
                  {s}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="bg-ink py-20 text-on-ink md:py-28">
        <div className="mx-auto max-w-[1280px] px-6">
          <Reveal>
            <p className="eyebrow text-dark-600">Processo</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">Como trabalhamos</h2>
          </Reveal>
          <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
            {service.process.map((step, i) => (
              <Reveal key={step.title} delay={i * 80}>
                <div className="border-t border-dark-border pt-5">
                  <span className="numbering text-dark-400">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-dark-600">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {service.faq.length > 0 && (
        <section className="bg-paper py-20 md:py-28">
          <div className="mx-auto max-w-[1280px] px-6">
            <Reveal>
              <p className="eyebrow text-neutral-600">Perguntas frequentes</p>
            </Reveal>
            <div className="mt-10 flex flex-col">
              {service.faq.map((item, i) => (
                <Reveal key={item.q} delay={i * 80}>
                  <div className="border-t border-neutral-200 py-6 last:border-b">
                    <h3 className="text-lg font-semibold text-ink">{item.q}</h3>
                    <p className="mt-2 max-w-[60ch] text-[15px] leading-relaxed text-neutral-600">{item.a}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-ink py-20 text-on-ink md:py-28">
        <div className="mx-auto max-w-[1280px] px-6 text-center">
          <Reveal>
            <h2 className="mx-auto max-w-[24ch] text-3xl font-semibold tracking-tight md:text-5xl">
              Quer conversar sobre um projeto de <span className="text-gradient">{service.name}</span>?
            </h2>
            <Link
              href="/contato"
              className="mt-8 inline-flex h-12 items-center rounded-[4px] border border-[#F3F2EE] bg-[#F3F2EE] px-8 text-[16px] font-semibold text-ink transition-all hover:-translate-y-px hover:bg-neutral-200"
            >
              Start a project
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
