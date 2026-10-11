import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { CtaBand } from "@/components/site/cta-band";
import { safeJson } from "@/lib/json-ld";
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
  description: "V3X é um digital product studio que une estratégia, design e tecnologia para transformar ideias em produtos digitais.",
  slogan: "Criamos produtos digitais que fazem empresas avançarem.",
};

const equation = [
  { title: "Estratégia", text: "Visão de negócio" },
  { title: "Design", text: "Interfaces e experiências" },
  { title: "Tecnologia", text: "Engenharia de software" },
];

const values = ["Ambição", "Clareza", "Precisão", "Velocidade", "Qualidade de execução"];

const process = [
  { title: "Descobrir", text: "Entendemos o negócio, o problema, os usuários e os objetivos do projeto." },
  { title: "Desenhar", text: "Estruturamos a experiência, a interface e a solução antes de avançar para a execução." },
  { title: "Construir", text: "Desenvolvemos a solução, validamos os fluxos e transformamos o projeto em algo funcional." },
  { title: "Lançar", text: "Preparamos e realizamos a entrega ou o lançamento, de acordo com o escopo contratado." },
  { title: "Evoluir", text: "Quando previsto no contrato, apoiamos a evolução com melhorias e novas funcionalidades." },
];

const reasons = [
  { title: "Competências complementares", text: "Negócios, tecnologia e finanças reunidos no mesmo time de fundadores." },
  { title: "Experiência comercial e técnica", text: "Visão comercial para entender a necessidade e experiência técnica para executá-la." },
  { title: "Visão ambiciosa", text: "Construir produtos digitais de qualidade, com propósito, experiência e espaço para evoluir." },
];

const photoSize: Record<string, [number, number]> = {
  "matheus-ludwichak": [630, 775],
  "isabella-christina": [620, 755],
  "emmanuelle-assante": [576, 665],
};

export default function SobrePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(jsonLd) }} />

      <PageHero
        eyebrow="Quem somos"
        crumb="Sobre"
        title={<>Unimos <span className="text-gradient-x">estratégia, design e tecnologia</span> para transformar ideias em produtos digitais.</>}
        lead="Não vendemos apenas páginas bonitas ou linhas de código. Desenvolvemos experiências, sistemas e produtos que resolvem problemas reais e ajudam empresas a evoluir."
      />

      <section className="container-v3x section-y">
        <Reveal className="grid items-stretch gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1.3fr]">
          {equation.map((item, i) => (
            <div key={item.title} className="contents">
              <div className="flex min-h-40 flex-col justify-end rounded-2xl border border-white/10 bg-[#07080f] p-7">
                <p className="text-3xl font-bold tracking-[-0.03em]">{item.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
              </div>
              <span aria-hidden className="grid place-items-center py-1 text-4xl font-light text-muted-foreground">{i < 2 ? "+" : "→"}</span>
            </div>
          ))}
          <div className="flex min-h-40 flex-col justify-end rounded-2xl bg-gradient-x p-7 text-white">
            <p className="text-4xl font-extrabold tracking-[-0.035em]">Produtos digitais</p>
            <p className="mt-2 text-sm text-white/85">Experiências digitais · Sistemas · Produtos</p>
          </div>
        </Reveal>
        <Reveal className="mt-12 flex flex-wrap items-center gap-3">
          <span className="mr-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">O que nos guia</span>
          {values.map((v) => (
            <span key={v} className="rounded-full border border-white/12 px-4 py-2 text-sm">{v}</span>
          ))}
        </Reveal>
      </section>

      <section className="border-t border-border bg-[#07080f] section-y">
        <div className="container-v3x">
          <Reveal>
            <p className="eyebrow">Fundadores</p>
            <h2 className="mt-6 max-w-[22ch] text-4xl font-semibold leading-[1.05] tracking-[-0.035em] md:text-5xl">
              Negócios, tecnologia e finanças <span className="text-gradient-x">na construção da V3X.</span>
            </h2>
          </Reveal>
          <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
            {team.map((member, i) => {
              const [w, h] = photoSize[member.slug] ?? [600, 740];
              return (
                <Reveal key={member.slug} delay={i * 100}>
                  <article>
                    <div className="overflow-hidden rounded-[24px] border border-white/10">
                      <Image
                        src={member.photo}
                        alt={`${member.name}, ${member.role}`}
                        width={w}
                        height={h}
                        sizes="(min-width: 768px) 30vw, 100vw"
                        className="aspect-[4/5] h-auto w-full object-cover object-top transition-transform duration-[1200ms] ease-out hover:scale-[1.03]"
                      />
                    </div>
                    <span aria-hidden className="mt-5 block h-[3px] w-14 bg-gradient-x" />
                    <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#7fb2ff]">{member.area}</p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-tight">{member.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{member.role}</p>
                    <div className="mt-5 space-y-3">
                      {member.longBio.map((p) => (
                        <p key={p} className="text-[15px] leading-relaxed text-foreground/80">{p}</p>
                      ))}
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container-v3x section-y">
        <Reveal>
          <p className="eyebrow">Como trabalhamos</p>
          <h2 className="mt-6 max-w-[20ch] text-4xl font-semibold leading-[1.05] tracking-[-0.035em] md:text-5xl">
            Da necessidade <span className="text-gradient-x">ao produto digital.</span>
          </h2>
          <p className="mt-5 max-w-[56ch] text-muted-foreground">Um processo simples e profissional, que dá clareza ao cliente em cada etapa, sem burocracia.</p>
        </Reveal>
        <div className="relative mt-16">
          <span aria-hidden className="absolute left-0 right-0 top-[7px] hidden h-[2px] bg-gradient-x opacity-60 lg:block" />
          <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
            {process.map((step, i) => (
              <Reveal as="li" key={step.title} delay={i * 90}>
                <span aria-hidden className={`relative block size-4 rounded-full border-[3px] ${i === process.length - 1 ? "border-[#8B5CF6] bg-[#8B5CF6]" : "border-[#3882F6] bg-background"}`} />
                <p className="mt-6 text-5xl font-bold tracking-[-0.05em] text-foreground/15">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight">{step.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{step.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-border section-y">
        <div className="container-v3x">
          <Reveal>
            <p className="eyebrow">Por que a V3X</p>
            <h2 className="mt-6 text-4xl font-semibold tracking-[-0.035em] md:text-5xl">Por que conversar com a V3X.</h2>
          </Reveal>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {reasons.map((r, i) => (
              <Reveal key={r.title} delay={i * 100}>
                <div className="relative h-full overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.015] p-8">
                  <span className="text-gradient-x text-5xl font-extrabold tracking-[-0.04em]">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-8 text-2xl font-semibold tracking-tight">{r.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{r.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title="Vamos construir" highlight="algo que importa." lead="Conte o que você precisa. Respondemos com um caminho claro." />
    </>
  );
}
