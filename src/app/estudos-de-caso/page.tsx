import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";

export const metadata: Metadata = {
  title: "Como Funciona o Método V3X — Cenários e Resultados",
  description: "Veja como o método V3X identifica gargalos e estrutura o plano de ação em diferentes segmentos e cenários empresariais.",
  alternates: { canonical: "https://grupov3x.com.br/estudos-de-caso" },
};

const cases = [
  {
    id: "varejo-moda",
    segment: "Varejo de Moda Feminina",
    company: "Rede Regional — SP",
    period: "90 dias",
    challenge: "Conversão estagnada há 18 meses, dependência total do dono no comercial e ticket médio 38% abaixo da média do setor.",
    bottlenecks: [
      "Sem processo de follow-up: apenas 1,5 contatos por lead",
      "Time sem metas claras e sem pipeline visível",
      "Ticket médio baixo por ausência de estratégia de upsell",
      "Dono presente em todas as negociações acima de R$ 500",
    ],
    solution: [
      "Diagnóstico V3X revelou comercial e operação como críticos",
      "Cadência de follow-up estruturada: 5 contatos por lead",
      "Implementação do V3X Pipeline com kanban por etapa",
      "Treinamento do time em upsell e aumento de ticket",
    ],
    results: [
      { label: "Conversão", before: "8%", after: "15%", change: "+87%", up: true },
      { label: "Ticket Médio", before: "R$ 380", after: "R$ 520", change: "+36%", up: true },
      { label: "Faturamento", before: "base", after: "+62%", change: "em 90 dias", up: true },
      { label: "Tempo do Dono em Vendas", before: "70%", after: "25%", change: "-64%", up: false },
    ],
    quote: "Eu sabia que tinha problema, mas não sabia onde estava. O diagnóstico mostrou tudo em 15 minutos.",
    gold: true,
  },
  {
    id: "agencia-digital",
    segment: "Agência de Marketing Digital B2B",
    company: "Agência — MG",
    period: "60 dias",
    challenge: "Churn alto, operação caótica e processos dependentes de 2 colaboradores-chave. Impossível escalar sem perder qualidade.",
    bottlenecks: [
      "Processos não documentados: saída de colaborador = caos",
      "Onboarding de clientes levava 3x mais que concorrentes",
      "Sem métricas de retenção e satisfação de cliente",
      "Gestão reativa: apagando incêndios todo dia",
    ],
    solution: [
      "Diagnóstico revelou operação e gestão como pontos críticos",
      "Documentação de processos críticos (SOPs)",
      "Dashboard de indicadores de retenção implementado",
      "Onboarding estruturado com checklists e prazos",
    ],
    results: [
      { label: "Churn Mensal", before: "12%", after: "4,5%", change: "-62%", up: false },
      { label: "Retenção de Clientes", before: "61%", after: "87%", change: "+26pp", up: true },
      { label: "Tempo de Onboarding", before: "12 dias", after: "4 dias", change: "-67%", up: false },
      { label: "Margem Operacional", before: "18%", after: "29%", change: "+11pp", up: true },
    ],
    quote: "Antes, tudo dependia de mim ou do meu sócio. Hoje a empresa funciona sem a gente no dia a dia.",
    gold: false,
  },
  {
    id: "construtora",
    segment: "Construtora e Reformas Residenciais",
    company: "Construtora Regional — PR",
    period: "120 dias",
    challenge: "Fluxo de caixa imprevisível, obras com margem negativa e falta de controle financeiro. Faturando mais, lucrando menos.",
    bottlenecks: [
      "Orçamentos sem precificação adequada: margem real desconhecida",
      "Sem controle de custo por obra: perdas invisíveis",
      "Fluxo de caixa reativo: sempre no limite",
      "Inadimplência alta sem política de cobrança estruturada",
    ],
    solution: [
      "Diagnóstico financeiro revelou obras com margem negativa",
      "Criação de modelo de precificação por tipo de obra",
      "Controle financeiro semanal por projeto implementado",
      "Política de cobrança com gatilhos e régua automáticos",
    ],
    results: [
      { label: "Margem Bruta Média", before: "8%", after: "22%", change: "+14pp", up: true },
      { label: "Inadimplência", before: "23%", after: "7%", change: "-70%", up: false },
      { label: "Controle por Obra", before: "0%", after: "100%", change: "projetos monitorados", up: true },
      { label: "Lucro Líquido", before: "3%", after: "14%", change: "+367%", up: true },
    ],
    quote: "Descobri que uma obra específica estava dando prejuízo. Sem o diagnóstico eu continuaria repetindo o erro.",
    gold: false,
  },
  {
    id: "saas-b2b",
    segment: "SaaS B2B — Tecnologia",
    company: "Startup de Software — SP",
    period: "45 dias",
    challenge: "CAC 73% acima da média do setor, churn elevado e pipeline sem previsibilidade. Investindo em vendas sem retorno proporcional.",
    bottlenecks: [
      "Pipeline não documentado: cada vendedor trabalhava diferente",
      "Sem qualificação de leads: time perdendo tempo com prospects frios",
      "Follow-up inconsistente: média de 2 contatos (mercado faz 6)",
      "Sem análise de churn: perda de clientes sem entender o motivo",
    ],
    solution: [
      "Diagnóstico comercial revelou processo e follow-up como críticos",
      "V3X Pipeline com estágios definidos e SLA por etapa",
      "Criação de ICP (perfil ideal de cliente) e critérios de qualificação",
      "Processo de análise de churn com entrevistas de saída",
    ],
    results: [
      { label: "CAC", before: "R$ 2.800", after: "R$ 1.600", change: "-43%", up: false },
      { label: "Churn Mensal", before: "8,5%", after: "3,2%", change: "-62%", up: false },
      { label: "Taxa de Fechamento", before: "12%", after: "21%", change: "+75%", up: true },
      { label: "MRR", before: "base", after: "+85%", change: "em 45 dias", up: true },
    ],
    quote: "O V3X Pipeline mudou como o time vende. Agora todo mundo faz a mesma coisa e consigo prever o mês.",
    gold: false,
  },
];

export default function EstudosDeCasoPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0B0B0B] pt-24">
        <div className="border-b border-[#2A2A2A] pb-10 md:pb-12 pt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <ScrollReveal>
              <nav className="flex items-center gap-2 text-xs text-[#F3F3F3]/40 font-[family-name:var(--font-inter)] mb-6">
                <Link href="/" className="hover:text-[#F5C242] transition-colors">V3X</Link>
                <span>/</span>
                <span className="text-[#F3F3F3]/70">Estudos de Caso</span>
              </nav>
              <p className="text-xs font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.2em] uppercase text-[#F5C242] mb-3">
                O Método em Prática
              </p>
              <h1 className="font-[family-name:var(--font-anton)] text-4xl sm:text-5xl text-white tracking-wide">
                O QUE O MÉTODO V3X<br className="hidden sm:block" /> ENTREGA NA PRÁTICA
              </h1>
              <p className="text-[#F3F3F3]/60 font-[family-name:var(--font-inter)] mt-3 max-w-2xl text-sm">
                Problemas comuns que empresas enfrentam — e como o diagnóstico V3X identifica os gargalos e estrutura o plano de ação para cada um.
              </p>
            </ScrollReveal>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16 flex flex-col gap-14 md:gap-20">
          {cases.map((c) => (
            <ScrollReveal key={c.id}>
              <div className={`border ${c.gold ? "border-[#F5C242]/30" : "border-[#2A2A2A]"} bg-[#1A1A1A] relative overflow-hidden`}>
                {c.gold && <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F5C242] to-transparent" />}

                <div className="p-6 md:p-8 border-b border-[#2A2A2A]">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <span className={`text-xs font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.15em] uppercase ${c.gold ? "text-[#F5C242]" : "text-[#F3F3F3]/40"}`}>
                        {c.segment}
                      </span>
                      <p className="text-[#F3F3F3]/30 text-xs font-[family-name:var(--font-inter)] mt-0.5">{c.company}</p>
                    </div>
                    <span className="text-xs font-[family-name:var(--font-montserrat)] font-semibold text-[#F3F3F3]/30 border border-[#2A2A2A] px-3 py-1 self-start">
                      Resultados em {c.period}
                    </span>
                  </div>
                  <p className="text-sm text-[#F3F3F3]/60 font-[family-name:var(--font-inter)] leading-relaxed mt-4 max-w-3xl">
                    {c.challenge}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-px bg-[#2A2A2A]">
                  <div className="bg-[#1A1A1A] p-6 md:p-8">
                    <p className="text-xs font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.15em] uppercase text-[#FF4444]/60 mb-5">
                      ⚠ Gargalos identificados
                    </p>
                    <ul className="flex flex-col gap-3">
                      {c.bottlenecks.map((b) => (
                        <li key={b} className="flex items-start gap-3 text-sm text-[#F3F3F3]/55 font-[family-name:var(--font-inter)] leading-relaxed">
                          <span className="w-1 h-1 bg-[#FF4444]/40 flex-shrink-0 mt-[7px]" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-[#111111] p-6 md:p-8">
                    <p className="text-xs font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.15em] uppercase text-[#22C55E]/60 mb-5">
                      ✓ Solução aplicada
                    </p>
                    <ul className="flex flex-col gap-3">
                      {c.solution.map((s) => (
                        <li key={s} className="flex items-start gap-3 text-sm text-[#F3F3F3]/55 font-[family-name:var(--font-inter)] leading-relaxed">
                          <span className="w-1 h-1 bg-[#22C55E]/40 flex-shrink-0 mt-[7px]" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-6 md:p-8 border-t border-[#2A2A2A]">
                  <p className="text-xs font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.15em] uppercase text-[#F3F3F3]/20 mb-5">
                    Indicadores — antes × depois
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                    {c.results.map((r) => (
                      <div key={r.label} className="border border-[#2A2A2A] bg-[#0B0B0B] p-4">
                        <p className="text-[10px] font-[family-name:var(--font-montserrat)] font-semibold tracking-wider uppercase text-[#F3F3F3]/25 mb-2 leading-tight">{r.label}</p>
                        <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                          <span className="text-xs text-[#F3F3F3]/25 font-[family-name:var(--font-inter)] line-through">{r.before}</span>
                          <span className="font-[family-name:var(--font-bebas)] text-xl text-white tracking-wide">{r.after}</span>
                        </div>
                        <span className="text-xs font-[family-name:var(--font-montserrat)] font-semibold text-[#22C55E] flex items-center gap-1">
                          {r.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                          {r.change}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-l-2 border-[#F5C242]/30 pl-5">
                    <p className="text-sm text-[#F3F3F3]/50 font-[family-name:var(--font-inter)] italic leading-relaxed">
                      {c.quote}
                    </p>
                    <p className="text-xs text-[#F3F3F3]/20 font-[family-name:var(--font-montserrat)] font-semibold mt-2 tracking-wider uppercase">
                      Insight do cenário · {c.segment}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <div className="border-t border-[#2A2A2A] bg-[#111111]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
            <ScrollReveal>
              <p className="text-xs font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.2em] uppercase text-[#F5C242] mb-4">
                Sua empresa é a próxima
              </p>
              <h2 className="font-[family-name:var(--font-anton)] text-3xl sm:text-4xl md:text-5xl text-white tracking-wide mb-4">
                DESCUBRA ONDE ESTÃO<br />SEUS GARGALOS
              </h2>
              <p className="text-sm text-[#F3F3F3]/50 font-[family-name:var(--font-inter)] max-w-xl mx-auto mb-8 leading-relaxed">
                Em 15 minutos você terá um diagnóstico completo com score por dimensão, benchmarking do seu segmento e plano de ação.
              </p>
              <Link
                href="https://app.grupov3x.com.br"
                target="_blank"
                className="group inline-flex items-center gap-2 bg-[#F5C242] text-[#0B0B0B] font-[family-name:var(--font-montserrat)] font-semibold px-10 py-4 hover:bg-white transition-all duration-200 hover:scale-[1.02]"
              >
                Fazer Diagnóstico Gratuito
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <p className="text-xs text-[#F3F3F3]/20 font-[family-name:var(--font-inter)] mt-4">7 dias grátis · Sem cartão de crédito</p>
            </ScrollReveal>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
