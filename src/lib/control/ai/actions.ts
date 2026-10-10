import "server-only";
import { z } from "zod";
import { services } from "@/data/services";
import { getAllPosts } from "@/lib/posts";
import { generateJSON, generateText } from "./gemini";

/**
 * Catalogue of AI actions available across the Control. Each action owns its
 * prompt, its output schema and its validation, so modules only send context.
 */

const BRAND = `Você trabalha para a V3X, um Digital Product Studio brasileiro (grupov3x.com.br) que une estratégia, design e tecnologia.
Serviços: Web Design e Desenvolvimento (landing pages, sites institucionais, redesign), Motion Design (animação de marca e produto, vídeos de 15 a 60 segundos),
Software e Sistemas (CRMs, dashboards, sistemas internos), Produtos Digitais (SaaS, MVPs, aplicações web).
Escreva sempre em português do Brasil, com tom claro, direto e profissional, sem exageros publicitários.
Regras inegociáveis:
- Nunca invente estatísticas, números de mercado, pesquisas, citações, clientes ou fontes.
- Se uma afirmação depender de dado externo que você não pode verificar, evite-a ou marque com [VERIFICAR] para revisão humana.
- Não prometa resultados garantidos.`;

async function siteLinks() {
  const posts = await getAllPosts();
  return [
    { label: "Serviços", url: "/servicos" },
    ...services.map((s) => ({ label: s.name, url: `/servicos/${s.slug}` })),
    { label: "Projetos", url: "/projetos" },
    { label: "Sobre a V3X", url: "/sobre" },
    { label: "Contato", url: "/contato" },
    ...posts.map((p) => ({ label: p.title, url: `/blog/${p.slug}` })),
  ];
}

/* ---------------- Text actions (any module) ---------------- */

export const TEXT_ACTIONS = {
  improve: "Melhore a clareza, o ritmo e a correção do texto, mantendo o sentido e o tamanho aproximado.",
  summarize: "Resuma o texto em poucas frases objetivas, preservando as informações essenciais.",
  expand: "Desenvolva o texto com mais profundidade e exemplos práticos, sem inventar dados.",
  rewrite: "Reescreva o texto com outras palavras e uma estrutura nova, mantendo o significado.",
  ideas: "Gere uma lista de ideias práticas relacionadas ao texto, em tópicos curtos.",
} as const;
export type TextAction = keyof typeof TEXT_ACTIONS;

export async function runTextAction(action: TextAction, text: string, context?: string) {
  const result = await generateText({
    system: `${BRAND}\nResponda apenas com o texto resultante, em Markdown simples, sem comentários sobre o que você fez.`,
    prompt: `${TEXT_ACTIONS[action]}\n${context ? `Contexto: ${context}\n` : ""}\nTexto:\n"""${text.slice(0, 12000)}"""`,
    speed: "fast",
    temperature: 0.6,
    maxOutputTokens: 4096,
  });
  return { text: result.text.trim(), model: result.model };
}

/* ---------------- Blog: topics ---------------- */

const topicItem = z.object({
  title: z.string(),
  primary_keyword: z.string(),
  secondary_keywords: z.array(z.string()).default([]),
  search_intent: z.enum(["informational", "commercial", "transactional", "navigational"]),
  audience: z.string(),
  awareness_stage: z.enum(["unaware", "problem", "solution", "product", "most_aware"]),
  related_service: z.string(),
  angle: z.string(),
  questions: z.array(z.string()).default([]),
  internal_links: z.array(z.object({ label: z.string(), url: z.string() })).default([]),
});
export type TopicSuggestion = z.infer<typeof topicItem>;

const topicSchema = {
  type: "object",
  properties: {
    topics: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          primary_keyword: { type: "string" },
          secondary_keywords: { type: "array", items: { type: "string" } },
          search_intent: { type: "string", enum: ["informational", "commercial", "transactional", "navigational"] },
          audience: { type: "string" },
          awareness_stage: { type: "string", enum: ["unaware", "problem", "solution", "product", "most_aware"] },
          related_service: { type: "string" },
          angle: { type: "string" },
          questions: { type: "array", items: { type: "string" } },
          internal_links: { type: "array", items: { type: "object", properties: { label: { type: "string" }, url: { type: "string" } }, required: ["label", "url"] } },
        },
        required: ["title", "primary_keyword", "secondary_keywords", "search_intent", "audience", "awareness_stage", "related_service", "angle", "questions", "internal_links"],
      },
    },
  },
  required: ["topics"],
};

export async function suggestTopics(input: { theme?: string; service?: string; audience?: string; count?: number; existingTitles?: string[] }) {
  const links = await siteLinks();
  const allowed = new Set(links.map((l) => l.url));
  const { data, model } = await generateJSON(
    {
      system: `${BRAND}\nVocê é estrategista de conteúdo e SEO. Proponha pautas que respondam dúvidas reais de empresas e tenham intenção de busca clara, relacionadas aos serviços da V3X.
Você NÃO tem acesso a volume de buscas nem a dificuldade de palavras-chave: não mencione números, apenas a lógica da escolha.`,
      prompt: `Gere ${Math.min(input.count ?? 6, 10)} pautas para o blog da V3X.
${input.theme ? `Tema pedido: ${input.theme}` : "Tema livre dentro dos serviços da V3X, incluindo automação de processos, IA aplicada a empresas e tendências."}
${input.service ? `Serviço relacionado preferido: ${input.service}` : ""}
${input.audience ? `Público-alvo: ${input.audience}` : ""}
Evite repetir estes títulos já existentes: ${(input.existingTitles ?? []).slice(0, 40).join(" | ") || "nenhum"}.
Para links internos, use SOMENTE URLs desta lista: ${links.map((l) => `${l.label} (${l.url})`).join("; ")}.`,
      schema: topicSchema,
      speed: "quality",
      temperature: 0.9,
    },
    (value) => z.object({ topics: z.array(topicItem).min(1) }).parse(value),
  );
  const topics = data.topics.map((t) => ({ ...t, internal_links: t.internal_links.filter((l) => allowed.has(l.url)) }));
  return { topics, model, validation: "Sugestões geradas pela IA, sem validação de volume de busca ou concorrência." };
}

/* ---------------- Blog: full article ---------------- */

const articleOut = z.object({
  title: z.string(),
  seo_title: z.string(),
  slug: z.string(),
  meta_description: z.string(),
  excerpt: z.string(),
  content_md: z.string().min(400),
  faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  internal_links: z.array(z.object({ label: z.string(), url: z.string() })).default([]),
  tags: z.array(z.string()).default([]),
  category: z.string(),
  cover_suggestion: z.string(),
  cover_alt: z.string(),
  cta: z.string(),
  review_flags: z.array(z.string()).default([]),
});
export type GeneratedArticle = z.infer<typeof articleOut>;

const articleSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    seo_title: { type: "string" },
    slug: { type: "string" },
    meta_description: { type: "string" },
    excerpt: { type: "string" },
    content_md: { type: "string" },
    faq: { type: "array", items: { type: "object", properties: { q: { type: "string" }, a: { type: "string" } }, required: ["q", "a"] } },
    internal_links: { type: "array", items: { type: "object", properties: { label: { type: "string" }, url: { type: "string" } }, required: ["label", "url"] } },
    tags: { type: "array", items: { type: "string" } },
    category: { type: "string" },
    cover_suggestion: { type: "string" },
    cover_alt: { type: "string" },
    cta: { type: "string" },
    review_flags: { type: "array", items: { type: "string" } },
  },
  required: ["title", "seo_title", "slug", "meta_description", "excerpt", "content_md", "faq", "internal_links", "tags", "category", "cover_suggestion", "cover_alt", "cta", "review_flags"],
};

export async function generateArticle(input: {
  title: string;
  primary_keyword?: string;
  secondary_keywords?: string[];
  search_intent?: string;
  audience?: string;
  awareness_stage?: string;
  related_service?: string;
  angle?: string;
  questions?: string[];
  length?: "short" | "standard" | "long";
}) {
  const links = await siteLinks();
  const allowed = new Set(links.map((l) => l.url));
  const words = input.length === "short" ? "800 a 1.000" : input.length === "long" ? "1.800 a 2.300" : "1.200 a 1.600";
  const { data, model } = await generateJSON(
    {
      system: `${BRAND}\nVocê é redator sênior de conteúdo técnico e SEO. Escreva artigos úteis, originais e práticos, que respondam à intenção de busca do leitor.
Estrutura: o título é o H1 (não repita no conteúdo). No content_md use apenas H2 (##) e H3 (###), parágrafos curtos, listas quando ajudarem e exemplos práticos.
Inclua a palavra-chave principal de forma natural no título SEO, na introdução e em pelo menos um H2, sem repetição forçada.
seo_title até 60 caracteres. meta_description entre 140 e 160 caracteres. slug em minúsculas com hífens, sem acentos.
O CTA deve ser contextual e discreto, convidando a conversar com a V3X quando fizer sentido, sem transformar o texto em propaganda.
Não inclua seção de FAQ dentro do content_md: use o campo faq (3 a 5 perguntas) somente se agregar valor.
Em review_flags, liste qualquer afirmação que precise de verificação humana antes de publicar.`,
      prompt: `Escreva um artigo de ${words} palavras.
Pauta: ${input.title}
Palavra-chave principal: ${input.primary_keyword ?? "defina a mais adequada"}
Palavras-chave secundárias: ${(input.secondary_keywords ?? []).join(", ") || "escolha 3 a 5 relacionadas"}
Intenção de busca: ${input.search_intent ?? "informacional"}
Público: ${input.audience ?? "gestores e donos de pequenas e médias empresas"}
Estágio de consciência: ${input.awareness_stage ?? "problem"}
Serviço da V3X relacionado: ${input.related_service ?? "o mais adequado"}
Ângulo: ${input.angle ?? "prático e orientado a decisão"}
${input.questions?.length ? `Perguntas que o leitor costuma ter: ${input.questions.join(" | ")}` : ""}
Links internos permitidos (use 2 a 4, dentro do texto em Markdown e também no campo internal_links): ${links.map((l) => `${l.label} (${l.url})`).join("; ")}.
Não cite fontes externas que você não possa garantir que existem.`,
      schema: articleSchema,
      speed: "quality",
      temperature: 0.7,
      maxOutputTokens: 16384,
    },
    (value) => articleOut.parse(value),
  );
  return { article: { ...data, internal_links: data.internal_links.filter((l) => allowed.has(l.url)) }, model };
}

export async function rewriteSection(input: { articleTitle: string; section: string; instruction: string; keyword?: string }) {
  const result = await generateText({
    system: `${BRAND}\nVocê revisa trechos de artigos do blog. Responda apenas com o trecho reescrito em Markdown, mantendo os títulos (##/###) do trecho.`,
    prompt: `Artigo: ${input.articleTitle}\n${input.keyword ? `Palavra-chave principal: ${input.keyword}\n` : ""}Instrução: ${input.instruction}\nTrecho:\n"""${input.section.slice(0, 10000)}"""`,
    speed: "quality",
    temperature: 0.7,
    maxOutputTokens: 6144,
  });
  return { text: result.text.trim(), model: result.model };
}

/* ---------------- Tasks and projects ---------------- */

export async function checklistFor(task: { title: string; description?: string | null; project?: string | null }) {
  const { data, model } = await generateJSON(
    {
      system: `${BRAND}\nVocê transforma tarefas em checklists curtos e executáveis (3 a 8 itens), em ordem lógica.`,
      prompt: `Tarefa: ${task.title}\n${task.description ? `Descrição: ${task.description}\n` : ""}${task.project ? `Projeto: ${task.project}` : ""}`,
      schema: { type: "object", properties: { items: { type: "array", items: { type: "string" } } }, required: ["items"] },
      speed: "fast",
      temperature: 0.4,
    },
    (value) => z.object({ items: z.array(z.string().min(1)).min(1).max(12) }).parse(value),
  );
  return { items: data.items, model };
}

export async function suggestTasks(context: string) {
  const { data, model } = await generateJSON(
    {
      system: `${BRAND}\nVocê sugere próximas tarefas concretas a partir de dados reais de um projeto. Sugira no máximo 6, sem duplicar tarefas existentes. Não invente fatos sobre o projeto.`,
      prompt: context.slice(0, 12000),
      schema: {
        type: "object",
        properties: { tasks: { type: "array", items: { type: "object", properties: { title: { type: "string" }, priority: { type: "string", enum: ["low", "medium", "high", "urgent"] }, reason: { type: "string" } }, required: ["title", "priority", "reason"] } } },
        required: ["tasks"],
      },
      speed: "fast",
      temperature: 0.5,
    },
    (value) => z.object({ tasks: z.array(z.object({ title: z.string(), priority: z.enum(["low", "medium", "high", "urgent"]), reason: z.string() })).max(8) }).parse(value),
  );
  return { tasks: data.tasks, model };
}

export async function projectBrief(context: string) {
  const result = await generateText({
    system: `${BRAND}\nVocê escreve um resumo executivo curto de um projeto e sugere próximos passos, usando apenas os dados fornecidos. Quando faltar dado, diga explicitamente o que falta. Formato Markdown com as seções "Situação", "Riscos e pendências" e "Próximos passos".`,
    prompt: context.slice(0, 14000),
    speed: "fast",
    temperature: 0.4,
    maxOutputTokens: 3000,
  });
  return { text: result.text.trim(), model: result.model };
}

/* ---------------- Reports ---------------- */

export async function writeReport(input: { type: string; title: string; audience: "internal" | "client"; period: string; data: unknown; limitations: string[] }) {
  const result = await generateText({
    system: `${BRAND}\nVocê redige relatórios ${input.audience === "client" ? "para clientes da V3X (linguagem executiva, sem jargão interno nem dados de outros clientes)" : "internos da operação da V3X"}.
Use SOMENTE os dados fornecidos em JSON. Não invente métricas. Quando os dados forem insuficientes, diga isso claramente na seção "Limitações dos dados".
Formato Markdown: título com #, depois "Resumo", seções relevantes ao tipo de relatório, "Próximos passos" e "Limitações dos dados".`,
    prompt: `Tipo: ${input.type}\nTítulo: ${input.title}\nPeríodo: ${input.period}\nLimitações conhecidas: ${input.limitations.join("; ") || "nenhuma"}\nDados (JSON):\n${JSON.stringify(input.data).slice(0, 30000)}`,
    speed: "quality",
    temperature: 0.3,
    maxOutputTokens: 6000,
  });
  return { text: result.text.trim(), model: result.model };
}

/* ---------------- Customer service (suggestions only, a human sends) ---------------- */

export async function assistConversation(mode: "reply" | "summary" | "classify", transcript: { direction: "in" | "out"; body: string }[]) {
  const text = transcript
    .slice(-30)
    .map((m) => `${m.direction === "in" ? "Cliente" : "V3X"}: ${m.body}`)
    .join("\n")
    .slice(0, 10000);
  if (mode === "classify") {
    const { data, model } = await generateJSON(
      {
        system: `${BRAND}\nClassifique a conversa de atendimento.`,
        prompt: text,
        schema: { type: "object", properties: { topic: { type: "string" }, category: { type: "string", enum: ["orcamento", "suporte", "projeto_em_andamento", "financeiro", "outro"] }, urgency: { type: "string", enum: ["baixa", "media", "alta"] }, next_step: { type: "string" } }, required: ["topic", "category", "urgency", "next_step"] },
        speed: "fast",
        temperature: 0.2,
      },
      (value) => z.object({ topic: z.string(), category: z.string(), urgency: z.string(), next_step: z.string() }).parse(value),
    );
    return { result: data, model };
  }
  const result = await generateText({
    system:
      mode === "reply"
        ? `${BRAND}\nSugira UMA resposta curta e cordial para a última mensagem do cliente, em tom de WhatsApp profissional. A resposta será revisada por uma pessoa antes do envio. Não prometa prazos ou valores que não estejam na conversa.`
        : `${BRAND}\nResuma a conversa para o próximo atendente: pedido do cliente, o que já foi respondido, pendências e próximo passo sugerido. Em tópicos curtos.`,
    prompt: text,
    speed: "fast",
    temperature: 0.4,
    maxOutputTokens: 1200,
  });
  return { result: result.text.trim(), model: result.model };
}
