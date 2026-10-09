import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { StatusBadge } from "@/components/status-badge";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projetos",
  description: "Projeto próprio, estudos e produto em desenvolvimento pela V3X.",
  alternates: { canonical: "https://grupov3x.com.br/projetos" },
};

export default function ProjetosPage() {
  return (
    <>
      <PageHero
        eyebrow="Projetos selecionados"
        crumb="Projetos"
        title="Projeto próprio, estudos e produto em desenvolvimento."
        lead="Mostramos o que é real: o status de cada projeto está sempre visível, nunca escondido."
      />

      <section className="bg-paper py-20 md:py-28">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-16 px-6 md:grid-cols-2">
          {projects.map((project, i) => (
            <Reveal key={project.slug} delay={i * 100}>
              <Link href={`/projetos/${project.slug}`} className="group block">
                <div className="relative overflow-hidden rounded-[8px] border border-neutral-200">
                  <div className="absolute left-4 top-4 z-10">
                    <StatusBadge status={project.status} />
                  </div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
                    <Image
                      src={project.cover}
                      alt={project.name}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                </div>
                <p className="eyebrow mt-5 text-neutral-600">{project.category}</p>
                <h2 className="mt-2 text-2xl font-semibold text-ink">{project.name}</h2>
                <p className="mt-2 max-w-[48ch] text-[15px] leading-relaxed text-neutral-600">
                  {project.summary}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
