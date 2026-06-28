import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ChevronDown } from "lucide-react";

export const metadata: Metadata = {
  title: "FAQ — Perguntas Frequentes",
  description:
    "Respostas para as perguntas mais frequentes sobre diagnóstico empresarial, gestão, escalabilidade e os produtos V3X.",
  alternates: { canonical: "https://grupov3x.com.br/faq" },
};

const faqs = [
  {
    category: "V3X Diagnóstico",
    questions: [
      {
        q: "O que é o V3X Diagnóstico?",
        a: "O V3X Diagnóstico é uma plataforma que analisa sua empresa em 5 dimensões estratégicas — comercial, marketing, financeiro, operação e gestão — e entrega um relatório executivo com score de 0 a 100, benchmarking do seu segmento e plano de ação com 5 tarefas priorizadas.",
        cta: { label: "Fazer diagnóstico grátis", href: "https://app.grupov3x.com.br" },
      },
      {
        q: "Quanto tempo leva para fazer o diagnóstico?",
        a: "O questionário leva cerca de 15 minutos para ser respondido. O relatório é gerado automaticamente após a conclusão — sem espera.",
        cta: null,
      },
      {
        q: "Quais são os planos disponíveis?",
        a: "Starter (R$ 147/mês — 1 diagnóstico por mês), Growth (R$ 497/mês — 2 diagnósticos por mês, mais popular) e Scale (R$ 797/mês — diagnósticos ilimitados + usuários ilimitados). Sem fidelidade — cancele quando quiser.",
        cta: { label: "Ver planos completos", href: "https://app.grupov3x.com.br" },
      },
      {
        q: "Precisa de cartão de crédito para o trial?",
        a: "Não. O diagnóstico gratuito não exige cartão de crédito. Você só precisa informar um meio de pagamento ao assinar um dos planos.",
        cta: null,
      },
    ],
  },
  {
    category: "V3X Pipeline",
    questions: [
      {
        q: "O que é o V3X Pipeline?",
        a: "O V3X Pipeline é um CRM comercial com kanban de leads, histórico de contatos, métricas em tempo real e gestão de equipe. Feito para o empresário brasileiro que quer organizar e escalar o comercial.",
        cta: { label: "Conhecer o Pipeline", href: "https://pipeline.grupov3x.com.br" },
      },
      {
        q: "Quantos usuários podem usar o Pipeline?",
        a: "O plano inclui o usuário principal (owner). Assentos adicionais podem ser comprados por R$ 59,90/mês cada, com gerenciamento completo pelo painel da empresa.",
        cta: null,
      },
    ],
  },
  {
    category: "Gestão Empresarial",
    questions: [
      {
        q: "Como identificar os gargalos da minha empresa?",
        a: "Os gargalos aparecem nas dimensões com score abaixo de 60 no diagnóstico. As causas mais comuns: funil comercial mal estruturado, marketing sem posicionamento claro, fluxo financeiro imprevisível, operação dependente do dono e falta de clareza estratégica na gestão.",
        cta: { label: "Identificar meus gargalos", href: "https://app.grupov3x.com.br" },
      },
      {
        q: "Qual a diferença entre escalar e crescer?",
        a: "Crescer é aumentar o faturamento — o que muitas vezes significa aumentar custos e esforço na mesma proporção. Escalar é aumentar o faturamento com crescimento proporcionalmente menor dos custos e da dependência do dono. Escalabilidade exige processos, time e tecnologia bem estruturados.",
        cta: null,
      },
      {
        q: "Com que frequência devo fazer um diagnóstico empresarial?",
        a: "A recomendação é: diagnóstico completo das 5 dimensões a cada 1 a 2 meses, com acompanhamento das métricas no período. Empresas em fase de reestruturação podem se beneficiar de diagnósticos mensais — o histórico comparativo do plano Growth facilita acompanhar a evolução.",
        cta: null,
      },
    ],
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.flatMap((cat) =>
    cat.questions.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    }))
  ),
};

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="min-h-screen bg-[#0B0B0B] pt-24">
        <div className="border-b border-[#2A2A2A] pb-12 pt-8">
          <div className="max-w-4xl mx-auto px-6">
            <ScrollReveal>
              <nav className="flex items-center gap-2 text-xs text-[#F3F3F3]/40 font-[family-name:var(--font-inter)] mb-6">
                <Link href="/" className="hover:text-[#F5C242] transition-colors">V3X</Link>
                <span>/</span>
                <span className="text-[#F3F3F3]/70">FAQ</span>
              </nav>
              <p className="text-xs font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.2em] uppercase text-[#F5C242] mb-3">
                Central de Ajuda
              </p>
              <h1 className="font-[family-name:var(--font-anton)] text-5xl text-white tracking-wide">
                PERGUNTAS FREQUENTES
              </h1>
              <p className="text-[#F3F3F3]/60 font-[family-name:var(--font-inter)] mt-3">
                Não encontrou o que procura?{" "}
                <Link href="/contato" className="text-[#F5C242] hover:text-white transition-colors">
                  Entre em contato
                </Link>
              </p>
            </ScrollReveal>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-16 flex flex-col gap-16">
          {faqs.map((cat, ci) => (
            <ScrollReveal key={cat.category} delay={ci * 100}>
              <div>
                <p className="text-xs font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.2em] uppercase text-[#F5C242] mb-6">
                  {cat.category}
                </p>
                <div className="flex flex-col gap-px bg-[#2A2A2A]">
                  {cat.questions.map((faq) => (
                    <details key={faq.q} className="group bg-[#0B0B0B]">
                      <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-[#111111] transition-colors">
                        <span className="font-[family-name:var(--font-montserrat)] font-semibold text-white text-sm pr-4">
                          {faq.q}
                        </span>
                        <ChevronDown
                          size={16}
                          className="text-[#F5C242] flex-shrink-0 group-open:rotate-180 transition-transform"
                        />
                      </summary>
                      <div className="px-6 pb-6 border-t border-[#2A2A2A]">
                        <p className="text-sm text-[#F3F3F3]/60 font-[family-name:var(--font-inter)] leading-relaxed mt-4">
                          {faq.a}
                        </p>
                        {faq.cta && (
                          <Link
                            href={faq.cta.href}
                            target={faq.cta.href.startsWith("http") ? "_blank" : undefined}
                            className="inline-flex items-center gap-1 mt-4 text-xs font-[family-name:var(--font-montserrat)] font-semibold text-[#F5C242] hover:text-white transition-colors"
                          >
                            {faq.cta.label} →
                          </Link>
                        )}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
