import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Estudos de Caso — Resultados Reais com o Método V3X",
  description: "Cases reais de empresas que aplicaram o método V3X e alcançaram resultados expressivos em gestão, comercial e escalabilidade.",
  alternates: { canonical: "https://grupov3x.com.br/estudos-de-caso" },
};

export default function EstudosDeCasoPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0B0B0B] pt-24">
        <div className="border-b border-[#2A2A2A] pb-12 pt-8">
          <div className="max-w-7xl mx-auto px-6">
            <nav className="flex items-center gap-2 text-xs text-[#F3F3F3]/40 font-[family-name:var(--font-inter)] mb-6">
              <Link href="/" className="hover:text-[#F5C242] transition-colors">V3X</Link>
              <span>/</span>
              <span className="text-[#F3F3F3]/70">Estudos de Caso</span>
            </nav>
            <p className="text-xs font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.2em] uppercase text-[#F5C242] mb-3">
              Resultados Reais
            </p>
            <h1 className="font-[family-name:var(--font-anton)] text-5xl text-white tracking-wide">
              ESTUDOS DE CASO
            </h1>
            <p className="text-[#F3F3F3]/60 font-[family-name:var(--font-inter)] mt-3 max-w-xl">
              Cases reais de empresas que aplicaram o método V3X e transformaram seus resultados.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="border border-[#2A2A2A] bg-[#111111] p-12 text-center">
            <p className="font-[family-name:var(--font-bebas)] text-6xl text-[#F5C242]/20 mb-4">EM BREVE</p>
            <h2 className="font-[family-name:var(--font-anton)] text-3xl text-white tracking-wide mb-3">
              CASES REAIS EM PRODUÇÃO
            </h2>
            <p className="text-sm text-[#F3F3F3]/50 font-[family-name:var(--font-inter)] max-w-md mx-auto mb-8 leading-relaxed">
              Estamos preparando os estudos de caso com resultados reais de empresas que aplicaram o método V3X. Enquanto isso, conheça o diagnóstico gratuito.
            </p>
            <Link
              href="https://app.grupov3x.com.br"
              target="_blank"
              className="inline-flex items-center gap-2 bg-[#F5C242] text-[#0B0B0B] font-[family-name:var(--font-montserrat)] font-semibold text-sm px-8 py-4 hover:bg-white transition-colors"
            >
              Fazer Diagnóstico Gratuito →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
