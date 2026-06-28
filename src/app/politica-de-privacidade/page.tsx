import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Política de Privacidade da V3X — como coletamos, usamos e protegemos seus dados.",
  alternates: { canonical: "https://grupov3x.com.br/politica-de-privacidade" },
  robots: { index: false, follow: false },
};

export default function PoliticaPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0B0B0B] pt-24">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <nav className="flex items-center gap-2 text-xs text-[#F3F3F3]/40 font-[family-name:var(--font-inter)] mb-8">
            <Link href="/" className="hover:text-[#F5C242] transition-colors">V3X</Link>
            <span>/</span>
            <span className="text-[#F3F3F3]/70">Política de Privacidade</span>
          </nav>
          <h1 className="font-[family-name:var(--font-anton)] text-4xl text-white tracking-wide mb-8">POLÍTICA DE PRIVACIDADE</h1>
          <div className="prose-v3x">
            <p>Última atualização: 27 de junho de 2026.</p>
            <h2>1. Coleta de Dados</h2>
            <p>Coletamos apenas os dados necessários para a prestação dos nossos serviços, incluindo nome, e-mail e informações fornecidas voluntariamente nos formulários.</p>
            <h2>2. Uso dos Dados</h2>
            <p>Os dados coletados são utilizados exclusivamente para operação dos serviços V3X (Diagnóstico e Pipeline), comunicação com o usuário e melhoria contínua da plataforma.</p>
            <h2>3. Compartilhamento</h2>
            <p>Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros, exceto quando necessário para operação técnica dos serviços (processadores de pagamento, infraestrutura de hospedagem).</p>
            <h2>4. Cookies</h2>
            <p>Utilizamos cookies para análise de tráfego (Google Analytics) e melhoria da experiência. Você pode desativar cookies nas configurações do seu navegador.</p>
            <h2>5. Seus Direitos</h2>
            <p>Você tem direito a acessar, corrigir ou solicitar a exclusão dos seus dados a qualquer momento. Entre em contato: suporte@grupov3x.com.br.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
