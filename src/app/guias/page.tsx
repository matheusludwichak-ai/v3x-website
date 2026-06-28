import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";
import { getAllGuias } from "@/lib/guias";
import { ArrowRight, BookOpen, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Guias — Conteúdo Aprofundado sobre Gestão e Estratégia Empresarial",
  description: "Guias completos e definitivos sobre diagnóstico empresarial, pipeline de vendas, escalabilidade, gestão financeira e muito mais. Conteúdo de referência para empresários.",
  alternates: { canonical: "https://grupov3x.com.br/guias" },
};

export default async function GuiasPage() {
  const guias = await getAllGuias();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0B0B0B] pt-24">
        <div className="border-b border-[#2A2A2A] pb-10 md:pb-12 pt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <ScrollReveal>
              <nav className="flex items-center gap-2 text-xs text-[#F3F3F3]/40 font-[family-name:var(--font-inter)] mb-6">
                <Link href="/" className="hover:text-[#F5C242] transition-colors">V3X</Link>
                <span>/</span>
                <span className="text-[#F3F3F3]/70">Guias</span>
              </nav>
              <p className="text-xs font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.2em] uppercase text-[#F5C242] mb-3">
                Guias V3X
              </p>
              <h1 className="font-[family-name:var(--font-anton)] text-4xl sm:text-5xl text-white tracking-wide">
                REFERÊNCIA EM GESTÃO EMPRESARIAL
              </h1>
              <p className="text-[#F3F3F3]/60 font-[family-name:var(--font-inter)] mt-3 max-w-xl text-sm">
                Guias definitivos — cada material tem entre 5.000 e 10.000 palavras, índice clicável e tudo que você precisa para dominar o tema. Diferente do blog: aqui não tem atalhos.
              </p>
            </ScrollReveal>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          {guias.length === 0 ? (
            <p className="text-[#F3F3F3]/40 font-[family-name:var(--font-inter)]">Guias em produção.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {guias.map((g, i) => (
                <ScrollReveal key={g.slug} delay={i * 80}>
                  <Link
                    href={`/guias/${g.slug}`}
                    className="group border border-[#2A2A2A] bg-[#1A1A1A] hover:border-[#F5C242]/40 transition-all duration-200 flex flex-col p-6 md:p-7 gap-4 hover:translate-y-[-4px]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-xs font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.15em] uppercase text-[#F5C242]">
                        {g.difficulty ?? "Guia Completo"}
                      </span>
                      <div className="flex items-center gap-1 text-[#F3F3F3]/30 text-xs font-[family-name:var(--font-inter)]">
                        <BookOpen size={10} />
                        {g.readingTime}
                      </div>
                    </div>
                    <h2 className="font-[family-name:var(--font-anton)] text-xl md:text-2xl text-white tracking-wide leading-snug group-hover:text-[#F5C242] transition-colors duration-200">
                      {g.title}
                    </h2>
                    <p className="text-sm text-[#F3F3F3]/50 font-[family-name:var(--font-inter)] leading-relaxed flex-1">
                      {g.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-[#2A2A2A]">
                      <div className="flex items-center gap-3">
                        {g.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-[10px] font-[family-name:var(--font-montserrat)] font-semibold tracking-wider uppercase text-[#F3F3F3]/20 border border-[#2A2A2A] px-2 py-0.5">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-[#F5C242] font-[family-name:var(--font-montserrat)] font-semibold flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                        Ler guia <ArrowRight size={11} />
                      </span>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}

          <ScrollReveal className="mt-16">
            <div className="border border-[#F5C242]/20 bg-[#1A1A1A] p-8 text-center">
              <p className="text-xs font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.2em] uppercase text-[#F5C242] mb-3">
                Coloque em prática
              </p>
              <h2 className="font-[family-name:var(--font-anton)] text-3xl text-white tracking-wide mb-3">
                DIAGNÓSTICO GRATUITO
              </h2>
              <p className="text-sm text-[#F3F3F3]/50 font-[family-name:var(--font-inter)] mb-6">
                Aplique o que aprendeu. Diagnóstico completo em 5 dimensões, 15 minutos.
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
