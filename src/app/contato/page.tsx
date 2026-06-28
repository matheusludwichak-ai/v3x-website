import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";

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
        <div className="border-b border-[#2A2A2A] pb-10 md:pb-12 pt-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <ScrollReveal>
              <nav className="flex items-center gap-2 text-xs text-[#F3F3F3]/40 font-[family-name:var(--font-inter)] mb-6">
                <Link href="/" className="hover:text-[#F5C242] transition-colors">V3X</Link>
                <span>/</span>
                <span className="text-[#F3F3F3]/70">Contato</span>
              </nav>
              <p className="text-xs font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.2em] uppercase text-[#F5C242] mb-3">
                Fale Conosco
              </p>
              <h1 className="font-[family-name:var(--font-anton)] text-4xl sm:text-5xl text-white tracking-wide">
                CONTATO
              </h1>
            </ScrollReveal>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16 grid md:grid-cols-2 gap-10 md:gap-12">
          <div>
            <ScrollReveal direction="left">
              <h2 className="font-[family-name:var(--font-anton)] text-2xl text-white tracking-wide mb-6">FALE COM A EQUIPE</h2>
            </ScrollReveal>
            <div className="flex flex-col gap-4">
              <ScrollReveal delay={100}>
                <a
                  href="mailto:suporte@grupov3x.com.br"
                  className="group border border-[#2A2A2A] bg-[#1A1A1A] hover:border-[#F5C242]/40 hover:translate-y-[-2px] transition-all duration-200 p-6 flex flex-col gap-1"
                >
                  <p className="text-xs font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.15em] uppercase text-[#F5C242]">E-mail</p>
                  <p className="text-sm text-white font-[family-name:var(--font-inter)] group-hover:text-[#F5C242] transition-colors duration-200">suporte@grupov3x.com.br</p>
                </a>
              </ScrollReveal>
              <ScrollReveal delay={200}>
                <Link
                  href="https://app.grupov3x.com.br"
                  target="_blank"
                  className="group border border-[#F5C242]/30 bg-[#F5C242]/5 hover:bg-[#F5C242]/10 hover:translate-y-[-2px] transition-all duration-200 p-6 flex flex-col gap-1"
                >
                  <p className="text-xs font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.15em] uppercase text-[#F5C242]">V3X Diagnóstico</p>
                  <p className="text-sm text-white font-[family-name:var(--font-inter)]">Começar diagnóstico gratuito →</p>
                </Link>
              </ScrollReveal>
              <ScrollReveal delay={300}>
                <Link
                  href="https://pipeline.grupov3x.com.br"
                  target="_blank"
                  className="group border border-[#2A2A2A] bg-[#1A1A1A] hover:border-[#F5C242]/40 hover:translate-y-[-2px] transition-all duration-200 p-6 flex flex-col gap-1"
                >
                  <p className="text-xs font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.15em] uppercase text-[#F3F3F3]/40">V3X Pipeline</p>
                  <p className="text-sm text-white font-[family-name:var(--font-inter)]">Conhecer o CRM comercial →</p>
                </Link>
              </ScrollReveal>
            </div>
          </div>

          <ScrollReveal direction="right" delay={100}>
            <div>
              <h2 className="font-[family-name:var(--font-anton)] text-2xl text-white tracking-wide mb-6">PERGUNTAS FREQUENTES</h2>
              <p className="text-sm text-[#F3F3F3]/50 font-[family-name:var(--font-inter)] leading-relaxed mb-6">
                Antes de entrar em contato, confira se sua dúvida já está respondida no nosso FAQ.
              </p>
              <Link
                href="/faq"
                className="group inline-flex items-center gap-2 border border-[#2A2A2A] text-[#F3F3F3] font-[family-name:var(--font-montserrat)] font-semibold text-sm px-6 py-3 hover:border-[#F5C242] hover:text-[#F5C242] hover:translate-y-[-2px] transition-all duration-200"
              >
                Ver FAQ
                <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </main>
      <Footer />
    </>
  );
}
