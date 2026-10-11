import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { CookiePreferencesButton } from "@/components/analytics/CookiePreferencesButton";
import { CONTACT_EMAIL, CONTACT_EMAIL_HREF } from "@/config/contact";

export const metadata: Metadata = {
  title: "Política de Privacidade e Cookies",
  description: "Como a V3X trata dados pessoais e usa cookies no site, de acordo com a LGPD.",
  alternates: { canonical: "https://grupov3x.com.br/privacidade" },
  robots: { index: false, follow: false },
};

const COOKIES = [
  { name: "v3x-consent", who: "V3X", kind: "Armazenamento local do navegador", purpose: "Guarda a sua escolha sobre cookies.", category: "Essencial", duration: "12 meses" },
  { name: "v3x-landing, v3x-landing-campaign", who: "V3X", kind: "Armazenamento da sessão", purpose: "Página de entrada, site de origem e campanha (UTM) da visita, enviados apenas junto com o formulário que você decidir enviar.", category: "Essencial (atendimento)", duration: "Até fechar a aba" },
  { name: "_ga", who: "Google Analytics", kind: "Cookie", purpose: "Distingue visitantes de forma pseudonimizada para estatísticas de uso.", category: "Análise (com consentimento)", duration: "Até 2 anos" },
  { name: "_ga_H3NVMRK99E", who: "Google Analytics", kind: "Cookie", purpose: "Mantém o estado da sessão para as estatísticas.", category: "Análise (com consentimento)", duration: "Até 2 anos" },
  { name: "Vercel Web Analytics e Speed Insights", who: "Vercel", kind: "Sem cookies", purpose: "Contagem de visitas e desempenho das páginas, sem identificador persistente.", category: "Estatística agregada", duration: "Não se aplica" },
];

export default function PrivacidadePage() {
  return (
    <>
      <PageHero eyebrow="Legal" crumb="Privacidade" title="Política de Privacidade e Cookies" />
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[820px] px-6">
          <div className="prose-v3x">
            <p>Última atualização: 10 de outubro de 2026.</p>
            <p>
              Esta política explica como a V3X trata dados pessoais no site grupov3x.com.br e nos canais de atendimento ligados a ele, conforme a Lei Geral de Proteção de Dados
              (Lei nº 13.709/2018, LGPD).
            </p>

            <h2>1. Quem é responsável</h2>
            <p>
              A V3X é a controladora dos dados tratados neste site. Para qualquer assunto sobre privacidade, inclusive o exercício dos seus direitos, o canal é{" "}
              <a href={CONTACT_EMAIL_HREF}>{CONTACT_EMAIL}</a>.
            </p>

            <h2>2. Que dados tratamos, para quê e com qual base legal</h2>
            <ul>
              <li>
                <strong>Formulário de contato</strong> (nome, e-mail, empresa, serviço de interesse, descrição, faixa de investimento e prazo): para avaliar e responder ao seu
                pedido e preparar uma proposta. Base legal: procedimentos preliminares a um contrato, a seu pedido (art. 7º, V). Junto com a mensagem registramos a página de
                entrada, o site de origem e a campanha da visita, para saber quais canais trazem contatos (legítimo interesse, art. 7º, IX).
              </li>
              <li>
                <strong>Conversas no WhatsApp</strong> (nome do perfil, número e mensagens): para atender você. Base legal: procedimentos preliminares a um contrato ou execução
                de contrato (art. 7º, V). Parte das respostas pode ser escrita por um assistente virtual com inteligência artificial, que se identifica como tal; você pode pedir
                para falar com uma pessoa a qualquer momento, e não tomamos decisões automatizadas sobre você.
              </li>
              <li>
                <strong>Estatísticas de navegação com Google Analytics</strong> (páginas vistas, origem do acesso, cliques em botões e canais de contato, dispositivo e região
                aproximada): para entender como o site é usado e melhorá-lo. Base legal: consentimento (art. 7º, I), pedido no aviso de cookies. Não enviamos ao Google seu nome,
                e-mail, telefone nem o que você digita. Os recursos de publicidade do Google Analytics estão desativados no site.
              </li>
              <li>
                <strong>Funcionamento e segurança</strong> (registros técnicos como endereço IP e navegador nos servidores de hospedagem): para manter o site no ar e prevenir
                abusos. Base legal: legítimo interesse (art. 7º, IX).
              </li>
            </ul>

            <h2>3. Cookies e tecnologias semelhantes</h2>
            <p>
              Cookies essenciais funcionam sem consentimento, porque o site depende deles. Cookies de análise só são ativados se você permitir no aviso de cookies; recusar não
              limita o uso do site. Você pode mudar a escolha a qualquer momento:{" "}
              <CookiePreferencesButton className="font-medium text-foreground underline underline-offset-4" />. Ao retirar o consentimento, os cookies do Google Analytics são
              apagados deste navegador.
            </p>
            <div className="not-prose -mx-6 overflow-x-auto px-6">
              <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-white/15 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    <th className="py-3 pr-4 font-semibold">Nome</th>
                    <th className="py-3 pr-4 font-semibold">De quem</th>
                    <th className="py-3 pr-4 font-semibold">Finalidade</th>
                    <th className="py-3 pr-4 font-semibold">Categoria</th>
                    <th className="py-3 font-semibold">Duração</th>
                  </tr>
                </thead>
                <tbody>
                  {COOKIES.map((c) => (
                    <tr key={c.name} className="border-b border-white/8 align-top text-foreground/85">
                      <td className="py-3 pr-4 font-mono text-xs">{c.name}<span className="mt-1 block font-sans text-[11px] text-muted-foreground">{c.kind}</span></td>
                      <td className="py-3 pr-4">{c.who}</td>
                      <td className="py-3 pr-4">{c.purpose}</td>
                      <td className="py-3 pr-4">{c.category}</td>
                      <td className="py-3">{c.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              Na área restrita da equipe (control.grupov3x.com.br) são usados apenas cookies de autenticação, estritamente necessários para o login. Essa área não usa Google
              Analytics.
            </p>

            <h2>4. Com quem compartilhamos</h2>
            <p>Não vendemos dados pessoais. Usamos fornecedores que tratam dados em nosso nome, apenas para as finalidades acima:</p>
            <ul>
              <li>Vercel: hospedagem do site e métricas sem cookies.</li>
              <li>Supabase: banco de dados do sistema interno de atendimento (servidores em São Paulo).</li>
              <li>Google: Google Analytics (com consentimento), planilha de recebimento do formulário e o modelo de IA Gemini, usado internamente para apoiar respostas e textos.</li>
              <li>WhatsApp (Meta) e o provedor da API de mensagens, quando você conversa conosco por lá.</li>
            </ul>
            <p>
              Alguns desses fornecedores podem armazenar ou processar dados fora do Brasil. Nesses casos, a transferência ocorre para a prestação do serviço e segue as regras do
              art. 33 da LGPD.
            </p>

            <h2>5. Por quanto tempo guardamos</h2>
            <ul>
              <li>Contatos e conversas comerciais: pelo tempo necessário para o atendimento e a negociação e, se não houver contratação, por até 2 anos após o último contato.</li>
              <li>Dados de clientes contratantes: durante o contrato e depois pelo prazo exigido por obrigações legais.</li>
              <li>Google Analytics: dados de eventos por 2 meses e dados de usuário por 14 meses; relatórios agregados podem ser mantidos depois disso.</li>
              <li>Sua escolha de cookies: 12 meses, quando o aviso é exibido novamente.</li>
            </ul>

            <h2>6. Seus direitos</h2>
            <p>
              Você pode pedir, a qualquer momento: confirmação de que tratamos seus dados, acesso, correção, anonimização, bloqueio ou eliminação de dados desnecessários,
              portabilidade, informação sobre com quem compartilhamos, eliminação dos dados tratados com consentimento e a revogação do consentimento (art. 18 da LGPD). Envie o
              pedido para <a href={CONTACT_EMAIL_HREF}>{CONTACT_EMAIL}</a>; podemos pedir uma confirmação de identidade antes de atender. Você também pode apresentar reclamação
              à Autoridade Nacional de Proteção de Dados (ANPD).
            </p>

            <h2>7. Segurança</h2>
            <p>
              Usamos conexão criptografada (HTTPS), acesso restrito por login e permissões ao sistema interno e controles de acesso no banco de dados. Nenhuma medida é
              infalível; se ocorrer um incidente de segurança que possa causar risco ou dano relevante, comunicaremos os titulares afetados e a ANPD, nos termos da lei.
            </p>

            <h2>8. Crianças e adolescentes</h2>
            <p>O site e os serviços da V3X são direcionados a empresas e profissionais, não a menores de 18 anos.</p>

            <h2>9. Alterações</h2>
            <p>Esta política pode ser atualizada. A data no topo indica a versão em vigor; mudanças relevantes sobre cookies fazem o aviso aparecer novamente.</p>
          </div>
        </div>
      </section>
    </>
  );
}
