import Link from "next/link";
import { BarChart3, Kanban, ArrowRight } from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";

const products = [
  {
    id: "diagnostico",
    icon: BarChart3,
    tag: "V3X DIAGNÓSTICO",
    headline: "Descubra exatamente onde sua empresa está perdendo dinheiro",
    description:
      "Diagnóstico empresarial em 8 dimensões com análise inteligente, plano de ação priorizado e benchmarking do seu setor. Em menos de 30 minutos você terá um relatório executivo completo.",
    features: [
      "8 dimensões analisadas simultaneamente",
      "Plano de ação priorizado por impacto",
      "Benchmarking do seu segmento",
      "Relatório executivo completo",
    ],
    cta: "Começar Diagnóstico Grátis",
    href: "https://app.grupov3x.com.br",
    badge: "7 dias grátis",
    accent: true,
    external: true,
  },
  {
    id: "pipeline",
    icon: Kanban,
    tag: "V3X PIPELINE",
    headline: "Gerencie seu time comercial com visibilidade total",
    description:
      "CRM comercial feito para o empresário brasileiro. Kanban de leads, histórico de contatos, métricas em tempo real e gestão de equipe. Tudo em um só lugar.",
    features: [
      "Kanban de leads personalizado",
      "Histórico completo de contatos",
      "Métricas e relatórios em tempo real",
      "Gestão de equipe multiusuário",
    ],
    cta: "Conhecer o Pipeline",
    href: "https://pipeline.grupov3x.com.br",
    badge: "7 dias grátis",
    accent: false,
    external: true,
  },
];

export function ProductsSection() {
  return (
    <section id="produtos" className="py-24 bg-[#0B0B0B]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <ScrollReveal className="mb-16">
          <p className="text-xs font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.2em] uppercase text-[#F5C242] mb-3">
            Ecossistema V3X
          </p>
          <h2 className="font-[family-name:var(--font-anton)] text-4xl md:text-5xl text-white tracking-wide">
            DOIS PRODUTOS.
            <br />
            UM OBJETIVO.
          </h2>
          <p className="text-[#F3F3F3]/50 font-[family-name:var(--font-inter)] mt-4 max-w-xl text-sm">
            Diagnóstico para saber onde você está. Pipeline para executar onde você quer chegar.
          </p>
        </ScrollReveal>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {products.map((p, i) => {
            const Icon = p.icon;
            return (
              <ScrollReveal key={p.id} delay={i * 150} direction={i === 0 ? "left" : "right"}>
                <div
                  className={`relative border p-8 flex flex-col gap-6 h-full transition-all duration-300 hover:translate-y-[-4px] ${
                    p.accent
                      ? "border-[#F5C242]/40 bg-[rgba(26,26,26,0.8)] hover:border-[#F5C242]/70"
                      : "border-[#2A2A2A] bg-[#1A1A1A] hover:border-[#F3F3F3]/20"
                  }`}
                >
                  {p.accent && (
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F5C242] to-transparent" />
                  )}

                  {/* Top row */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 border transition-colors duration-200 ${
                          p.accent
                            ? "border-[#F5C242]/40 bg-[#F5C242]/10"
                            : "border-[#2A2A2A] bg-[#0B0B0B]"
                        }`}
                      >
                        <Icon
                          size={18}
                          className={p.accent ? "text-[#F5C242]" : "text-[#F3F3F3]/40"}
                        />
                      </div>
                      <span
                        className={`text-xs font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.2em] ${
                          p.accent ? "text-[#F5C242]" : "text-[#F3F3F3]/40"
                        }`}
                      >
                        {p.tag}
                      </span>
                    </div>
                    <span className="text-xs font-[family-name:var(--font-montserrat)] font-semibold text-[#F3F3F3]/30 border border-[#2A2A2A] px-2 py-1">
                      {p.badge}
                    </span>
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="font-[family-name:var(--font-anton)] text-2xl text-white tracking-wide leading-tight mb-3">
                      {p.headline}
                    </h3>
                    <p className="text-sm text-[#F3F3F3]/50 font-[family-name:var(--font-inter)] leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="flex flex-col gap-2">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm font-[family-name:var(--font-inter)] text-[#F3F3F3]/70">
                        <span className={`w-1 h-1 flex-shrink-0 ${p.accent ? "bg-[#F5C242]" : "bg-[#F3F3F3]/30"}`} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                    href={p.href}
                    target="_blank"
                    className={`mt-auto flex items-center justify-center gap-2 py-3 text-sm font-[family-name:var(--font-montserrat)] font-semibold transition-all duration-200 group ${
                      p.accent
                        ? "bg-[#F5C242] text-[#0B0B0B] hover:bg-white"
                        : "border border-[#2A2A2A] text-[#F3F3F3] hover:border-[#F5C242] hover:text-white"
                    }`}
                  >
                    {p.cta}
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
