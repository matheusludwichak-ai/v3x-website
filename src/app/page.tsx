import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { CornerMarks } from "@/components/corner-marks";
import { HeroVisual } from "@/components/hero-visual";
import { StatusBadge } from "@/components/status-badge";
import { services } from "@/data/services";
import { projects } from "@/data/projects";
import { team } from "@/data/team";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "V3X — Digital Product Studio",
  description:
    "We turn ideas into digital products. Unimos estratégia, design e tecnologia para criar sites, sistemas e produtos digitais.",
};

const PROCESS_STEPS = [
  { number: "01", title: "Discover", body: "Entendemos o negócio, o problema, os usuários e os objetivos." },
  { number: "02", title: "Design", body: "Estruturamos experiência, interface e solução antes de construir." },
  { number: "03", title: "Build", body: "Desenvolvemos, validamos os fluxos e entregamos algo funcional." },
  { number: "04", title: "Launch", body: "Preparamos a entrega ou o lançamento, conforme o escopo." },
  { number: "05", title: "Evolve", body: "Quando previsto, apoiamos melhorias e novas funcionalidades." },
];

export default async function HomePage() {
  const posts = (await getAllPosts()).slice(0, 3);

  return (
    <>
      {/* ───────── Hero — ink ───────── */}
      <section className="relative overflow-hidden bg-ink pt-40 pb-24 text-on-ink md:pt-48">
        <CornerMarks className="text-dark-400" />
        <div
          className="absolute -right-24 -top-24 h-[480px] w-[1px] origin-top-right rotate-[32deg]"
          style={{ background: "var(--gradient-signature)" }}
        />
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-16 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="eyebrow text-dark-600">Digital Product Studio</p>
            <h1 className="mt-6 max-w-[14ch] text-[2.75rem] font-bold leading-[0.98] tracking-tight md:text-[4.5rem]">
              We turn ideas into <span className="text-gradient">digital products.</span>
            </h1>
            <p className="mt-8 max-w-[46ch] text-xl leading-relaxed text-dark-600">
              Criamos experiências web, sistemas e produtos digitais que conectam design, tecnologia
              e negócio.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/projetos"
                className="btn-shine btn-shine-dark inline-flex h-12 items-center rounded-[4px] border border-[#F3F2EE] bg-[#F3F2EE] px-7 text-[16px] font-semibold text-ink transition-all hover:-translate-y-px hover:bg-neutral-200"
              >
                Explore our work
              </Link>
              <Link
                href="/contato"
                className="btn-shine inline-flex h-12 items-center rounded-[4px] border border-[#F3F2EE] px-7 text-[16px] font-semibold text-on-ink transition-all hover:bg-[#F3F2EE] hover:text-ink"
              >
                Start a project
              </Link>
            </div>
          </div>
          <HeroVisual />
        </div>
      </section>

      {/* ───────── Manifesto — paper ───────── */}
      <section className="bg-paper py-28 md:py-36">
        <div className="mx-auto max-w-[1280px] px-6">
          <Reveal className="mx-auto max-w-[62ch] text-center">
            <p className="eyebrow text-neutral-600">Como pensamos</p>
            <p className="mt-6 text-2xl font-medium leading-snug tracking-tight text-ink md:text-4xl">
              Bons produtos digitais não começam com código ou design. Começam com o problema
              certo, entendido a fundo — <span className="text-neutral-600">o resto é execução.</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ───────── Services — ink ───────── */}
      <section className="bg-ink py-28 text-on-ink md:py-36">
        <div className="mx-auto max-w-[1280px] px-6">
          <Reveal>
            <p className="eyebrow text-dark-600">O que fazemos</p>
            <h2 className="mt-4 max-w-[20ch] text-3xl font-semibold tracking-tight md:text-5xl">
              Quatro áreas. Um mesmo padrão de qualidade.
            </h2>
          </Reveal>

          <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-[4px] border border-dark-border bg-dark-border sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, i) => (
              <Reveal key={service.slug} delay={i * 80}>
                <Link
                  href={`/servicos/${service.slug}`}
                  className="group flex h-full flex-col justify-between bg-ink p-8 transition-colors hover:bg-dark-surface"
                >
                  <div>
                    <span className="numbering text-dark-400">{service.number}</span>
                    <h3 className="mt-6 text-xl font-semibold leading-snug">{service.name}</h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-dark-600">{service.short}</p>
                  </div>
                  <span className="eyebrow mt-8 inline-flex items-center gap-2 text-dark-600 group-hover:text-on-ink">
                    Saiba mais
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Selected work — paper ───────── */}
      <section className="bg-paper py-28 md:py-36">
        <div className="mx-auto max-w-[1280px] px-6">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-neutral-600">Selected work</p>
              <h2 className="mt-4 max-w-[22ch] text-3xl font-semibold tracking-tight text-ink md:text-5xl">
                Projeto próprio, estudos e produto em desenvolvimento.
              </h2>
            </div>
            <Link href="/projetos" className="eyebrow border-b border-ink pb-1 text-ink">
              Ver todos os projetos →
            </Link>
          </Reveal>

          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_1fr]">
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
                        sizes="(min-width: 1024px) 60vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    </div>
                  </div>
                  <p className="eyebrow mt-5 text-neutral-600">{project.category}</p>
                  <h3 className="mt-2 text-2xl font-semibold text-ink">{project.name}</h3>
                  <p className="mt-2 max-w-[48ch] text-[15px] leading-relaxed text-neutral-600">
                    {project.summary}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Como trabalhamos — ink ───────── */}
      <section className="bg-ink py-28 text-on-ink md:py-36">
        <div className="mx-auto max-w-[1280px] px-6">
          <Reveal>
            <p className="eyebrow text-dark-600">Como trabalhamos</p>
            <h2 className="mt-4 max-w-[20ch] text-3xl font-semibold tracking-tight md:text-5xl">
              Da necessidade ao produto.
            </h2>
            <p className="mt-4 max-w-[50ch] text-dark-600">Cinco etapas, um fluxo contínuo.</p>
          </Reveal>

          <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
            {PROCESS_STEPS.map((step, i) => (
              <Reveal key={step.number} delay={i * 80} className={i % 2 === 1 ? "lg:mt-10" : ""}>
                <div className="border-t border-dark-border pt-5">
                  <span className="numbering text-dark-400">{step.number}</span>
                  <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-dark-600">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-16 max-w-[60ch] text-sm text-dark-400">
            Entrega, lançamento e evolução seguem o escopo contratado.
          </p>
        </div>
      </section>

      {/* ───────── Founders — paper ───────── */}
      <section className="bg-paper py-28 md:py-36">
        <div className="mx-auto max-w-[1280px] px-6">
          <Reveal>
            <h2 className="max-w-[24ch] text-3xl font-semibold tracking-tight text-ink md:text-5xl">
              Negócios, tecnologia e finanças{" "}
              <span className="text-neutral-600">na mesma mesa.</span>
            </h2>
          </Reveal>

          <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-3">
            {team.map((member, i) => (
              <Reveal key={member.slug} delay={i * 100}>
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[4px] bg-neutral-200">
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <p className="eyebrow mt-5 text-neutral-600">{member.area}</p>
                <h3 className="mt-2 text-xl font-semibold text-ink">{member.name}</h3>
                <p className="text-[15px] font-medium text-accent">{member.role}</p>
                <p className="mt-3 max-w-[38ch] text-[14px] leading-relaxed text-neutral-600">
                  {member.bio}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12">
            <Link href="/sobre" className="eyebrow border-b border-ink pb-1 text-ink">
              Conhecer a equipe →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ───────── Blog — ink ───────── */}
      {posts.length > 0 && (
        <section className="bg-ink py-28 text-on-ink md:py-36">
          <div className="mx-auto max-w-[1280px] px-6">
            <Reveal className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="eyebrow text-dark-600">Blog V3X</p>
                <h2 className="mt-4 max-w-[20ch] text-3xl font-semibold tracking-tight md:text-5xl">
                  Conteúdo que gera resultado.
                </h2>
              </div>
              <Link href="/blog" className="eyebrow border-b border-dark-600 pb-1 text-dark-600 hover:text-on-ink">
                Ver todos →
              </Link>
            </Reveal>

            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
              {posts.map((post, i) => (
                <Reveal key={post.slug} delay={i * 100}>
                  <Link href={`/blog/${post.slug}`} className="group block border-t border-dark-border pt-6">
                    <p className="eyebrow text-dark-400">{post.category}</p>
                    <h3 className="mt-4 text-xl font-semibold leading-snug group-hover:text-dark-600">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-[14px] leading-relaxed text-dark-600">{post.excerpt}</p>
                    <p className="numbering mt-5 text-dark-400">{post.readingTime}</p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ───────── CTA final — paper ───────── */}
      <section className="bg-paper py-28 md:py-40">
        <div className="mx-auto max-w-[1280px] px-6 text-center">
          <Reveal>
            <h2 className="mx-auto max-w-[18ch] text-4xl font-bold tracking-tight text-ink md:text-6xl">
              Have an idea? <span className="text-gradient">Let&apos;s build it.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-[50ch] text-lg text-neutral-600">
              Conte-nos o que você está construindo e vamos explorar a melhor forma de tirar sua
              ideia do papel.
            </p>
            <Link
              href="/contato"
              className="btn-shine mt-10 inline-flex h-12 items-center rounded-[4px] border border-ink bg-ink px-8 text-[16px] font-semibold text-on-ink transition-all hover:-translate-y-px hover:bg-neutral-800"
            >
              Start a project
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
