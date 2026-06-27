import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0B0B0B]">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(#F5C242 1px, transparent 1px),
            linear-gradient(90deg, #F5C242 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#F5C242]/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-24 pb-16">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 border border-[#2A2A2A] bg-[#1A1A1A] px-4 py-2 mb-8">
          <span className="w-1.5 h-1.5 bg-[#F5C242]" />
          <span className="text-xs font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.2em] uppercase text-[#F5C242]">
            Estratégia · Escala · Performance
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-[family-name:var(--font-anton)] text-5xl sm:text-7xl md:text-8xl text-white leading-none tracking-wide mb-6">
          SUA EMPRESA
          <br />
          <span className="text-[#F5C242]">NO PRÓXIMO NÍVEL</span>
        </h1>

        {/* Sub */}
        <p className="text-base sm:text-lg text-[#F3F3F3]/70 font-[family-name:var(--font-inter)] max-w-2xl mx-auto leading-relaxed mb-10">
          A V3X é um ecossistema de ferramentas e metodologias para empresas
          que faturam entre R$ 20k e R$ 5M/mês e querem crescer com
          estratégia, dados e inteligência.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="#diagnostico"
            className="w-full sm:w-auto font-[family-name:var(--font-montserrat)] font-semibold text-sm bg-[#F5C242] text-[#0B0B0B] px-8 py-4 hover:bg-white transition-colors tracking-wide"
          >
            Fazer Diagnóstico Gratuito →
          </Link>
          <Link
            href="#produtos"
            className="w-full sm:w-auto font-[family-name:var(--font-montserrat)] font-semibold text-sm border border-[#2A2A2A] text-[#F3F3F3] px-8 py-4 hover:border-[#F5C242] hover:text-white transition-colors tracking-wide"
          >
            Conhecer os Produtos
          </Link>
        </div>

        {/* Social proof bar */}
        <div className="mt-16 pt-8 border-t border-[#2A2A2A] grid grid-cols-3 gap-6 max-w-xl mx-auto">
          {[
            { value: "R$ 4M+", label: "Gerados pelo método" },
            { value: "8", label: "Dimensões analisadas" },
            { value: "7 dias", label: "Diagnóstico grátis" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-[family-name:var(--font-bebas)] text-3xl text-[#F5C242] tracking-wide">
                {s.value}
              </p>
              <p className="text-xs text-[#F3F3F3]/50 font-[family-name:var(--font-inter)] mt-1">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
