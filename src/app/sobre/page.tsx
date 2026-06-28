import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";

export const metadata: Metadata = {
  title: "Sobre a V3X — Estratégia, Escala e Performance",
  description: "A V3X é um ecossistema de ferramentas e metodologias criado para empresas que faturam entre R$ 20k e R$ 5M/mês e querem crescer com inteligência.",
  alternates: { canonical: "https://grupov3x.com.br/sobre" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "V3X",
  url: "https://grupov3x.com.br",
  description: "Ecossistema de ferramentas e metodologias para empresas que querem crescer com estratégia, escala e performance.",
  slogan: "Estratégia · Escala · Performance",
};

export default function SobrePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main className="min-h-screen bg-[#0B0B0B] pt-24">
        <div className="border-b border-[#2A2A2A] pb-12 pt-8">
          <div className="max-w-4xl mx-auto px-6">
            <ScrollReveal>
              <nav className="flex items-center gap-2 text-xs text-[#F3F3F3]/40 font-[family-name:var(--font-inter)] mb-6">
                <Link href="/" className="hover:text-[#F5C242] transition-colors">V3X</Link>
                <span>/</span>
                <span className="text-[#F3F3F3]/70">Sobre</span>
              </nav>
              <p className="text-xs font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.2em] uppercase text-[#F5C242] mb-3">
                Sobre a V3X
              </p>
              <h1 className="font-[family-name:var(--font-anton)] text-5xl text-white tracking-wide">
                ESTRATÉGIA · ESCALA · PERFORMANCE
              </h1>
            </ScrollReveal>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-16 flex flex-col gap-12">
          <div className="grid md:grid-cols-2 gap-12">
            <ScrollReveal direction="left">
              <div>
                <h2 className="font-[family-name:var(--font-anton)] text-2xl text-white tracking-wide mb-4">O QUE É A V3X</h2>
                <p className="text-[#F3F3F3]/60 font-[family-name:var(--font-inter)] leading-relaxed text-sm">
                  A V3X é um ecossistema de ferramentas e metodologias criado para empresas que faturam entre R$ 20k e R$ 5M/mês e querem crescer com estratégia, dados e inteligência — sem depender de achismos ou consultoria cara.
                </p>
                <p className="text-[#F3F3F3]/60 font-[family-name:var(--font-inter)] leading-relaxed text-sm mt-4">
                  Nascemos da prática, não da teoria. Mais de R$ 4M gerados aplicando esse método em empresas reais.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div>
                <h2 className="font-[family-name:var(--font-anton)] text-2xl text-white tracking-wide mb-4">NOSSA MISSÃO</h2>
                <p className="text-[#F3F3F3]/60 font-[family-name:var(--font-inter)] leading-relaxed text-sm">
                  Democratizar o acesso a ferramentas e metodologias de gestão de alto nível para o empresário brasileiro — aquele que não tem tempo a perder e precisa de resultado real.
                </p>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal>
            <div className="grid grid-cols-3 gap-px bg-[#2A2A2A]">
              {[
                { value: "R$ 4M+", label: "Gerados pelo método" },
                { value: "5", label: "Dimensões estratégicas" },
                { value: "2", label: "Produtos no ecossistema" },
              ].map((s) => (
                <div key={s.label} className="bg-[#0B0B0B] p-8 text-center hover:bg-[#0F0F0F] transition-colors duration-200">
                  <p className="font-[family-name:var(--font-bebas)] text-4xl text-[#F5C242] tracking-wide">{s.value}</p>
                  <p className="text-xs text-[#F3F3F3]/40 font-[family-name:var(--font-inter)] mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div>
              <h2 className="font-[family-name:var(--font-anton)] text-2xl text-white tracking-wide mb-6">O ECOSSISTEMA</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { name: "V3X Diagnóstico", desc: "Análise empresarial em 8 dimensões com relatório executivo e plano de ação.", href: "https://app.grupov3x.com.br" },
                  { name: "V3X Pipeline", desc: "CRM comercial com kanban, histórico de contatos e métricas em tempo real.", href: "https://pipeline.grupov3x.com.br" },
                ].map((p) => (
                  <Link key={p.name} href={p.href} target="_blank" className="group border border-[#2A2A2A] bg-[#1A1A1A] hover:border-[#F5C242]/40 hover:translate-y-[-4px] transition-all duration-200 p-6">
                    <p className="font-[family-name:var(--font-montserrat)] font-semibold text-[#F5C242] text-sm mb-2">{p.name}</p>
                    <p className="text-sm text-[#F3F3F3]/50 font-[family-name:var(--font-inter)] leading-relaxed">{p.desc}</p>
                    <p className="text-xs text-[#F5C242] font-[family-name:var(--font-montserrat)] font-semibold mt-4 group-hover:gap-2 flex items-center gap-1 transition-all duration-200">
                      Conhecer →
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </main>
      <Footer />
    </>
  );
}
