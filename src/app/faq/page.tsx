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
    category: "Diagnóstico Empresarial",
    questions: [
      {
        q: "O que é diagnóstico empresarial?",
        a: "Diagnóstico empresarial é o processo de análise sistemática da situação atual de uma empresa — identificando pontos fortes, gargalos e oportunidades em cada dimensão estratégica. É o ponto de partida para qualquer decisão de crescimento bem fundamentada.",
        cta: null,
      },
      {
        q: "Por que fazer um diagnóstico antes de contratar consultoria?",
        a: "Diagnóstico mostra onde está o problema real — não o sintoma. Contratar consultoria sem diagnóstico é como entrar em cirurgia sem exame. O diagnóstico direciona onde a consultoria deve focar e evita gastos em soluções para o problema errado.",
        cta: { label: "Fazer diagnóstico grátis", href: "https://app.grupov3x.com.br" },
      },
      {
        q: "Com que frequência devo fazer um diagnóstico empresarial?",
        a: "Empresas em crescimento ativo: a cada 60-90 dias. Empresas em consolidação: a cada 6 meses. O mínimo recomendado é 1 diagnóstico completo por semestre para medir evolução e identificar novos gargalos.",
        cta: null,
      },
      {
        q: "Diagnóstico empresarial é a mesma coisa que planejamento estratégico?",
        a: "Não. O diagnóstico analisa onde você está. O planejamento estratégico define onde você quer chegar e como. O diagnóstico é o ponto de partida que alimenta o planejamento — sem diagnóstico, o planejamento é construído sobre premissas, não dados.",
        cta: null,
      },
      {
        q: "Quais dimensões um diagnóstico empresarial completo deve analisar?",
        a: "Um diagnóstico completo analisa pelo menos 5 dimensões: comercial (vendas, funil, conversão), marketing (geração de demanda, posicionamento), financeiro (margem, fluxo de caixa, precificação), operação (processos, qualidade, produtividade) e gestão (liderança, cultura, estratégia).",
        cta: null,
      },
      {
        q: "O que é benchmarking empresarial e por que ele importa no diagnóstico?",
        a: "Benchmarking é a comparação dos indicadores da sua empresa com as referências do mercado. Sem ele, você não sabe se sua taxa de conversão de 10% é boa ou ruim. O benchmarking transforma números em contexto — e contexto em decisão.",
        cta: { label: "Ver meu benchmarking", href: "https://app.grupov3x.com.br" },
      },
      {
        q: "Quem deve participar do diagnóstico empresarial?",
        a: "O dono deve responder o diagnóstico — ele tem visão de todas as dimensões. Para diagnósticos mais profundos, vale incluir líderes de área para comparar a percepção do dono com a do time. Divergências grandes são, por si só, um diagnóstico.",
        cta: null,
      },
      {
        q: "Diagnóstico empresarial funciona para empresa de qualquer porte?",
        a: "Sim. A metodologia das 5 dimensões se aplica a empresas de R$ 50k a R$ 5M/mês de faturamento — o que muda é o benchmark de referência e o nível de maturidade esperado por dimensão.",
        cta: null,
      },
    ],
  },
  {
    category: "V3X Diagnóstico — Produto",
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
        a: "Starter (R$ 147/mês — 1 diagnóstico por mês), Growth (R$ 497/mês — 2 diagnósticos por mês, mais popular) e Scale (R$ 797/mês — diagnósticos ilimitados + usuários ilimitados). 7 dias grátis — sem cartão de crédito.",
        cta: { label: "Ver planos completos", href: "https://app.grupov3x.com.br" },
      },
      {
        q: "Precisa de cartão de crédito para o período grátis?",
        a: "Não. O período de 7 dias grátis não exige cartão de crédito. Você só precisa informar um meio de pagamento ao assinar um dos planos.",
        cta: null,
      },
      {
        q: "O V3X Diagnóstico funciona para todos os segmentos?",
        a: "Sim. A metodologia das 5 dimensões se aplica a qualquer tipo de empresa — serviços, varejo, indústria, tecnologia. O benchmarking é ajustado por segmento, então você compara com empresas similares à sua.",
        cta: null,
      },
      {
        q: "O que é o score de 0 a 100 do diagnóstico?",
        a: "O score representa o nível de maturidade da sua empresa em cada dimensão. Abaixo de 40: crítico. De 40 a 60: em desenvolvimento. De 60 a 80: saudável. Acima de 80: excelência — acima do benchmark de mercado.",
        cta: null,
      },
      {
        q: "Em quanto tempo vejo resultado após o diagnóstico?",
        a: "O diagnóstico é imediato — relatório gerado na conclusão. Os resultados práticos dependem das ações implementadas: melhorias de processo e comercial geralmente aparecem em 30-60 dias; mudanças financeiras estruturais em 60-120 dias.",
        cta: null,
      },
      {
        q: "Posso compartilhar o relatório com meu sócio ou time?",
        a: "Sim. O relatório pode ser exportado e compartilhado. No plano Scale, múltiplos usuários têm acesso diretamente na plataforma.",
        cta: null,
      },
    ],
  },
  {
    category: "CRM e Gestão Comercial",
    questions: [
      {
        q: "O que é CRM e por que minha empresa precisa de um?",
        a: "CRM centraliza todo o relacionamento com prospects e clientes — histórico de contatos, etapa do funil, próximos passos. Sem CRM, leads são esquecidos, o histórico some quando o vendedor sai e a gestão não tem visibilidade do pipeline. Com CRM, tudo isso se resolve.",
        cta: { label: "Conhecer o V3X Pipeline", href: "https://pipeline.grupov3x.com.br" },
      },
      {
        q: "A partir de quantos leads faz sentido implementar um CRM?",
        a: "A partir de 20-30 leads simultâneos com mais de uma pessoa vendendo. Abaixo disso, uma planilha pode ser suficiente. Acima disso, sem CRM você perde leads, histórico e visibilidade de pipeline.",
        cta: null,
      },
      {
        q: "Qual a diferença entre funil de vendas e pipeline?",
        a: "Funil de vendas é o processo — a sequência de etapas que um prospect percorre. Pipeline é o estado atual — onde estão as oportunidades nesse processo agora. Funil é o mapa; pipeline é onde os carros estão.",
        cta: null,
      },
      {
        q: "Como aumentar a taxa de conversão de leads?",
        a: "As principais alavancas: (1) qualificar melhor antes de entrar no processo, (2) estruturar uma cadência de follow-up com valor em cada contato, (3) trabalhar as objeções mais comuns com respostas preparadas, (4) melhorar a proposta para conectar com o problema específico do cliente.",
        cta: null,
      },
      {
        q: "Como calcular a taxa de conversão comercial?",
        a: "Taxa de conversão = (Número de fechamentos / Número de leads) × 100. Para análise mais profunda, calcule por etapa do funil: lead→qualificado, qualificado→proposta, proposta→fechamento. Cada etapa revela onde está o gargalo.",
        cta: null,
      },
      {
        q: "Quantos follow-ups devo fazer antes de desistir de um lead?",
        a: "Em vendas B2B de médio/alto ticket: 7-10 contatos em 30-45 dias. Em B2C de ticket menor: 5-6 em 15 dias. O importante é ter valor em cada contato — não repetir 'só verificando se você viu' várias vezes.",
        cta: null,
      },
      {
        q: "Como estruturar o onboarding de um novo vendedor?",
        a: "Semana 1: imersão no produto. Semana 2: processo comercial e CRM. Semana 3: shadowing (acompanha vendas reais). Semana 4: vendas supervisionadas com feedback imediato. Meta dos 30-90 dias clara desde o primeiro dia.",
        cta: null,
      },
    ],
  },
  {
    category: "V3X Pipeline — Produto",
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
      {
        q: "O V3X Pipeline tem aplicativo mobile?",
        a: "O V3X Pipeline é acessível pelo navegador mobile com experiência otimizada para celular. App nativo está no roadmap de desenvolvimento.",
        cta: null,
      },
      {
        q: "É possível importar leads de uma planilha para o V3X Pipeline?",
        a: "Sim. O V3X Pipeline suporta importação de leads via CSV, facilitando a migração de planilhas ou de outros CRMs.",
        cta: { label: "Começar grátis", href: "https://pipeline.grupov3x.com.br" },
      },
      {
        q: "O V3X Pipeline tem alertas automáticos de follow-up?",
        a: "Sim. Leads sem atividade por um período configurável são sinalizados automaticamente. O sistema identifica oportunidades em risco de serem esquecidas antes que o prazo passe.",
        cta: null,
      },
    ],
  },
  {
    category: "Vendas e Conversão",
    questions: [
      {
        q: "Qual é a taxa de conversão média para vendas B2B?",
        a: "Para vendas B2B consultivas de médio/alto ticket: 15-25% de conversão lead→cliente é considerado saudável. Para B2B transacional: 10-20%. Abaixo disso, o processo comercial tem oportunidades claras de melhoria.",
        cta: null,
      },
      {
        q: "Como reduzir o ciclo de vendas?",
        a: "As principais alavancas: (1) qualificar leads melhor antes de entrar no processo, (2) apresentar valor mais claramente para reduzir dúvidas, (3) criar urgência real (não artificial), (4) follow-up mais estruturado para evitar leads esfriando.",
        cta: null,
      },
      {
        q: "Como lidar com a objeção 'está caro'?",
        a: "Em 80% dos casos, 'está caro' é objeção de valor, não de preço. O cliente não entendeu completamente o resultado que vai obter. A resposta correta não é desconto — é clareza de valor: qual é o custo do problema que você está resolvendo? Qual é o retorno esperado?",
        cta: null,
      },
      {
        q: "Como aumentar o ticket médio sem perder clientes?",
        a: "Estratégias que funcionam: criar uma opção premium (que ancora o preço do produto original), oferecer upsell antes do fechamento, cross-sell com produtos complementares, e eliminar desconto como resposta automática a objeções de preço.",
        cta: null,
      },
      {
        q: "O que é CAC e qual é o ideal para meu negócio?",
        a: "CAC é o Custo de Aquisição de Cliente: total investido em marketing e vendas dividido pelo número de novos clientes. O CAC ideal é relativo ao LTV: a regra geral é LTV/CAC ≥ 3. Abaixo disso, o modelo tende a ser insustentável.",
        cta: null,
      },
      {
        q: "Como calcular o LTV da minha empresa?",
        a: "Para recorrência: LTV = ticket médio mensal × tempo médio de permanência (em meses). Para transacional: LTV = ticket médio × frequência de compra × tempo de relacionamento. O LTV deve ser comparado ao CAC para avaliar a saúde do modelo de aquisição.",
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
        q: "Como delegar sem perder qualidade?",
        a: "Delegação eficiente tem 3 componentes: (1) critério claro — o responsável sabe exatamente o que é esperado e como avaliar o resultado, (2) autonomia real — pode decidir o como dentro do critério, (3) accountability — é cobrado pelo resultado, não pelo processo.",
        cta: null,
      },
      {
        q: "Como criar processos que o time realmente segue?",
        a: "Processo criado só pelo dono tem resistência. Envolva quem executa na criação, mostre o porquê de cada etapa, documente no formato mais fácil de seguir (checklist, vídeo, texto), e verifique regularmente se está sendo seguido — não como vigilância, mas como controle de qualidade.",
        cta: null,
      },
      {
        q: "Qual é o principal erro de gestão que impede o crescimento?",
        a: "Centralização. Quando o dono precisa ser a última voz em toda decisão, ele cria um gargalo que limita velocidade, escala e qualidade de vida. A solução é criar critérios claros de decisão e delegar com accountability real.",
        cta: null,
      },
      {
        q: "Com que frequência fazer reuniões de gestão?",
        a: "Reunião de time semanal (20-30 min): o que avançou, o que travou, prioridade da semana. One-on-one com cada direto: semanal (30 min). Reunião de resultados: mensal. Planning estratégico: trimestral. Cada ritual com pauta definida e output claro.",
        cta: null,
      },
    ],
  },
  {
    category: "Gestão Financeira",
    questions: [
      {
        q: "Como calcular a margem de lucro real da empresa?",
        a: "Margem líquida real = Lucro líquido / Faturamento bruto. Atenção: o pró-labore do dono é custo — empresa que não registra o pró-labore está inflando a margem artificialmente. Todos os custos (salários, aluguel, impostos, ferramentas, provisões) devem entrar no cálculo.",
        cta: { label: "Analisar minha empresa", href: "https://app.grupov3x.com.br" },
      },
      {
        q: "Qual é uma boa margem líquida para empresa de serviços?",
        a: "Depende do segmento. Referências gerais: serviços B2B: 20-35%, varejo: 5-15%, tecnologia/SaaS: 25-50%. Sempre compare com benchmarks do seu segmento específico — médias gerais têm pouco valor prático.",
        cta: null,
      },
      {
        q: "Como evitar crise de fluxo de caixa?",
        a: "Projete o fluxo de caixa para os próximos 60-90 dias. Saldo negativo projetado em qualquer ponto é sinal de alerta — e você tem tempo para agir antes do problema chegar. Antecipe recebimentos, negocie prazos com fornecedores, reduza saídas não essenciais.",
        cta: null,
      },
      {
        q: "Como saber se meu preço está correto?",
        a: "Calcule o preço mínimo que cobre todos os custos (incluindo impostos, inadimplência esperada, custo de atendimento pós-venda e margem desejada). Se você está cobrando abaixo disso, está dando prejuízo em cada venda. Compare também com o valor percebido pelo cliente.",
        cta: null,
      },
      {
        q: "O que é capital de giro e por que ele importa?",
        a: "Capital de giro é o dinheiro necessário para a empresa operar enquanto aguarda o recebimento dos clientes. Falta de capital de giro é a principal causa de crise em empresas saudáveis que estão crescendo — o crescimento consome mais caixa antes de gerar mais receita.",
        cta: null,
      },
      {
        q: "Como reduzir inadimplência?",
        a: "Prevenção: análise de crédito, contratos claros, lembrete preventivo antes do vencimento. Ação após vencimento: contato no dia 1-5 (amigável), ligação no dia 5-15 (renegociação), negativação após 30 dias. Processo estruturado reduz inadimplência 40-60% em relação ao processo informal.",
        cta: null,
      },
    ],
  },
  {
    category: "Processos e Operação",
    questions: [
      {
        q: "Por que documentar processos empresariais?",
        a: "Processo documentado é a memória operacional da empresa. Permite que qualquer pessoa competente execute com qualidade consistente, reduz a dependência de pessoas específicas, acelera o treinamento de novos colaboradores e é o pré-requisito para escalar sem caos.",
        cta: null,
      },
      {
        q: "Como começar a documentar processos sem parar a operação?",
        a: "Comece pelos 3 processos mais críticos e mais frequentes. Dedique 2-3 horas por semana — não tente fazer tudo de uma vez. O melhor método: observe quem executa com melhor resultado e documente o que essa pessoa faz.",
        cta: null,
      },
      {
        q: "O que é padronização de processos?",
        a: "Padronização é garantir que o processo é executado da mesma forma — com a mesma qualidade — independentemente de quem executa. Não é rigidez, é consistência no que importa. Dentro do processo padronizado, julgamento e adaptação ainda têm lugar.",
        cta: null,
      },
      {
        q: "Como medir a eficiência operacional?",
        a: "Indicadores-chave: taxa de retrabalho (% das entregas que precisam de correção), NPS do cliente, ciclo médio de entrega, produtividade por colaborador (faturamento/headcount). Baseline → medir → melhorar → medir novamente.",
        cta: null,
      },
      {
        q: "Empresa pequena precisa de processos documentados?",
        a: "Especialmente a empresa pequena. Com 3-5 pessoas, o processo na cabeça do dono parece suficiente. Com 10-15, já não funciona mais — e construir processos em meio ao crescimento acelerado é muito mais difícil que construir antes.",
        cta: null,
      },
    ],
  },
  {
    category: "Equipes e Liderança",
    questions: [
      {
        q: "Como criar uma equipe que funciona sem o dono?",
        a: "Três ingredientes: (1) processos documentados que qualquer pessoa competente pode seguir, (2) líderes intermediários com autonomia real e accountability pelo resultado, (3) cultura de clareza de expectativas e feedback contínuo.",
        cta: null,
      },
      {
        q: "Como lidar com baixo desempenho no time?",
        a: "Passo 1: verifique se é problema de clareza (a pessoa sabe o que é esperado?). Passo 2: feedback direto e específico sobre o que precisa mudar. Passo 3: se após clareza e feedback o desempenho não melhora, é decisão de desligamento. Tolerar mediocridade é injusto com quem performa bem.",
        cta: null,
      },
      {
        q: "Como definir metas para o time comercial?",
        a: "Meta eficiente: baseada no histórico + capacidade do time (não no desejo). Com indicadores líderes (atividades que levam ao resultado: reuniões, propostas, follow-ups) e lagging (resultado: faturamento, clientes novos). Com comissão progressiva que incentiva superar a meta.",
        cta: null,
      },
      {
        q: "Quando contratar um gerente ou diretor?",
        a: "Quando você, como dono, não consegue mais ser o líder de todas as equipes com a qualidade necessária para o crescimento — tipicamente entre R$ 500k e R$ 2M/mês. O critério não é o faturamento, mas a capacidade de atenção: quando você está sendo o gargalo de gestão.",
        cta: null,
      },
      {
        q: "Como criar cultura de alta performance?",
        a: "Clareza de expectativas (todos sabem o que é esperado), feedback contínuo (não só quando está errado), reconhecimento público do que está certo, confronto direto do que está errado, e o dono como exemplo número um da cultura que quer ver.",
        cta: null,
      },
    ],
  },
  {
    category: "Tecnologia e IA",
    questions: [
      {
        q: "O que é possível automatizar em uma empresa de médio porte?",
        a: "Sequência de follow-up comercial, notificações de inadimplência, emissão de NF após pagamento, relatórios periódicos, onboarding de clientes, alertas de renovação de contrato. Regra: qualquer processo repetitivo, baseado em regras, com alta frequência é candidato à automação.",
        cta: null,
      },
      {
        q: "Como usar IA de forma prática na empresa?",
        a: "Casos de uso com ROI rápido: rascunhos de email e proposta, transcrição de reuniões, análise de dados de vendas, chatbot para FAQ de clientes, criação de conteúdo de marketing. Comece com 1-2 casos de uso reais, meça o tempo economizado, documente o melhor prompt e treine o time.",
        cta: null,
      },
      {
        q: "CRM e ERP são a mesma coisa?",
        a: "Não. CRM foca no relacionamento com clientes e no processo comercial. ERP integra todos os processos da empresa (financeiro, estoque, RH, compras). Para PMEs de até R$ 2M/mês, um CRM + uma ferramenta financeira resolve bem — ERP completo geralmente é necessário acima disso.",
        cta: null,
      },
      {
        q: "Qual é o ROI de implementar um CRM?",
        a: "Com adoção correta, melhoria de 2-5 pontos percentuais na taxa de conversão é comum em 60-90 dias. Para um time com 3 vendedores e ticket médio de R$ 5.000, 3 pontos de conversão = R$ 15.000/mês de receita adicional. O CRM se paga em semanas.",
        cta: { label: "Conhecer o V3X Pipeline", href: "https://pipeline.grupov3x.com.br" },
      },
    ],
  },
  {
    category: "Escalabilidade",
    questions: [
      {
        q: "O que é uma empresa escalável?",
        a: "Uma empresa escalável consegue aumentar o faturamento sem aumentar os custos na mesma proporção. Isso exige: processos documentados e executáveis por qualquer pessoa, tecnologia que multiplica capacidade, time que funciona sem microgestão e modelo financeiro com margem que melhora com o volume.",
        cta: { label: "Fazer meu diagnóstico", href: "https://app.grupov3x.com.br" },
      },
      {
        q: "Quais são os sinais de que minha empresa não está escalável?",
        a: "Quando você tira férias, a empresa trava. Para dobrar o faturamento, você precisaria dobrar o time. A margem cai quando o faturamento cresce. Toda decisão precisa do dono. Qualquer saída de pessoa-chave é uma crise operacional.",
        cta: null,
      },
      {
        q: "Quando devo começar a preparar a empresa para escalar?",
        a: "Quando você está a 60-70% da sua capacidade máxima atual. Preparar a estrutura no momento da crise de crescimento é muito mais caro e difícil do que antecipá-la. Estrutura de escala precisa ser construída antes de ser necessária.",
        cta: null,
      },
      {
        q: "Preciso de aporte externo para escalar?",
        a: "Não necessariamente. A maioria das PMEs brasileiras escala com autofinanciamento — usando o lucro operacional para investir em estrutura gradualmente. Aporte externo acelera a escala mas não é pré-requisito. O pré-requisito é margem positiva e estrutura bem construída.",
        cta: null,
      },
    ],
  },
  {
    category: "Planos e Pagamentos",
    questions: [
      {
        q: "Qual a diferença entre os planos Starter, Growth e Scale?",
        a: "Starter (R$ 147/mês): 1 diagnóstico por mês. Growth (R$ 497/mês): 2 diagnósticos por mês, histórico comparativo, mais popular para acompanhamento de evolução. Scale (R$ 797/mês): diagnósticos ilimitados + usuários ilimitados, ideal para times e empresas com múltiplas unidades.",
        cta: { label: "Ver todos os planos", href: "https://app.grupov3x.com.br" },
      },
      {
        q: "Existe contrato de fidelidade?",
        a: "Não. Todos os planos são mensais, sem contrato de fidelidade. Você pode cancelar quando quiser diretamente pelo painel.",
        cta: null,
      },
      {
        q: "Quais são as formas de pagamento aceitas?",
        a: "Cartão de crédito (todas as bandeiras), PIX e boleto bancário. O pagamento é processado de forma segura.",
        cta: null,
      },
      {
        q: "Posso mudar de plano a qualquer momento?",
        a: "Sim. Upgrade e downgrade de plano podem ser feitos a qualquer momento pelo painel. O ajuste de cobrança é feito proporcionalmente ao período restante do ciclo.",
        cta: null,
      },
      {
        q: "Existe desconto para contratação anual?",
        a: "Sim. Ao optar pelo plano anual, você tem desconto equivalente a 2 meses gratuitos em relação ao pagamento mensal. Entre em contato com nosso time para detalhes.",
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
        <div className="border-b border-[#2A2A2A] pb-10 md:pb-12 pt-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <ScrollReveal>
              <nav className="flex items-center gap-2 text-xs text-[#F3F3F3]/40 font-[family-name:var(--font-inter)] mb-6">
                <Link href="/" className="hover:text-[#F5C242] transition-colors">V3X</Link>
                <span>/</span>
                <span className="text-[#F3F3F3]/70">FAQ</span>
              </nav>
              <p className="text-xs font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.2em] uppercase text-[#F5C242] mb-3">
                Central de Ajuda
              </p>
              <h1 className="font-[family-name:var(--font-anton)] text-4xl sm:text-5xl text-white tracking-wide">
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

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16 flex flex-col gap-12 md:gap-16">
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
