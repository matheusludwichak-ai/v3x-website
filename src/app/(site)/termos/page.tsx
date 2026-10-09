import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Termos de uso do site institucional da V3X.",
  alternates: { canonical: "https://grupov3x.com.br/termos" },
  robots: { index: false, follow: false },
};

export default function TermosPage() {
  return (
    <>
      <PageHero eyebrow="Legal" crumb="Termos" title="Termos de Uso" />
      <section className="bg-paper py-16 md:py-20">
        <div className="mx-auto max-w-[760px] px-6">
          <div className="prose-v3x">
            <p>Última atualização: 9 de outubro de 2026.</p>
            <h2>1. Sobre este site</h2>
            <p>
              Este site (grupov3x.com.br) é o site institucional da V3X, um digital product studio.
              Ele apresenta nossos serviços, projetos e canais de contato — não processa pagamentos
              nem oferece um produto próprio diretamente.
            </p>
            <h2>2. Uso do formulário de contato</h2>
            <p>
              Ao enviar o formulário de contato, você concorda que os dados informados sejam usados
              para avaliarmos e respondermos à sua solicitação de projeto, conforme nossa{" "}
              <a href="/privacidade">Política de Privacidade</a>.
            </p>
            <h2>3. Projetos e serviços</h2>
            <p>
              Qualquer projeto contratado com a V3X é regido por um contrato ou proposta comercial
              específica, com escopo, prazo e valores acordados separadamente — estes Termos cobrem
              apenas o uso deste site.
            </p>
            <h2>4. Propriedade intelectual</h2>
            <p>
              Todo o conteúdo deste site — identidade visual, textos, imagens de projetos próprios —
              é de propriedade da V3X. É vedada a reprodução sem autorização expressa.
            </p>
            <h2>5. Contato</h2>
            <p>
              Dúvidas sobre estes termos: <a href="mailto:suporte@grupov3x.com.br">suporte@grupov3x.com.br</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
