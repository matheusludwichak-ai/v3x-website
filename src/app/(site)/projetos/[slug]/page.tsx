import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { StatusBadge } from "@/components/status-badge";
import { CtaBand } from "@/components/site/cta-band";
import { getProject, projects, type GalleryItem } from "@/data/projects";

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

function Shot({ item, label, sizes, caption }: { item: GalleryItem; label: string; sizes: string; caption?: string }) {
  return (
    <figure>
      <div className="browser">
        <div className="browser-bar"><i /><i /><i /><u>{label}</u></div>
        <Image src={item.src} alt={item.alt} width={item.width} height={item.height} sizes={sizes} className="h-auto w-full" />
      </div>
      {caption && <figcaption className="mt-3 text-sm text-muted-foreground">{caption.charAt(0).toUpperCase() + caption.slice(1)}</figcaption>}
    </figure>
  );
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const screens = project.gallery.filter((g) => g.height / g.width > 0.5);
  const strips = project.gallery.filter((g) => g.height / g.width <= 0.5);
  const [lead, ...rest] = screens;
  const label = project.name.toLowerCase();

  return (
    <>
      <PageHero eyebrow={project.category} crumb={project.name} title={project.name} lead={project.summary}>
        <div className="hero-in hero-in-3 mt-8 flex flex-wrap items-center gap-3">
          <StatusBadge status={project.status} />
          {project.tech.map((t) => (
            <span key={t} className="rounded-full border border-white/12 px-3.5 py-1.5 text-xs text-foreground/85">{t}</span>
          ))}
        </div>
      </PageHero>

      {lead && (
        <section className="container-v3x pt-20 md:pt-28">
          <Reveal className="case-stage p-4 sm:p-10">
            <Shot item={lead} label={label} sizes="(min-width: 1280px) 1180px, 100vw" />
          </Reveal>
        </section>
      )}

      <section className="container-v3x grid gap-12 py-20  md:py-28 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow">Problema e oportunidade</p>
          <p className="mt-6 text-xl leading-relaxed text-foreground/90">{project.problem}</p>
        </Reveal>
        <Reveal delay={100}>
          <p className="eyebrow">Nossa contribuição</p>
          <p className="mt-6 text-xl leading-relaxed text-foreground/90">{project.contribution}</p>
          {project.credits && <p className="mt-5 text-sm text-muted-foreground">{project.credits}</p>}
        </Reveal>
      </section>

      {(rest.length > 0 || strips.length > 0) && (
        <section className="border-t border-border bg-[#07080f] py-20 md:py-28">
          <div className="container-v3x">
            <Reveal>
              <p className="eyebrow">Dentro do produto</p>
              {project.status === "Em desenvolvimento" && (
                <p className="mt-4 max-w-[60ch] text-sm text-muted-foreground">Telas em modo demonstração, com dados fictícios.</p>
              )}
            </Reveal>
            <div className="mt-12 grid gap-8 md:grid-cols-2">
              {rest.map((item, i) => (
                <Reveal key={item.src} delay={(i % 2) * 100}>
                  <Shot item={item} label={label} sizes="(min-width: 768px) 46vw, 100vw" caption={item.alt.replace(`${project.name}, `, "")} />
                </Reveal>
              ))}
            </div>
            {strips.length > 0 && (
              <div className="mt-8 space-y-8">
                {strips.map((item) => (
                  <Reveal key={item.src}>
                    <Shot item={item} label={label} sizes="(min-width: 1280px) 1180px, 100vw" caption={item.alt.replace(`${project.name}, `, "")} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <CtaBand title="Tem um projeto parecido em mente?" highlight="Vamos conversar." />
    </>
  );
}
