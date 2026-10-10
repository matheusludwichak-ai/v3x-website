import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { CtaBand } from "@/components/site/cta-band";
import { services } from "@/data/services";
import { areaImages } from "@/data/areas";

export const metadata: Metadata = {
  title: "Serviços",
  description: "Web design e desenvolvimento, motion design, software e sistemas e produtos digitais: as quatro áreas da V3X.",
  alternates: { canonical: "https://grupov3x.com.br/servicos" },
};

export default function ServicosPage() {
  return (
    <>
      <PageHero
        eyebrow="O que fazemos"
        crumb="Serviços"
        title={<>Quatro áreas, <span className="text-gradient-x">um só padrão de qualidade.</span></>}
        lead="Web, motion, sistemas e produtos. Cada área tem serviços claros e o mesmo processo por trás."
      />

      <section className="container-v3x section-y">
        <div className="grid gap-x-8 gap-y-20 md:grid-cols-2">
          {services.map((service, i) => {
            const img = areaImages[service.slug];
            return (
              <Reveal key={service.slug} delay={(i % 2) * 120} className={i % 2 ? "md:mt-24" : undefined}>
                <Link href={`/servicos/${service.slug}`} className="group block">
                  <div className="case-stage overflow-hidden">
                    {img && (
                      <Image
                        src={img.src}
                        alt={img.alt}
                        width={img.width}
                        height={img.height}
                        sizes="(min-width: 768px) 46vw, 100vw"
                        className="aspect-[1/1] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                      />
                    )}
                  </div>
                  <div className="mt-7 flex items-start justify-between gap-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7fb2ff]">{service.number}</p>
                      <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] md:text-4xl">{service.name}</h2>
                      <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-muted-foreground">{service.short}</p>
                    </div>
                    <span className="mt-8 grid size-12 shrink-0 place-items-center rounded-full border border-white/15 transition-colors duration-300 group-hover:border-transparent group-hover:bg-gradient-x">
                      <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      <CtaBand title="Não sabe qual área resolve o seu caso?" highlight="A gente ajuda a definir." />
    </>
  );
}
