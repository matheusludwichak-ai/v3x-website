import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Guias — Conteúdo Completo sobre Gestão e Estratégia Empresarial",
  description: "Guias completos sobre diagnóstico empresarial, pipeline de vendas, escalabilidade, gestão financeira e muito mais.",
  alternates: { canonical: "https://grupov3x.com.br/guias" },
};

const guias = [
  {
    slug: "diagnostico-empresarial-completo",
    title: "Guia Completo: Diagnóstico Empresarial em 8 Dimensões",
    excerpt: "Tudo que você precisa saber para fazer um diagnóstico profundo da sua empresa — do comercial ao financeiro, dos processos à liderança.",
    readingTime: "15 min de leitura",
    category: "Gestão",
  },
  {
    slug: "como-montar-pipeline-comercial",
    title: "Guia Definitivo: Pipeline Comercial do Zero",
    excerpt: "Como estruturar, implementar e gerenciar um pipeline de vendas que realmente converte — para times de 1 a 50 pessoas.",
    readingTime: "12 min de leitura",
    category: "Comercial",
  },
  {
    slug: "escalabilidade-empresarial",
    title: "O Guia da Escalabilidade: Como Crescer Sem Travar",
    excerpt: "Os 5 pilares para escalar uma empresa sem aumentar o caos, a dependência do dono ou os custos na mesma proporção.",
    readingTime: "18 min de leitura",
    category: "Escalabilidade",
  },
];

export default function GuiasPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0B0B0B] pt-24">
        <div className="border-b border-[#2A2A2A] pb-12 pt-8">
          <div className="max-w-7xl mx-auto px-6">
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
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guias.map((g) => (
              <div key={g.slug} className="border border-[#2A2A2A] bg-[#1A1A1A] flex flex-col p-6 gap-4">
                <span className="text-xs font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.15em] uppercase text-[#F5C242]">
                  {g.category}
                </span>
                <h2 className="font-[family-name:var(--font-anton)] text-xl text-white tracking-wide leading-snug">
                  {g.title}
                </h2>
                <p className="text-sm text-[#F3F3F3]/50 font-[family-name:var(--font-inter)] leading-relaxed flex-1">
                  {g.excerpt}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-[#2A2A2A]">
                  <span className="text-xs text-[#F3F3F3]/30 font-[family-name:var(--font-inter)]">{g.readingTime}</span>
                  <span className="text-xs text-[#F5C242] font-[family-name:var(--font-montserrat)] font-semibold flex items-center gap-1">
                    Em breve <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 border border-[#F5C242]/20 bg-[#1A1A1A] p-8 text-center">
            <p className="text-xs font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.2em] uppercase text-[#F5C242] mb-3">
              Enquanto isso
            </p>
            <h2 className="font-[family-name:var(--font-anton)] text-3xl text-white tracking-wide mb-3">
              LEIA NOSSOS ARTIGOS DO BLOG
            </h2>
            <p className="text-sm text-[#F3F3F3]/50 font-[family-name:var(--font-inter)] mb-6">
              Conteúdo prático sobre gestão, comercial e escalabilidade.
            </p>
            <Link href="/blog" className="inline-flex items-center gap-2 bg-[#F5C242] text-[#0B0B0B] font-[family-name:var(--font-montserrat)] font-semibold text-sm px-6 py-3 hover:bg-white transition-colors">
              Ver artigos do Blog <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
