/** Portuguese labels and tones for every enum of the Control data model. */

export type Tone = "neutral" | "blue" | "violet" | "success" | "warning" | "danger" | "muted";

export const TASK_STATUS_LABEL = { todo: "A fazer", doing: "Em andamento", waiting: "Aguardando", done: "Concluída" } as const;
export const TASK_STATUS_TONE: Record<string, Tone> = { todo: "neutral", doing: "blue", waiting: "warning", done: "success" };

export const PRIORITY_LABEL = { low: "Baixa", medium: "Média", high: "Alta", urgent: "Urgente" } as const;
export const PRIORITY_TONE: Record<string, Tone> = { low: "muted", medium: "neutral", high: "violet", urgent: "danger" };

export const PROJECT_STATUS_LABEL = { planning: "Planejamento", active: "Em andamento", waiting: "Aguardando cliente", paused: "Pausado", done: "Concluído" } as const;
export const PROJECT_STATUS_TONE: Record<string, Tone> = { planning: "neutral", active: "blue", waiting: "warning", paused: "muted", done: "success" };
export const PROJECT_STAGE_LABEL = { discovery: "Descoberta", design: "Design", development: "Desenvolvimento", review: "Revisão", delivery: "Entrega" } as const;

export const LEAD_STAGE_LABEL = { new: "Novo contato", contact: "Primeiro contato", discovery: "Descoberta", proposal: "Proposta enviada", negotiation: "Negociação", won: "Fechado", lost: "Perdido" } as const;

export const ARTICLE_STATUS_LABEL = { draft: "Rascunho", review: "Em revisão", approved: "Aprovado", published: "Publicado", archived: "Arquivado" } as const;
export const ARTICLE_STATUS_TONE: Record<string, Tone> = { draft: "neutral", review: "warning", approved: "violet", published: "success", archived: "muted" };
export const INTENT_LABEL = { informational: "Informacional", commercial: "Comercial", transactional: "Transacional", navigational: "Navegacional" } as const;
export const AWARENESS_LABEL = { unaware: "Não sabe do problema", problem: "Conhece o problema", solution: "Busca soluções", product: "Compara fornecedores", most_aware: "Pronto para decidir" } as const;

export const PORTFOLIO_STATUS_LABEL = { in_progress: "Em desenvolvimento", done: "Concluído", internal: "Projeto interno" } as const;
export const PORTFOLIO_STATUS_TONE: Record<string, Tone> = { in_progress: "blue", done: "success", internal: "muted" };
export const PORTFOLIO_CATEGORY_LABEL = { site: "Site", system: "Sistema", app: "Aplicativo", saas: "SaaS", motion: "Motion", other: "Outro" } as const;

export const MOTION_CATEGORY_LABEL = { brand: "Marca", product: "Produto", campaign: "Campanha", ui: "Interface", reference: "Referência", other: "Outro" } as const;

export const MONITOR_STATUS_LABEL = { up: "Operacional", degraded: "Instável", down: "Fora do ar", unknown: "Desconhecido" } as const;
export const MONITOR_STATUS_TONE: Record<string, Tone> = { up: "success", degraded: "warning", down: "danger", unknown: "muted" };
export const SEVERITY_LABEL = { info: "Informativo", low: "Baixa", medium: "Média", high: "Alta" } as const;
export const CONFIDENCE_LABEL = { low: "baixa", medium: "média", high: "alta" } as const;

export const CONVERSATION_STATUS_LABEL = { open: "Em atendimento", pending: "Pendente", closed: "Encerrada" } as const;
export const MESSAGE_STATUS_LABEL = { pending: "Enviando", sent: "Enviada", delivered: "Entregue", read: "Lida", failed: "Falhou", received: "Recebida" } as const;

export const REPORT_TYPE_LABEL = {
  projects: "Projetos",
  tasks: "Andamento e tarefas",
  monitoring: "Desempenho dos sites",
  incidents: "Incidentes e disponibilidade",
  development: "Desenvolvimento",
  activity: "Atividades e entregas",
  executive: "Executivo para cliente",
} as const;

export const label = <T extends Record<string, string>>(map: T, key: string | null | undefined, fallback = "—") => (key && key in map ? map[key as keyof T] : fallback);
