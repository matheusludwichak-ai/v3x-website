import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { team } from "@/data/team";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "A V3X une estratégia, design e tecnologia para transformar ideias em produtos digitais. Conheça o estúdio e os fundadores.",
  alternates: { canonical: "https://grupov3x.com.br/sobre" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "V3X",
  url: "https://grupov3x.com.br",
  description:
    "V3X é um digital product studio que une estratégia, design e tecnologia para transformar ideias em produtos digitais.",
  slogan: "We turn ideas into digital products.",
};

export default function SobrePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        eyebrow="Quem somos"
        crumb="Sobre"
        title="Unimos estratégia, design e tecnologia para transformar ideias em produtos digitais."
      />

      <section className="bg-paper py-20 md:py-28">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-12 px-6 lg:grid-cols-3">
          {[
            { title: "Estratégia", body: "Visão de negócio antes de qualquer tela." },
            { title: "Design", body: "Interfaces e experiências claras de usar." },
            { title: "Tecnologia", body: "Engenharia que sustenta o produto." },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 80}>
              <div className="border-t border-neutral-200 pt-6">
                <h2 className="text-2xl font-semibold text-ink">{item.title}</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-ink py-20 text-on-ink md:py-28">
        <div className="mx-auto max-w-[1280px] px-6">
          <Reveal>
            <p className="eyebrow text-dark-600">Fundadores</p>
            <h2 className="mt-4 max-w-[26ch] text-3xl font-semibold tracking-tight md:text-5xl">
              Negócios, tecnologia e finanças na mesma mesa.
            </h2>
          </Reveal>

          <div className="mt-16 flex flex-col gap-20">
            {team.map((member, i) => (
              <Reveal key={member.slug} delay={i * 80}>
                <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-[280px_1fr]">
                  <div className="relative aspect-[4/5] w-full max-w-[280px] overflow-hidden rounded-[4px] bg-dark-surface">
                    <Image src={member.photo} alt={member.name} fill sizes="280px" className="object-cover" />
                  </div>
                  <div>
                    <p className="eyebrow text-dark-600">{member.area}</p>
                    <h3 className="mt-2 text-3xl font-semibold">{member.name}</h3>
                    <p className="mt-1 text-[15px] font-medium text-accent">{member.role}</p>
                    <div className="mt-5 flex max-w-[60ch] flex-col gap-4">
                      {member.longBio.map((p) => (
                        <p key={p} className="text-[15px] leading-relaxed text-dark-600">
                          {p}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper py-20 text-center md:py-28">
        <div className="mx-auto max-w-[1280px] px-6">
          <Reveal>
            <h2 className="mx-auto max-w-[24ch] text-3xl font-semibold tracking-tight text-ink md:text-5xl">
              Let&apos;s build something <span className="text-gradient">meaningful.</span>
            </h2>
            <Link
              href="/contato"
              className="mt-8 inline-flex h-12 items-center rounded-[4px] border border-ink bg-ink px-8 text-[16px] font-semibold text-on-ink transition-all hover:-translate-y-px hover:bg-neutral-800"
            >
              Start a project
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
