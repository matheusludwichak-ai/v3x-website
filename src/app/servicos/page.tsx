import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "Serviços",
  description:
    "Web design & development, motion design, software & systems e digital products — as quatro áreas da V3X.",
  alternates: { canonical: "https://grupov3x.com.br/servicos" },
};

export default function ServicosPage() {
  return (
    <>
      <PageHero
        eyebrow="O que fazemos"
        crumb="Serviços"
        title="Quatro áreas, um mesmo padrão de qualidade."
        lead="Estratégia, design e tecnologia aplicadas a quatro frentes — separadas no escopo, conectadas na execução."
      />

      <section className="bg-paper py-20 md:py-28">
        <div className="mx-auto flex max-w-[1280px] flex-col px-6">
          {services.map((service, i) => (
            <Reveal key={service.slug} delay={i * 80}>
              <Link
                href={`/servicos/${service.slug}`}
                className="group grid grid-cols-1 items-center gap-6 border-t border-neutral-200 py-10 last:border-b md:grid-cols-[80px_1fr_auto]"
              >
                <span className="numbering text-neutral-400">{service.number}</span>
                <div>
                  <h2 className="text-2xl font-semibold text-ink transition-colors group-hover:text-accent md:text-3xl">
                    {service.name}
                  </h2>
                  <p className="mt-2 max-w-[56ch] text-[15px] leading-relaxed text-neutral-600">
                    {service.short}
                  </p>
                </div>
                <span className="eyebrow inline-flex items-center gap-2 text-ink">
                  Ver serviço
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
