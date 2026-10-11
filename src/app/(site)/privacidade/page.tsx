import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Política de Privacidade da V3X, como coletamos, usamos e protegemos seus dados.",
  alternates: { canonical: "https://grupov3x.com.br/privacidade" },
  robots: { index: false, follow: false },
};

export default function PrivacidadePage() {
  return (
    <>
      <PageHero eyebrow="Legal" crumb="Privacidade" title="Política de Privacidade" />
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[820px] px-6">
          <div className="prose-v3x">
            <p>Última atualização: 10 de outubro de 2026.</p>
            <h2>1. Coleta de dados</h2>
            <p>
              Coletamos apenas os dados que você nos envia voluntariamente através do formulário de contato (nome, e-mail, empresa e informações sobre o projeto), além de dados de
              navegação coletados pelo Google Analytics somente quando você permite (veja “Cookies”).
            </p>
            <h2>2. Uso dos dados</h2>
            <p>
              Os dados enviados pelo formulário de contato são usados exclusivamente para avaliar e
              responder à sua solicitação de projeto. Eles ficam guardados no nosso sistema interno
              de atendimento, com acesso restrito à equipe. Junto da mensagem registramos a página
              por onde você entrou no site e a origem da visita (por exemplo, busca ou campanha),
              para entender quais canais trazem contatos. Não usamos esses dados para nenhuma outra
              finalidade.
            </p>
            <h2>3. Compartilhamento</h2>
            <p>
              Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros, exceto
              quando necessário para a operação técnica do site (infraestrutura de hospedagem e
              processamento do formulário de contato).
            </p>
            <h2>4. Cookies</h2>
            <p>
              Cookies essenciais mantêm o site funcionando e guardam a sua escolha de privacidade.
              Cookies de análise do Google Analytics só são ativados se você permitir no aviso de
              cookies. Com eles medimos páginas visitadas, a origem do acesso (busca, redes sociais,
              campanhas) e cliques em botões e canais de contato, sem enviar seu nome, e-mail,
              telefone ou o conteúdo das mensagens. Hoje o site não usa cookies de publicidade.
            </p>
            <p>
              Também usamos as métricas de audiência e desempenho da Vercel, nossa hospedagem, que
              não usam cookies. Você pode mudar sua escolha a qualquer momento em “Preferências de
              cookies”, no rodapé do site, ou bloquear cookies nas configurações do navegador.
            </p>
            <h2>5. Seus direitos</h2>
            <p>
              Você tem direito a acessar, corrigir ou solicitar a exclusão dos seus dados a qualquer
              momento. Entre em contato: <a href="mailto:contato@grupov3x.com.br">contato@grupov3x.com.br</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
