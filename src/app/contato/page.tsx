import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Contato — Fale com a V3X",
  description: "Entre em contato com a equipe V3X. Tire dúvidas sobre o Diagnóstico, o Pipeline ou o método.",
  alternates: { canonical: "https://grupov3x.com.br/contato" },
};

export default function ContatoPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0B0B0B] pt-24">
        <div className="border-b border-[#2A2A2A] pb-12 pt-8">
          <div className="max-w-4xl mx-auto px-6">
            <nav className="flex items-center gap-2 text-xs text-[#F3F3F3]/40 font-[family-name:var(--font-inter)] mb-6">
              <Link href="/" className="hover:text-[#F5C242] transition-colors">V3X</Link>
              <span>/</span>
              <span className="text-[#F3F3F3]/70">Contato</span>
            </nav>
            <p className="text-xs font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.2em] uppercase text-[#F5C242] mb-3">
              Fale Conosco
            </p>
            <h1 className="font-[family-name:var(--font-anton)] text-5xl text-white tracking-wide">
              CONTATO
            </h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-[family-name:var(--font-anton)] text-2xl text-white tracking-wide mb-6">FALE COM A EQUIPE</h2>
            <div className="flex flex-col gap-4">
              <a
                href="mailto:suporte@grupov3x.com.br"
                className="border border-[#2A2A2A] bg-[#1A1A1A] hover:border-[#F5C242]/40 transition-colors p-6 flex flex-col gap-1"
              >
                <p className="text-xs font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.15em] uppercase text-[#F5C242]">E-mail</p>
                <p className="text-sm text-white font-[family-name:var(--font-inter)]">suporte@grupov3x.com.br</p>
              </a>
              <Link
                href="https://app.grupov3x.com.br"
                target="_blank"
                className="border border-[#F5C242]/30 bg-[#F5C242]/5 hover:bg-[#F5C242]/10 transition-colors p-6 flex flex-col gap-1"
              >
                <p className="text-xs font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.15em] uppercase text-[#F5C242]">V3X Diagnóstico</p>
                <p className="text-sm text-white font-[family-name:var(--font-inter)]">Começar diagnóstico gratuito →</p>
              </Link>
              <Link
                href="https://pipeline.grupov3x.com.br"
                target="_blank"
                className="border border-[#2A2A2A] bg-[#1A1A1A] hover:border-[#F5C242]/40 transition-colors p-6 flex flex-col gap-1"
              >
                <p className="text-xs font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.15em] uppercase text-[#F3F3F3]/40">V3X Pipeline</p>
                <p className="text-sm text-white font-[family-name:var(--font-inter)]">Conhecer o CRM comercial →</p>
              </Link>
            </div>
          </div>

          <div>
            <h2 className="font-[family-name:var(--font-anton)] text-2xl text-white tracking-wide mb-6">PERGUNTAS FREQUENTES</h2>
            <p className="text-sm text-[#F3F3F3]/50 font-[family-name:var(--font-inter)] leading-relaxed mb-6">
              Antes de entrar em contato, confira se sua dúvida já está respondida no nosso FAQ.
            </p>
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 border border-[#2A2A2A] text-[#F3F3F3] font-[family-name:var(--font-montserrat)] font-semibold text-sm px-6 py-3 hover:border-[#F5C242] hover:text-[#F5C242] transition-colors"
            >
              Ver FAQ →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
