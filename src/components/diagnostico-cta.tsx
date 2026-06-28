import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";

const benefits = [
  "Diagnóstico em 8 dimensões do negócio",
  "Relatório executivo completo",
  "Plano de ação priorizado",
  "Benchmarking do seu segmento",
  "7 dias grátis, sem cartão de crédito",
];

export function DiagnosticoCTA() {
  return (
    <section id="diagnostico" className="py-24 bg-[#0B0B0B]">
      <div className="max-w-5xl mx-auto px-6">
        <ScrollReveal>
          <div className="border border-[#F5C242]/30 bg-[rgba(26,26,26,0.7)] backdrop-blur-sm relative overflow-hidden hover:border-[#F5C242]/50 transition-colors duration-300">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F5C242] to-transparent" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-24 bg-[#F5C242]/8 blur-[60px] pointer-events-none" />

            <div className="relative p-8 md:p-12 flex flex-col md:flex-row gap-10 items-start md:items-center">
              {/* Left */}
              <div className="flex-1">
                <p className="text-xs font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.2em] uppercase text-[#F5C242] mb-4">
                  V3X Diagnóstico
                </p>
                <h2 className="font-[family-name:var(--font-anton)] text-4xl md:text-5xl text-white tracking-wide leading-none mb-4">
                  COMECE GRÁTIS.
                  <br />
                  RESULTADOS REAIS.
                </h2>
                <p className="text-sm text-[#F3F3F3]/50 font-[family-name:var(--font-inter)] leading-relaxed mb-6">
                  Em menos de 30 minutos você terá um diagnóstico completo da sua empresa, um plano de ação e benchmarks do mercado.
                </p>
                <ul className="flex flex-col gap-2 mb-8">
                  {benefits.map((b, i) => (
                    <li
                      key={b}
                      className="flex items-center gap-2 text-sm font-[family-name:var(--font-inter)] text-[#F3F3F3]/70"
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <CheckCircle size={14} className="text-[#22C55E] flex-shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
                <Link
                  href="https://app.grupov3x.com.br"
                  target="_blank"
                  className="group inline-flex items-center gap-2 bg-[#F5C242] text-[#0B0B0B] font-[family-name:var(--font-montserrat)] font-semibold text-sm px-8 py-4 hover:bg-white transition-all duration-200 hover:scale-[1.02]"
                >
                  Começar Diagnóstico Grátis
                  <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                </Link>
              </div>

              {/* Right — pricing */}
              <div className="w-full md:w-72 flex flex-col gap-3">
                {[
                  { plan: "Starter", price: "R$ 97", period: "/mês", desc: "1 diagnóstico por ciclo", featured: false },
                  { plan: "Growth", price: "R$ 297", period: "/mês", desc: "3 diagnósticos por ciclo", featured: true },
                  { plan: "Scale", price: "R$ 697", period: "/mês", desc: "Diagnósticos ilimitados", featured: false },
                ].map((p) => (
                  <div
                    key={p.plan}
                    className={`border px-4 py-3 flex items-center justify-between transition-all duration-200 ${
                      p.featured
                        ? "border-[#F5C242]/50 bg-[#F5C242]/5 scale-[1.02]"
                        : "border-[#2A2A2A] bg-[#0B0B0B] hover:border-[#2A2A2A]/80"
                    }`}
                  >
                    <div>
                      <p className={`text-xs font-[family-name:var(--font-montserrat)] font-semibold tracking-wide uppercase ${p.featured ? "text-[#F5C242]" : "text-[#F3F3F3]/30"}`}>
                        {p.plan}
                        {p.featured && <span className="ml-2 text-[10px] border border-[#F5C242]/30 px-1 py-0.5">Popular</span>}
                      </p>
                      <p className="text-xs text-[#F3F3F3]/30 font-[family-name:var(--font-inter)] mt-0.5">{p.desc}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-[family-name:var(--font-bebas)] text-xl text-white tracking-wide">{p.price}</span>
                      <span className="text-xs text-[#F3F3F3]/30 font-[family-name:var(--font-inter)]">{p.period}</span>
                    </div>
                  </div>
                ))}
                <p className="text-xs text-[#F3F3F3]/20 font-[family-name:var(--font-inter)] text-center mt-1">
                  7 dias grátis em todos os planos
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
