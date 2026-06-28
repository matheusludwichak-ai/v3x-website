export interface CalcField {
  key: string;
  label: string;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  hint?: string;
  step?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
}

export interface CalcResult {
  label: string;
  value: string;
  highlight?: boolean;
  positive?: boolean;
  negative?: boolean;
}

export interface CalcConfig {
  fields: CalcField[];
  calculate: (v: Record<string, number>) => CalcResult[] | null;
  interpret: (v: Record<string, number>, results: CalcResult[]) => string;
}

// ─── helpers ────────────────────────────────────────────────────────────────

function brl(n: number): string {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 2 });
}

function pct(n: number, decimals = 1): string {
  return n.toFixed(decimals).replace(".", ",") + "%";
}

function num(n: number, decimals = 0): string {
  return n.toLocaleString("pt-BR", { maximumFractionDigits: decimals });
}

// ─── configs ────────────────────────────────────────────────────────────────

export const calculadoras: Record<string, CalcConfig> = {

  "calculadora-roi": {
    fields: [
      { key: "investimento", label: "Valor Investido", prefix: "R$", placeholder: "10.000", min: 0 },
      { key: "retorno", label: "Retorno Obtido", prefix: "R$", placeholder: "25.000", hint: "Total gerado pelo investimento (receita, não lucro)", min: 0 },
    ],
    calculate(v) {
      if (!v.investimento || v.investimento === 0) return null;
      const lucro = v.retorno - v.investimento;
      const roi = (lucro / v.investimento) * 100;
      return [
        { label: "ROI", value: pct(roi, 1), highlight: true, positive: roi > 0, negative: roi <= 0 },
        { label: "Retorno Líquido", value: brl(lucro), positive: lucro > 0, negative: lucro < 0 },
        { label: "Para cada R$ 1 investido", value: `R$ ${(v.retorno / v.investimento).toFixed(2).replace(".", ",")}` },
      ];
    },
    interpret(v, results) {
      if (!v.investimento) return "";
      const roi = ((v.retorno - v.investimento) / v.investimento) * 100;
      if (roi >= 200) return "ROI acima de 200%: retorno excepcional. Escale esse investimento.";
      if (roi >= 100) return "ROI acima de 100%: o investimento mais que dobrou. Resultado sólido.";
      if (roi >= 30) return "ROI positivo e acima da média. Valide a consistência antes de escalar.";
      if (roi > 0) return "ROI positivo, mas abaixo de 30%. Avalie se há formas de reduzir o custo do investimento.";
      if (roi === 0) return "Ponto de equilíbrio: o investimento se pagou, mas não gerou lucro.";
      return "ROI negativo: o retorno não cobriu o investimento. Reveja a estratégia antes de repetir.";
    },
  },

  "calculadora-cac": {
    fields: [
      { key: "custoMarketing", label: "Custo de Marketing", prefix: "R$", placeholder: "5.000", hint: "Tráfego pago, agência, ferramentas, conteúdo", min: 0 },
      { key: "custoVendas", label: "Custo de Vendas", prefix: "R$", placeholder: "8.000", hint: "Salários, comissões, CRM, treinamentos", min: 0 },
      { key: "clientesAdquiridos", label: "Clientes Novos no Período", placeholder: "12", hint: "Quantidade de clientes fechados no mês/trimestre", min: 1 },
    ],
    calculate(v) {
      if (!v.clientesAdquiridos || v.clientesAdquiridos === 0) return null;
      const totalInvestido = v.custoMarketing + v.custoVendas;
      const cac = totalInvestido / v.clientesAdquiridos;
      return [
        { label: "CAC", value: brl(cac), highlight: true },
        { label: "Total Investido", value: brl(totalInvestido) },
        { label: "Custo de Marketing por Cliente", value: brl(v.custoMarketing / v.clientesAdquiridos) },
        { label: "Custo de Vendas por Cliente", value: brl(v.custoVendas / v.clientesAdquiridos) },
      ];
    },
    interpret(v, results) {
      if (!v.clientesAdquiridos) return "";
      const cac = (v.custoMarketing + v.custoVendas) / v.clientesAdquiridos;
      if (cac < 300) return "CAC abaixo de R$ 300: eficiência alta na aquisição. Verifique se não está deixando de investir em canais escaláveis.";
      if (cac < 1500) return "CAC moderado. Compare com o LTV dos clientes: o ideal é LTV ≥ 3× o CAC.";
      if (cac < 5000) return "CAC elevado. Avalie quais canais têm melhor retorno e reduza os ineficientes.";
      return "CAC muito alto. Esse nível exige ticket médio ou LTV muito altos para sustentar o crescimento.";
    },
  },

  "calculadora-ticket-medio": {
    fields: [
      { key: "receitaTotal", label: "Receita Total do Período", prefix: "R$", placeholder: "150.000", min: 0 },
      { key: "numeroVendas", label: "Número de Vendas/Contratos", placeholder: "28", min: 1 },
    ],
    calculate(v) {
      if (!v.numeroVendas || v.numeroVendas === 0) return null;
      const ticket = v.receitaTotal / v.numeroVendas;
      return [
        { label: "Ticket Médio", value: brl(ticket), highlight: true },
        { label: "Para dobrar a receita mantendo vendas", value: `Ticket necessário: ${brl(ticket * 2)}` },
        { label: "Para dobrar a receita mantendo ticket", value: `Vendas necessárias: ${num(v.numeroVendas * 2)}` },
      ];
    },
    interpret(v, results) {
      if (!v.numeroVendas) return "";
      const ticket = v.receitaTotal / v.numeroVendas;
      if (ticket >= 10000) return "Ticket alto (acima de R$ 10k): ciclo de venda tende a ser maior. Invista em processo consultivo e follow-up estruturado.";
      if (ticket >= 2000) return "Ticket intermediário. Pequenos aumentos de ticket têm grande impacto no faturamento sem aumentar a operação.";
      if (ticket >= 500) return "Ticket moderado. Avalie oportunidades de upsell, bundling ou upgrade para elevar o valor médio por cliente.";
      return "Ticket baixo. Considere revisar a oferta, agregar valor ou criar planos de maior valor para reduzir a dependência de volume.";
    },
  },

  "calculadora-conversao": {
    fields: [
      { key: "leadsGerados", label: "Leads no Período", placeholder: "200", hint: "Total de leads que entraram no funil", min: 1 },
      { key: "vendasFechadas", label: "Vendas Fechadas", placeholder: "18", hint: "Número de contratos/pedidos fechados", min: 0 },
    ],
    calculate(v) {
      if (!v.leadsGerados || v.leadsGerados === 0) return null;
      const taxa = (v.vendasFechadas / v.leadsGerados) * 100;
      return [
        { label: "Taxa de Conversão", value: pct(taxa, 1), highlight: true, positive: taxa >= 10, negative: taxa < 3 },
        { label: "Leads não convertidos", value: num(v.leadsGerados - v.vendasFechadas) },
        { label: "Para +10% de conversão, ganho de vendas", value: `+${num(v.leadsGerados * 0.1)} vendas` },
      ];
    },
    interpret(v, results) {
      if (!v.leadsGerados) return "";
      const taxa = (v.vendasFechadas / v.leadsGerados) * 100;
      if (taxa >= 20) return "Conversão acima de 20%: excelente eficiência comercial. Mantenha o volume de leads e proteja o processo.";
      if (taxa >= 10) return "Conversão sólida (10-20%). Há espaço para melhorar com qualificação mais precisa e follow-up estruturado.";
      if (taxa >= 5) return "Conversão na média do mercado (5-10%). Mapeie cada etapa do funil para encontrar onde mais leads estão sendo perdidos.";
      if (taxa >= 2) return "Conversão baixa (2-5%). Revise qualidade dos leads, processo de qualificação e abordagem comercial.";
      return "Conversão abaixo de 2%: funil com vazamento crítico. Prioridade máxima para diagnóstico do processo comercial.";
    },
  },

  "calculadora-comissao": {
    fields: [
      { key: "valorVenda", label: "Valor da Venda", prefix: "R$", placeholder: "8.500", min: 0 },
      { key: "percentualComissao", label: "Comissão do Vendedor", suffix: "%", placeholder: "8", min: 0, max: 100 },
      { key: "impostos", label: "Impostos sobre Faturamento", suffix: "%", placeholder: "12", hint: "Alíquota efetiva do regime tributário", min: 0, max: 100 },
    ],
    calculate(v) {
      if (!v.valorVenda) return null;
      const comissao = v.valorVenda * (v.percentualComissao / 100);
      const impostos = v.valorVenda * (v.impostos / 100);
      const liquidoEmpresa = v.valorVenda - comissao - impostos;
      return [
        { label: "Comissão do Vendedor", value: brl(comissao), highlight: true },
        { label: "Impostos", value: brl(impostos) },
        { label: "Líquido para a Empresa", value: brl(liquidoEmpresa), positive: liquidoEmpresa > 0 },
        { label: "Custo total da venda", value: pct(((comissao + impostos) / v.valorVenda) * 100, 1) },
      ];
    },
    interpret(v, results) {
      if (!v.valorVenda) return "";
      const totalCusto = v.percentualComissao + v.impostos;
      if (totalCusto > 60) return "Atenção: mais de 60% da venda vai para comissão e impostos. Revise a estrutura de custos variáveis.";
      if (totalCusto > 40) return "Custo variável alto (acima de 40%). Inclua custos fixos rateados para ver a margem real por venda.";
      if (totalCusto > 25) return "Custo variável moderado. Combine com os custos fixos para calcular a margem de contribuição real.";
      return "Estrutura de custo variável controlada. Inclua custos fixos para calcular o break-even de vendas.";
    },
  },

  "calculadora-meta-comercial": {
    fields: [
      { key: "metaReceita", label: "Meta de Receita", prefix: "R$", placeholder: "300.000", min: 0 },
      { key: "ticketMedio", label: "Ticket Médio Atual", prefix: "R$", placeholder: "5.500", min: 1 },
      { key: "taxaConversao", label: "Taxa de Conversão", suffix: "%", placeholder: "12", min: 0.1, max: 100 },
    ],
    calculate(v) {
      if (!v.ticketMedio || !v.taxaConversao) return null;
      const vendasNecessarias = Math.ceil(v.metaReceita / v.ticketMedio);
      const leadsNecessarios = Math.ceil(vendasNecessarias / (v.taxaConversao / 100));
      const leadsSemanais = Math.ceil(leadsNecessarios / 4.3);
      const vendasDiarias = (vendasNecessarias / 22).toFixed(1).replace(".", ",");
      return [
        { label: "Vendas Necessárias no Mês", value: num(vendasNecessarias), highlight: true },
        { label: "Leads Necessários no Mês", value: num(leadsNecessarios) },
        { label: "Leads por Semana", value: num(leadsSemanais) },
        { label: "Vendas por Dia Útil", value: vendasDiarias },
      ];
    },
    interpret(v, results) {
      if (!v.ticketMedio || !v.taxaConversao) return "";
      const vendasNecessarias = Math.ceil(v.metaReceita / v.ticketMedio);
      const leadsNecessarios = Math.ceil(vendasNecessarias / (v.taxaConversao / 100));
      return `Para atingir ${brl(v.metaReceita)} você precisa de ${num(leadsNecessarios)} leads qualificados. Se a geração atual estiver abaixo disso, ajuste o marketing ou revise o ticket médio e a conversão antes de subir a meta.`;
    },
  },

  "calculadora-leads-necessarios": {
    fields: [
      { key: "metaVendas", label: "Meta de Vendas no Mês", placeholder: "25", hint: "Número de contratos/pedidos que quer fechar", min: 1 },
      { key: "taxaConversao", label: "Taxa de Conversão", suffix: "%", placeholder: "10", min: 0.1, max: 100 },
    ],
    calculate(v) {
      if (!v.metaVendas || !v.taxaConversao) return null;
      const leadsNecessarios = Math.ceil(v.metaVendas / (v.taxaConversao / 100));
      const por_semana = Math.ceil(leadsNecessarios / 4.3);
      const por_dia = Math.ceil(leadsNecessarios / 22);
      return [
        { label: "Leads Necessários no Mês", value: num(leadsNecessarios), highlight: true },
        { label: "Leads por Semana", value: num(por_semana) },
        { label: "Leads por Dia Útil", value: num(por_dia) },
        { label: "Taxa de Descarte Esperada", value: pct(100 - v.taxaConversao, 0) },
      ];
    },
    interpret(v, results) {
      if (!v.metaVendas || !v.taxaConversao) return "";
      const leads = Math.ceil(v.metaVendas / (v.taxaConversao / 100));
      const porDia = Math.ceil(leads / 22);
      return `Com conversão de ${pct(v.taxaConversao, 1)}, você precisa de ${num(leads)} leads para fechar ${num(v.metaVendas)} vendas — ou seja, ${num(porDia)} leads novos por dia útil. Se o canal atual não comporta esse volume, reveja a taxa de conversão ou o canal de geração.`;
    },
  },

  "calculadora-pipeline-comercial": {
    fields: [
      { key: "leadsNoPipeline", label: "Leads Ativos no Pipeline", placeholder: "45", hint: "Oportunidades em andamento agora", min: 0 },
      { key: "taxaConversao", label: "Taxa de Conversão Histórica", suffix: "%", placeholder: "15", min: 0.1, max: 100 },
      { key: "ticketMedio", label: "Ticket Médio", prefix: "R$", placeholder: "6.000", min: 0 },
    ],
    calculate(v) {
      if (!v.leadsNoPipeline || !v.taxaConversao || !v.ticketMedio) return null;
      const vendasPrevistas = v.leadsNoPipeline * (v.taxaConversao / 100);
      const receitaPrevista = vendasPrevistas * v.ticketMedio;
      const leadsPerdidos = v.leadsNoPipeline * (1 - v.taxaConversao / 100);
      return [
        { label: "Receita Prevista", value: brl(receitaPrevista), highlight: true },
        { label: "Vendas Previstas", value: num(vendasPrevistas, 1) },
        { label: "Leads que Não Vão Converter", value: num(leadsPerdidos, 0) },
        { label: "Valor Médio de Cada Lead", value: brl(receitaPrevista / v.leadsNoPipeline) },
      ];
    },
    interpret(v, results) {
      if (!v.leadsNoPipeline || !v.taxaConversao || !v.ticketMedio) return "";
      const vendas = v.leadsNoPipeline * (v.taxaConversao / 100);
      const receita = vendas * v.ticketMedio;
      return `Com ${num(v.leadsNoPipeline)} leads ativos e ${pct(v.taxaConversao, 1)} de conversão, o pipeline entrega ${brl(receita)} de receita prevista. Se isso está abaixo da meta, ou você precisa de mais leads no topo ou precisa melhorar a conversão.`;
    },
  },

  "calculadora-break-even": {
    fields: [
      { key: "custosFixos", label: "Custos Fixos Mensais", prefix: "R$", placeholder: "25.000", hint: "Aluguel, salários, serviços, pró-labore...", min: 0 },
      { key: "precoVenda", label: "Preço de Venda Unitário", prefix: "R$", placeholder: "350", min: 1 },
      { key: "custoVariavel", label: "Custo Variável por Unidade", prefix: "R$", placeholder: "120", hint: "Insumo, comissão, frete por unidade", min: 0 },
    ],
    calculate(v) {
      if (!v.precoVenda || !v.custosFixos) return null;
      const margemContribuicao = v.precoVenda - v.custoVariavel;
      if (margemContribuicao <= 0) return null;
      const breakEvenUnidades = Math.ceil(v.custosFixos / margemContribuicao);
      const breakEvenReceita = breakEvenUnidades * v.precoVenda;
      const margemPerc = (margemContribuicao / v.precoVenda) * 100;
      return [
        { label: "Ponto de Equilíbrio (Unidades)", value: num(breakEvenUnidades), highlight: true },
        { label: "Receita de Equilíbrio", value: brl(breakEvenReceita) },
        { label: "Margem de Contribuição por Unidade", value: brl(margemContribuicao) },
        { label: "Margem de Contribuição %", value: pct(margemPerc, 1) },
      ];
    },
    interpret(v, results) {
      if (!v.precoVenda || !v.custosFixos) return "";
      const mc = v.precoVenda - v.custoVariavel;
      if (mc <= 0) return "Custo variável maior que o preço de venda: cada unidade vendida gera prejuízo. Reveja o preço ou o custo urgentemente.";
      const be = Math.ceil(v.custosFixos / mc);
      const receita = be * v.precoVenda;
      return `Você precisa vender ${num(be)} unidades (${brl(receita)}) para cobrir todos os custos fixos. Abaixo disso, a empresa opera no prejuízo. Tudo acima do break-even vira lucro.`;
    },
  },

  "calculadora-margem-lucro": {
    fields: [
      { key: "receita", label: "Receita Total", prefix: "R$", placeholder: "120.000", min: 0 },
      { key: "custoTotal", label: "Custo Total (fixo + variável + impostos)", prefix: "R$", placeholder: "89.000", hint: "Inclua todos os custos: fixos, variáveis, impostos e pró-labore", min: 0 },
    ],
    calculate(v) {
      if (!v.receita || v.receita === 0) return null;
      const lucro = v.receita - v.custoTotal;
      const margem = (lucro / v.receita) * 100;
      const custosPerc = (v.custoTotal / v.receita) * 100;
      return [
        { label: "Margem de Lucro", value: pct(margem, 1), highlight: true, positive: margem > 0, negative: margem <= 0 },
        { label: "Lucro Líquido", value: brl(lucro), positive: lucro > 0, negative: lucro < 0 },
        { label: "Custos sobre Receita", value: pct(custosPerc, 1) },
        { label: "Lucro por R$ 100 faturado", value: `R$ ${margem.toFixed(2).replace(".", ",")}` },
      ];
    },
    interpret(v, results) {
      if (!v.receita) return "";
      const margem = ((v.receita - v.custoTotal) / v.receita) * 100;
      if (margem >= 30) return "Margem acima de 30%: excelente eficiência. Foque em escalar o volume mantendo essa estrutura de custos.";
      if (margem >= 15) return "Margem saudável (15-30%). Há espaço para crescer com segurança. Revise custos fixos para ampliar a margem.";
      if (margem >= 5) return "Margem apertada (5-15%). Qualquer redução de receita coloca a empresa no vermelho. Revise precificação e custos.";
      if (margem > 0) return "Margem muito baixa (abaixo de 5%). A empresa é lucrativa mas sem gordura para imprevistos. Ação imediata em custos ou preços.";
      return "Margem negativa: empresa operando no prejuízo. Prioridade zero para reverter esse cenário.";
    },
  },

  "calculadora-markup": {
    fields: [
      { key: "custo", label: "Custo Direto do Produto/Serviço", prefix: "R$", placeholder: "150", min: 0 },
      { key: "despesasPerc", label: "Despesas Indiretas", suffix: "%", placeholder: "25", hint: "% das despesas fixas sobre o preço de venda", min: 0, max: 99 },
      { key: "impostosPerc", label: "Impostos sobre Venda", suffix: "%", placeholder: "12", hint: "Alíquota efetiva do regime tributário", min: 0, max: 99 },
      { key: "margemDesejada", label: "Margem de Lucro Desejada", suffix: "%", placeholder: "20", hint: "Percentual que quer sobrar após todos os custos", min: 0, max: 99 },
    ],
    calculate(v) {
      const desconto = v.despesasPerc + v.impostosPerc + v.margemDesejada;
      if (desconto >= 100) return null;
      const markup = 100 / (100 - desconto);
      const precoVenda = v.custo * markup;
      const lucroUnit = precoVenda * (v.margemDesejada / 100);
      return [
        { label: "Preço de Venda Mínimo", value: brl(precoVenda), highlight: true },
        { label: "Markup", value: `${markup.toFixed(2).replace(".", ",")}×` },
        { label: "Lucro por Unidade", value: brl(lucroUnit), positive: true },
        { label: "Despesas por Unidade", value: brl(precoVenda * (v.despesasPerc / 100)) },
        { label: "Impostos por Unidade", value: brl(precoVenda * (v.impostosPerc / 100)) },
      ];
    },
    interpret(v, results) {
      const desconto = v.despesasPerc + v.impostosPerc + v.margemDesejada;
      if (desconto >= 100) return "A soma de despesas, impostos e margem ultrapassa 100%. Revise os percentuais — o preço se tornaria inviável.";
      const markup = 100 / (100 - desconto);
      const preco = v.custo * markup;
      return `Com markup de ${markup.toFixed(2).replace(".", ",")}×, o preço mínimo é ${brl(preco)}. Vender abaixo disso significa prejuízo, mesmo que o negócio pareça estar funcionando.`;
    },
  },

  "calculadora-ltv": {
    fields: [
      { key: "ticketMedio", label: "Ticket Médio por Compra", prefix: "R$", placeholder: "800", min: 0 },
      { key: "comprasPorAno", label: "Compras por Ano (por cliente)", placeholder: "4", hint: "Quantas vezes o cliente compra em média por ano", min: 0 },
      { key: "anosRetencao", label: "Anos de Retenção", placeholder: "3", hint: "Tempo médio que o cliente permanece ativo", min: 0 },
      { key: "margem", label: "Margem Bruta", suffix: "%", placeholder: "60", hint: "Margem bruta do produto ou serviço", min: 0, max: 100 },
    ],
    calculate(v) {
      if (!v.ticketMedio || !v.comprasPorAno || !v.anosRetencao) return null;
      const receitaTotal = v.ticketMedio * v.comprasPorAno * v.anosRetencao;
      const ltv = receitaTotal * (v.margem / 100);
      const ltv_cac_limite = ltv / 3;
      return [
        { label: "LTV (Lifetime Value)", value: brl(ltv), highlight: true },
        { label: "Receita Total por Cliente", value: brl(receitaTotal) },
        { label: "CAC máximo recomendado (LTV ÷ 3)", value: brl(ltv_cac_limite) },
        { label: "LTV por Ano de Retenção", value: brl(ltv / v.anosRetencao) },
      ];
    },
    interpret(v, results) {
      if (!v.ticketMedio || !v.comprasPorAno || !v.anosRetencao) return "";
      const ltv = v.ticketMedio * v.comprasPorAno * v.anosRetencao * (v.margem / 100);
      const cacMax = ltv / 3;
      return `O LTV de cada cliente é ${brl(ltv)}. Com essa referência, seu CAC não deveria ultrapassar ${brl(cacMax)} para manter a relação LTV:CAC saudável (acima de 3×). Abaixo disso, a aquisição de clientes está consumindo o lucro.`;
    },
  },

  "calculadora-churn": {
    fields: [
      { key: "clientesInicio", label: "Clientes no Início do Mês", placeholder: "180", min: 1 },
      { key: "clientesFinal", label: "Clientes no Final do Mês", placeholder: "171", hint: "Clientes ativos ao final do período", min: 0 },
      { key: "ticketMedio", label: "Ticket Médio Mensal (opcional)", prefix: "R$", placeholder: "350", hint: "Para calcular perda de receita", min: 0 },
    ],
    calculate(v) {
      if (!v.clientesInicio) return null;
      const perdidos = v.clientesInicio - v.clientesFinal;
      const churnMensal = (perdidos / v.clientesInicio) * 100;
      const clientesEm12 = v.clientesFinal * Math.pow(1 - churnMensal / 100, 11);
      const perdaReceita = v.ticketMedio ? perdidos * v.ticketMedio : null;
      const results: CalcResult[] = [
        { label: "Churn Mensal", value: pct(churnMensal, 2), highlight: true, positive: churnMensal < 2, negative: churnMensal >= 5 },
        { label: "Clientes Perdidos no Mês", value: num(Math.max(0, perdidos)) },
        { label: "Projeção em 12 meses (base atual)", value: num(Math.round(clientesEm12)) + " clientes" },
      ];
      if (perdaReceita !== null) {
        results.push({ label: "Perda de Receita Mensal", value: brl(perdaReceita), negative: perdaReceita > 0 });
      }
      return results;
    },
    interpret(v, results) {
      if (!v.clientesInicio) return "";
      const perdidos = v.clientesInicio - v.clientesFinal;
      const churn = (perdidos / v.clientesInicio) * 100;
      if (churn <= 0) return "Sem cancelamentos no período. Mantenha o NPS elevado e a recorrência estruturada.";
      if (churn < 2) return "Churn abaixo de 2%: excelente retenção. Padrão de empresas SaaS de alta performance.";
      if (churn < 5) return "Churn moderado (2-5%). Investigue os motivos de cancelamento — pequenas melhorias no onboarding e suporte reduzem muito.";
      if (churn < 10) return "Churn elevado (5-10%): você está perdendo parte significativa da base a cada mês. Prioridade para programa de retenção.";
      return "Churn crítico (acima de 10%): a empresa está perdendo quase metade da base em 6 meses. Diagnostique urgentemente os fatores de cancelamento.";
    },
  },

  "calculadora-mrr": {
    fields: [
      { key: "clientes1", label: "Clientes no Plano 1", placeholder: "40", min: 0 },
      { key: "valor1", label: "Valor Mensal do Plano 1", prefix: "R$", placeholder: "197", min: 0 },
      { key: "clientes2", label: "Clientes no Plano 2", placeholder: "25", min: 0 },
      { key: "valor2", label: "Valor Mensal do Plano 2", prefix: "R$", placeholder: "397", min: 0 },
      { key: "clientes3", label: "Clientes no Plano 3", placeholder: "10", min: 0 },
      { key: "valor3", label: "Valor Mensal do Plano 3", prefix: "R$", placeholder: "897", min: 0 },
    ],
    calculate(v) {
      const mrr1 = (v.clientes1 || 0) * (v.valor1 || 0);
      const mrr2 = (v.clientes2 || 0) * (v.valor2 || 0);
      const mrr3 = (v.clientes3 || 0) * (v.valor3 || 0);
      const mrrTotal = mrr1 + mrr2 + mrr3;
      const totalClientes = (v.clientes1 || 0) + (v.clientes2 || 0) + (v.clientes3 || 0);
      if (mrrTotal === 0) return null;
      const arppu = totalClientes > 0 ? mrrTotal / totalClientes : 0;
      return [
        { label: "MRR Total", value: brl(mrrTotal), highlight: true },
        { label: "ARR (Receita Recorrente Anual)", value: brl(mrrTotal * 12) },
        { label: "Total de Clientes Ativos", value: num(totalClientes) },
        { label: "ARPPU (Ticket Médio Mensal)", value: brl(arppu) },
        { label: "MRR do Plano 1", value: brl(mrr1) },
        { label: "MRR do Plano 2", value: brl(mrr2) },
        { label: "MRR do Plano 3", value: brl(mrr3) },
      ];
    },
    interpret(v, results) {
      const mrr = ((v.clientes1||0)*(v.valor1||0)) + ((v.clientes2||0)*(v.valor2||0)) + ((v.clientes3||0)*(v.valor3||0));
      if (mrr === 0) return "";
      const arr = mrr * 12;
      return `Seu ARR é ${brl(arr)}. Acompanhe o MRR mensalmente — crescimento de MRR acima de 10%/mês é sinal de tração forte. Queda no MRR antecipa problemas antes que apareçam no financeiro.`;
    },
  },

  "calculadora-crescimento-mensal": {
    fields: [
      { key: "receitaAnterior", label: "Receita do Mês Anterior", prefix: "R$", placeholder: "85.000", min: 0 },
      { key: "receitaAtual", label: "Receita do Mês Atual", prefix: "R$", placeholder: "97.000", min: 0 },
    ],
    calculate(v) {
      if (!v.receitaAnterior || v.receitaAnterior === 0) return null;
      const diferenca = v.receitaAtual - v.receitaAnterior;
      const crescimento = (diferenca / v.receitaAnterior) * 100;
      const projecao12m = v.receitaAnterior * Math.pow(1 + crescimento / 100, 12);
      const crescimento_anual_equiv = (Math.pow(1 + crescimento / 100, 12) - 1) * 100;
      return [
        { label: "Crescimento Mensal", value: pct(crescimento, 1), highlight: true, positive: crescimento > 0, negative: crescimento < 0 },
        { label: "Variação Absoluta", value: brl(diferenca), positive: diferenca > 0, negative: diferenca < 0 },
        { label: "Projeção em 12 meses (ritmo atual)", value: brl(projecao12m) },
        { label: "Equivalente de Crescimento Anual", value: pct(crescimento_anual_equiv, 1) },
      ];
    },
    interpret(v, results) {
      if (!v.receitaAnterior) return "";
      const crescimento = ((v.receitaAtual - v.receitaAnterior) / v.receitaAnterior) * 100;
      if (crescimento >= 20) return "Crescimento acima de 20%/mês: ritmo de alta tração. Certifique-se de que a operação consegue acompanhar e mantenha o caixa monitorado.";
      if (crescimento >= 10) return "Crescimento de 10-20%/mês: ritmo excelente para uma PME. Mantido por 12 meses, mais que dobra a receita.";
      if (crescimento >= 5) return "Crescimento de 5-10%/mês: sólido e sustentável. Acima da média do mercado para a maioria dos segmentos.";
      if (crescimento > 0) return "Crescimento positivo, mas abaixo de 5%/mês. Revise as alavancas comerciais para acelerar o ritmo.";
      if (crescimento === 0) return "Receita estável. Crescimento zero é sinal de alerta — algum crescimento é necessário só para cobrir a inflação dos custos.";
      return "Queda na receita. Investigue imediatamente: perda de clientes, queda de ticket médio ou sazonalidade?";
    },
  },

  "calculadora-capacidade-comercial": {
    fields: [
      { key: "numVendedores", label: "Número de Vendedores", placeholder: "4", min: 1 },
      { key: "leadsPorVendedor", label: "Leads por Vendedor por Mês", placeholder: "30", hint: "Capacidade máxima de atendimento de cada vendedor", min: 0 },
      { key: "taxaConversao", label: "Taxa de Conversão", suffix: "%", placeholder: "12", min: 0.1, max: 100 },
      { key: "ticketMedio", label: "Ticket Médio", prefix: "R$", placeholder: "4.500", min: 0 },
    ],
    calculate(v) {
      if (!v.numVendedores || !v.leadsPorVendedor || !v.taxaConversao || !v.ticketMedio) return null;
      const capacidadeLeads = v.numVendedores * v.leadsPorVendedor;
      const vendasPotenciais = capacidadeLeads * (v.taxaConversao / 100);
      const receitaPotencial = vendasPotenciais * v.ticketMedio;
      const receitaPorVendedor = receitaPotencial / v.numVendedores;
      return [
        { label: "Receita Potencial Mensal", value: brl(receitaPotencial), highlight: true },
        { label: "Capacidade de Leads (total)", value: num(capacidadeLeads) },
        { label: "Vendas Potenciais", value: num(vendasPotenciais, 1) },
        { label: "Receita por Vendedor", value: brl(receitaPorVendedor) },
      ];
    },
    interpret(v, results) {
      if (!v.numVendedores || !v.leadsPorVendedor || !v.taxaConversao || !v.ticketMedio) return "";
      const receita = v.numVendedores * v.leadsPorVendedor * (v.taxaConversao / 100) * v.ticketMedio;
      return `A capacidade máxima da sua estrutura comercial atual é de ${brl(receita)}/mês. Se a meta de receita está acima disso, você precisa ou contratar mais vendedores, ou melhorar a conversão, ou aumentar o ticket médio.`;
    },
  },

  "calculadora-produtividade-equipe": {
    fields: [
      { key: "receitaTotal", label: "Receita Total do Período", prefix: "R$", placeholder: "220.000", min: 0 },
      { key: "numVendedores", label: "Número de Vendedores", placeholder: "5", min: 1 },
      { key: "horasMes", label: "Horas Trabalhadas por Vendedor/Mês", placeholder: "160", hint: "Média de horas produtivas mensais", min: 1 },
    ],
    calculate(v) {
      if (!v.numVendedores || !v.receitaTotal) return null;
      const receitaPorVendedor = v.receitaTotal / v.numVendedores;
      const receitaPorHora = v.receitaTotal / (v.numVendedores * v.horasMes);
      const horasParaMeta = v.numVendedores * v.horasMes;
      return [
        { label: "Receita por Vendedor", value: brl(receitaPorVendedor), highlight: true },
        { label: "Receita por Hora", value: brl(receitaPorHora) },
        { label: "Total de Horas Comerciais", value: num(horasParaMeta) + "h" },
        { label: "Para +20% de receita s/ contratar", value: brl(receitaPorVendedor * 1.2) + "/vendedor" },
      ];
    },
    interpret(v, results) {
      if (!v.numVendedores || !v.receitaTotal) return "";
      const rpv = v.receitaTotal / v.numVendedores;
      const rph = v.receitaTotal / (v.numVendedores * v.horasMes);
      return `Cada vendedor gera ${brl(rpv)}/mês — ou ${brl(rph)}/hora. Acompanhe essa métrica mês a mês: queda na receita por vendedor pode indicar pipeline fraco, leads ruins ou processo de venda ineficiente.`;
    },
  },

  "calculadora-tempo-fechamento": {
    fields: [
      { key: "totalDias", label: "Total de Dias em Negociações", placeholder: "540", hint: "Soma dos dias de todas as negociações do período", min: 0 },
      { key: "fechamentos", label: "Vendas Fechadas no Período", placeholder: "18", min: 1 },
      { key: "ticketMedio", label: "Ticket Médio (opcional)", prefix: "R$", placeholder: "5.000", hint: "Para calcular o impacto de reduzir o ciclo", min: 0 },
    ],
    calculate(v) {
      if (!v.fechamentos || !v.totalDias) return null;
      const cicloAtual = v.totalDias / v.fechamentos;
      const vendMes = 22 / cicloAtual;
      const vendMesReduzido = v.ticketMedio ? 22 / (cicloAtual * 0.8) : null;
      const results: CalcResult[] = [
        { label: "Ciclo Médio de Venda", value: num(cicloAtual, 1) + " dias", highlight: true },
        { label: "Vendas Possíveis por Mês (dias úteis)", value: num(vendMes, 1) },
      ];
      if (v.ticketMedio) {
        results.push({ label: "Receita Mensal Atual", value: brl(vendMes * v.ticketMedio) });
        if (vendMesReduzido) {
          results.push({ label: "Receita c/ 20% menos no ciclo", value: brl(vendMesReduzido * v.ticketMedio), positive: true });
        }
      }
      return results;
    },
    interpret(v, results) {
      if (!v.fechamentos || !v.totalDias) return "";
      const ciclo = v.totalDias / v.fechamentos;
      if (ciclo <= 7) return "Ciclo curto (até 7 dias): processo de decisão rápido. Monitore se a qualidade dos contratos está sendo preservada.";
      if (ciclo <= 30) return "Ciclo de 7-30 dias: adequado para ticket médio. Invista em follow-up estruturado para não deixar negociações esfriarem.";
      if (ciclo <= 60) return "Ciclo de 30-60 dias: típico de venda consultiva. Garanta que cada etapa tem um próximo passo definido.";
      return `Ciclo longo (acima de 60 dias). Mapeie onde as negociações empacam e crie gatilhos de urgência legítimos para acelerar a decisão.`;
    },
  },

  "calculadora-forecast-comercial": {
    fields: [
      { key: "qualificacao", label: "Leads em Qualificação", placeholder: "30", hint: "Primeiro contato, sem reunião marcada", min: 0 },
      { key: "reuniao", label: "Leads em Reunião/Apresentação", placeholder: "15", hint: "Reunião realizada, aguardando proposta", min: 0 },
      { key: "proposta", label: "Leads com Proposta Enviada", placeholder: "8", hint: "Proposta formal enviada", min: 0 },
      { key: "negociacao", label: "Leads em Negociação", placeholder: "4", hint: "Proposta aceita, em detalhes finais", min: 0 },
      { key: "ticketMedio", label: "Ticket Médio", prefix: "R$", placeholder: "6.000", min: 0 },
    ],
    calculate(v) {
      if (!v.ticketMedio) return null;
      const conservador = (
        (v.qualificacao || 0) * 0.05 +
        (v.reuniao || 0) * 0.15 +
        (v.proposta || 0) * 0.35 +
        (v.negociacao || 0) * 0.60
      ) * v.ticketMedio;
      const moderado = (
        (v.qualificacao || 0) * 0.10 +
        (v.reuniao || 0) * 0.25 +
        (v.proposta || 0) * 0.45 +
        (v.negociacao || 0) * 0.70
      ) * v.ticketMedio;
      const otimista = (
        (v.qualificacao || 0) * 0.15 +
        (v.reuniao || 0) * 0.35 +
        (v.proposta || 0) * 0.60 +
        (v.negociacao || 0) * 0.80
      ) * v.ticketMedio;
      const totalLeads = (v.qualificacao||0)+(v.reuniao||0)+(v.proposta||0)+(v.negociacao||0);
      return [
        { label: "Forecast Moderado", value: brl(moderado), highlight: true },
        { label: "Forecast Conservador", value: brl(conservador) },
        { label: "Forecast Otimista", value: brl(otimista) },
        { label: "Total de Leads no Pipeline", value: num(totalLeads) },
      ];
    },
    interpret(v, results) {
      if (!v.ticketMedio) return "";
      const moderado = (
        (v.qualificacao||0)*0.10 + (v.reuniao||0)*0.25 + (v.proposta||0)*0.45 + (v.negociacao||0)*0.70
      ) * v.ticketMedio;
      return `Forecast moderado de ${brl(moderado)} para o período. Use o cenário conservador para provisionar caixa e o otimista como teto de operação. Se o forecast estiver abaixo da meta, a ação imediata é aumentar os leads em negociação e proposta.`;
    },
  },

  "calculadora-potencial-faturamento": {
    fields: [
      { key: "leadsMes", label: "Leads Geráveis por Mês", placeholder: "120", hint: "Estimativa de leads que sua empresa consegue gerar", min: 0 },
      { key: "taxaConversao", label: "Taxa de Conversão", suffix: "%", placeholder: "10", min: 0.1, max: 100 },
      { key: "ticketMedio", label: "Ticket Médio", prefix: "R$", placeholder: "3.500", min: 0 },
      { key: "meses", label: "Período de Projeção (meses)", placeholder: "12", min: 1, max: 60 },
    ],
    calculate(v) {
      if (!v.leadsMes || !v.taxaConversao || !v.ticketMedio || !v.meses) return null;
      const vendasMes = v.leadsMes * (v.taxaConversao / 100);
      const faturamentoMes = vendasMes * v.ticketMedio;
      const faturamentoTotal = faturamentoMes * v.meses;
      const faturamentoAnual = faturamentoMes * 12;
      return [
        { label: "Potencial Mensal", value: brl(faturamentoMes), highlight: true },
        { label: `Potencial em ${num(v.meses)} Meses`, value: brl(faturamentoTotal) },
        { label: "Potencial Anual", value: brl(faturamentoAnual) },
        { label: "Vendas por Mês", value: num(vendasMes, 1) },
        { label: "Leads que Não Convertem", value: num(v.leadsMes - vendasMes) + "/mês" },
      ];
    },
    interpret(v, results) {
      if (!v.leadsMes || !v.taxaConversao || !v.ticketMedio) return "";
      const faturamentoMes = v.leadsMes * (v.taxaConversao / 100) * v.ticketMedio;
      const faturamentoAnual = faturamentoMes * 12;
      return `Com ${num(v.leadsMes)} leads/mês, ${pct(v.taxaConversao, 0)} de conversão e ticket de ${brl(v.ticketMedio)}, o potencial é ${brl(faturamentoAnual)}/ano. Se a receita atual está abaixo disso, o gap está ou na geração de leads, na conversão ou no ticket — use as outras calculadoras para identificar onde.`;
    },
  },

};
