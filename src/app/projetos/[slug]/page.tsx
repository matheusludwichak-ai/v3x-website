import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { StatusBadge } from "@/components/status-badge";
import { getProject, projects } from "@/data/projects";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return {
    title: project.name,
    description: project.summary,
    alternates: { canonical: `https://grupov3x.com.br/projetos/${slug}` },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <>
      <PageHero eyebrow={project.category} crumb={project.name} title={project.name}>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <StatusBadge status={project.status} />
          {project.tech.map((t) => (
            <span key={t} className="numbering text-dark-400">
              {t}
            </span>
          ))}
        </div>
      </PageHero>

      <section className="bg-paper py-20 md:py-28">
        <div className="mx-auto max-w-[1280px] px-6">
          <Reveal className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <p className="eyebrow text-neutral-600">Problema / oportunidade</p>
              <p className="mt-4 text-lg leading-relaxed text-neutral-800">{project.problem}</p>
            </div>
            <div>
              <p className="eyebrow text-neutral-600">Nossa contribuição</p>
              <p className="mt-4 text-lg leading-relaxed text-neutral-800">{project.contribution}</p>
              {project.credits && (
                <p className="mt-4 text-[14px] text-neutral-600">{project.credits}</p>
              )}
            </div>
          </Reveal>

          <div className="mt-20 flex flex-col gap-10">
            {project.gallery.map((item, i) => (
              <Reveal key={item.src} delay={i * 60}>
                <div className="product-window">
                  <div className="window-bar">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="relative aspect-[16/10] w-full">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="(min-width: 1024px) 1120px, 100vw"
                      className="object-cover object-top"
                    />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink py-20 text-on-ink md:py-28">
        <div className="mx-auto max-w-[1280px] px-6 text-center">
          <Reveal>
            <h2 className="mx-auto max-w-[24ch] text-3xl font-semibold tracking-tight md:text-5xl">
              Tem um projeto parecido em mente?
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
