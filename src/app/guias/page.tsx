import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Guias — Conteúdo Completo sobre Gestão e Estratégia Empresarial",
  description: "Guias completos sobre diagnóstico empresarial, pipeline de vendas, escalabilidade, gestão financeira e muito mais.",
  alternates: { canonical: "https://grupov3x.com.br/guias" },
};

const guias = [
  {
    title: "Guia Completo: Diagnóstico Empresarial em 8 Dimensões",
    excerpt: "Tudo que você precisa saber para fazer um diagnóstico profundo da sua empresa — do comercial ao financeiro, dos processos à liderança.",
    readingTime: "15 min de leitura",
    category: "Gestão",
    href: "/blog/como-fazer-diagnostico-empresarial",
  },
  {
    title: "Guia Definitivo: Pipeline Comercial do Zero",
    excerpt: "Como estruturar, implementar e gerenciar um pipeline de vendas que realmente converte — para times de 1 a 50 pessoas.",
    readingTime: "12 min de leitura",
    category: "Comercial",
    href: "/blog/como-montar-pipeline-de-vendas",
  },
  {
    title: "O Guia da Escalabilidade: Como Crescer Sem Travar",
    excerpt: "Os 5 pilares para escalar uma empresa sem aumentar o caos, a dependência do dono ou os custos na mesma proporção.",
    readingTime: "18 min de leitura",
    category: "Escalabilidade",
    href: "/blog/como-escalar-empresa",
  },
];

export default function GuiasPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0B0B0B] pt-24">
        <div className="border-b border-[#2A2A2A] pb-12 pt-8">
          <div className="max-w-7xl mx-auto px-6">
            <ScrollReveal>
              <nav className="flex items-center gap-2 text-xs text-[#F3F3F3]/40 font-[family-name:var(--font-inter)] mb-6">
                <Link href="/" className="hover:text-[#F5C242] transition-colors">V3X</Link>
                <span>/</span>
                <span className="text-[#F3F3F3]/70">Guias</span>
              </nav>
              <p className="text-xs font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.2em] uppercase text-[#F5C242] mb-3">
                Guias V3X
              </p>
              <h1 className="font-[family-name:var(--font-anton)] text-5xl text-white tracking-wide">
                CONTEÚDO COMPLETO
              </h1>
              <p className="text-[#F3F3F3]/60 font-[family-name:var(--font-inter)] mt-3 max-w-xl">
                Guias aprofundados sobre gestão, estratégia e escalabilidade. Tudo que você precisa para tomar decisões melhores.
              </p>
            </ScrollReveal>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {guias.map((g, i) => (
              <ScrollReveal key={g.title} delay={i * 100}>
                <Link
                  href={g.href}
                  className="group border border-[#2A2A2A] bg-[#1A1A1A] hover:border-[#F5C242]/40 transition-all duration-200 flex flex-col p-6 gap-4 hover:translate-y-[-4px]"
                >
                  <span className="text-xs font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.15em] uppercase text-[#F5C242]">
                    {g.category}
                  </span>
                  <h2 className="font-[family-name:var(--font-anton)] text-xl text-white tracking-wide leading-snug group-hover:text-[#F5C242] transition-colors duration-200">
                    {g.title}
                  </h2>
                  <p className="text-sm text-[#F3F3F3]/50 font-[family-name:var(--font-inter)] leading-relaxed flex-1">
                    {g.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-[#2A2A2A]">
                    <span className="text-xs text-[#F3F3F3]/30 font-[family-name:var(--font-inter)]">{g.readingTime}</span>
                    <span className="text-xs text-[#F5C242] font-[family-name:var(--font-montserrat)] font-semibold flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                      Ler <ArrowRight size={11} />
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="border border-[#F5C242]/20 bg-[#1A1A1A] p-8 text-center">
              <p className="text-xs font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.2em] uppercase text-[#F5C242] mb-3">
                Coloque em prática
              </p>
              <h2 className="font-[family-name:var(--font-anton)] text-3xl text-white tracking-wide mb-3">
                DIAGNÓSTICO GRATUITO
              </h2>
              <p className="text-sm text-[#F3F3F3]/50 font-[family-name:var(--font-inter)] mb-6">
                Aplique o que aprendeu nos guias. Diagnóstico completo em 8 dimensões.
              </p>
              <Link
                href="https://app.grupov3x.com.br"
                target="_blank"
                className="group inline-flex items-center gap-2 bg-[#F5C242] text-[#0B0B0B] font-[family-name:var(--font-montserrat)] font-semibold text-sm px-6 py-3 hover:bg-white transition-all duration-200 hover:scale-[1.02]"
              >
                Fazer Diagnóstico Gratuito
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </main>
      <Footer />
    </>
  );
}
