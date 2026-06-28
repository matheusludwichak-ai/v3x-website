import { ScrollReveal } from "./scroll-reveal";

const pillars = [
  {
    number: "01",
    title: "Estratégia",
    description:
      "Identificamos onde sua empresa perde dinheiro, quais gargalos limitam seu crescimento e quais oportunidades estão sendo ignoradas.",
  },
  {
    number: "02",
    title: "Escala",
    description:
      "Construímos um plano de ação priorizado por impacto financeiro real, para que você saiba exatamente o que fazer e em qual ordem.",
  },
  {
    number: "03",
    title: "Performance",
    description:
      "Acompanhamos a execução com dados, benchmarks do mercado e evolução mês a mês para garantir que os resultados apareçam.",
  },
];

const dimensions = [
  "Comercial",
  "Marketing",
  "Financeiro",
  "Operação",
  "Gestão",
];

export function MethodologySection() {
  return (
    <section className="py-24 bg-[#111111] border-y border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <ScrollReveal className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-xs font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.2em] uppercase text-[#F5C242] mb-3">
              Metodologia
            </p>
            <h2 className="font-[family-name:var(--font-anton)] text-4xl md:text-5xl text-white tracking-wide">
              O MÉTODO V3X
            </h2>
          </div>
          <p className="text-sm text-[#F3F3F3]/40 font-[family-name:var(--font-inter)] max-w-sm">
            Mais de R$ 4M gerados para empresas aplicando esses três pilares de forma sistemática.
          </p>
        </ScrollReveal>

        {/* Pillars */}
        <div className="grid md:grid-cols-3 gap-px bg-[#2A2A2A] mb-16">
          {pillars.map((p, i) => (
            <ScrollReveal key={p.number} delay={i * 100}>
              <div className="bg-[#111111] p-8 h-full group hover:bg-[#141414] transition-colors duration-200">
                <p className="font-[family-name:var(--font-bebas)] text-5xl text-[#F5C242]/15 mb-4 group-hover:text-[#F5C242]/30 transition-colors duration-300">
                  {p.number}
                </p>
                <h3 className="font-[family-name:var(--font-anton)] text-2xl text-white tracking-wide mb-3 group-hover:text-[#F5C242] transition-colors duration-200">
                  {p.title}
                </h3>
                <p className="text-sm text-[#F3F3F3]/50 font-[family-name:var(--font-inter)] leading-relaxed">
                  {p.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Dimensions */}
        <ScrollReveal>
          <p className="text-xs font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.2em] uppercase text-[#F3F3F3]/30 mb-6">
            5 dimensões estratégicas analisadas
          </p>
          <div className="flex flex-wrap gap-3">
            {dimensions.map((d, i) => (
              <span
                key={d}
                className="border border-[#2A2A2A] px-4 py-2 text-xs font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.1em] uppercase text-[#F3F3F3]/50 hover:border-[#F5C242] hover:text-[#F5C242] transition-all duration-200 cursor-default hover:scale-105"
                style={{ transitionDelay: `${i * 30}ms` }}
              >
                {d}
              </span>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
