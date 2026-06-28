import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Termos de Uso dos produtos e serviços V3X.",
  alternates: { canonical: "https://grupov3x.com.br/termos-de-uso" },
  robots: { index: false, follow: false },
};

export default function TermosPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0B0B0B] pt-24">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <nav className="flex items-center gap-2 text-xs text-[#F3F3F3]/40 font-[family-name:var(--font-inter)] mb-8">
            <Link href="/" className="hover:text-[#F5C242] transition-colors">V3X</Link>
            <span>/</span>
            <span className="text-[#F3F3F3]/70">Termos de Uso</span>
          </nav>
          <h1 className="font-[family-name:var(--font-anton)] text-4xl text-white tracking-wide mb-8">TERMOS DE USO</h1>
          <div className="prose-v3x">
            <p>Última atualização: 27 de junho de 2026.</p>
            <h2>1. Aceitação</h2>
            <p>Ao utilizar os serviços V3X (V3X Diagnóstico e V3X Pipeline), você concorda com estes Termos de Uso. Caso não concorde, não utilize os serviços.</p>
            <h2>2. Serviços</h2>
            <p>A V3X oferece ferramentas de diagnóstico empresarial e CRM comercial em formato de assinatura. Os planos e funcionalidades podem ser alterados mediante aviso prévio.</p>
            <h2>3. Pagamentos</h2>
            <p>As assinaturas são cobradas de acordo com o plano selecionado. O cancelamento pode ser feito a qualquer momento, sem multa, com efeito a partir do próximo ciclo de cobrança.</p>
            <h2>4. Responsabilidades</h2>
            <p>Os relatórios e planos de ação gerados pela V3X são baseados nas informações fornecidas pelo usuário. A V3X não se responsabiliza por decisões tomadas com base nesses relatórios.</p>
            <h2>5. Propriedade Intelectual</h2>
            <p>Todo o conteúdo, metodologia e tecnologia da V3X são de propriedade exclusiva da empresa. É vedada a reprodução sem autorização expressa.</p>
            <h2>6. Contato</h2>
            <p>Dúvidas sobre estes termos: suporte@grupov3x.com.br</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
