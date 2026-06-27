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
  "Financeiro",
  "Operacional",
  "Marketing",
  "Pessoas",
  "Processos",
  "Tecnologia",
  "Liderança",
];

export function MethodologySection() {
  return (
    <section className="py-24 bg-[#111111] border-y border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-xs font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.2em] uppercase text-[#F5C242] mb-3">
              Metodologia
            </p>
            <h2 className="font-[family-name:var(--font-anton)] text-4xl md:text-5xl text-white tracking-wide">
              O MÉTODO V3X
            </h2>
          </div>
          <p className="text-sm text-[#F3F3F3]/50 font-[family-name:var(--font-inter)] max-w-sm">
            Mais de R$ 4M gerados para empresas aplicando esses três pilares de forma sistemática.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid md:grid-cols-3 gap-px bg-[#2A2A2A] mb-16">
          {pillars.map((p) => (
            <div key={p.number} className="bg-[#111111] p-8">
              <p className="font-[family-name:var(--font-bebas)] text-5xl text-[#F5C242]/20 mb-4">
                {p.number}
              </p>
              <h3 className="font-[family-name:var(--font-anton)] text-2xl text-white tracking-wide mb-3">
                {p.title}
              </h3>
              <p className="text-sm text-[#F3F3F3]/60 font-[family-name:var(--font-inter)] leading-relaxed">
                {p.description}
              </p>
            </div>
          ))}
        </div>

        {/* Dimensions */}
        <div>
          <p className="text-xs font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.2em] uppercase text-[#F3F3F3]/40 mb-6">
            8 dimensões analisadas
          </p>
          <div className="flex flex-wrap gap-3">
            {dimensions.map((d) => (
              <span
                key={d}
                className="border border-[#2A2A2A] px-4 py-2 text-xs font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.1em] uppercase text-[#F3F3F3]/60 hover:border-[#F5C242] hover:text-[#F5C242] transition-colors cursor-default"
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
