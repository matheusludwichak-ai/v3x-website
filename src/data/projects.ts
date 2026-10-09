export type ProjectStatus =
  | "Em desenvolvimento"
  | "Entregue"
  | "Estudo conceitual"
  | "Protótipo";

export type GalleryItem = { src: string; alt: string; width: number; height: number };

export type Project = {
  slug: string;
  name: string;
  category: string;
  status: ProjectStatus;
  cover: string;
  summary: string;
  problem: string;
  contribution: string;
  tech: string[];
  credits?: string;
  gallery: GalleryItem[];
};

export const projects: Project[] = [
  {
    slug: "veredito",
    name: "Veredito",
    category: "Produto digital · Software e Sistemas",
    status: "Em desenvolvimento",
    cover: "/work/veredito/dashboard.jpg",
    summary: "CRM para advogados e operações jurídicas. Um só lugar para contatos, conversas, propostas e contratos.",
    problem:
      "Escritórios de advocacia e operações jurídicas gerenciam contatos, propostas e contratos espalhados entre e-mail, WhatsApp e planilhas, sem visibilidade do funil nem histórico centralizado.",
    contribution:
      "Desenhamos e desenvolvemos o produto do zero: pipeline visual do primeiro contato à assinatura, caixa de entrada unificada, atendimento assistido por IA, propostas e relatórios, em parceria com uma agência de marketing jurídico.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
    credits: "Em parceria com uma agência de marketing.",
    gallery: [
      { src: "/work/veredito/dashboard.jpg", alt: "Veredito, visão geral do CRM com métricas de pipeline", width: 1800, height: 1125 },
      { src: "/work/veredito/pipeline.jpg", alt: "Veredito, pipeline visual de leads em formato kanban", width: 1800, height: 1125 },
      { src: "/work/veredito/contatos.jpg", alt: "Veredito, lista de contatos e clientes", width: 1800, height: 1125 },
      { src: "/work/veredito/inbox.jpg", alt: "Veredito, caixa de entrada unificada de conversas", width: 1800, height: 1125 },
      { src: "/work/veredito/ia.jpg", alt: "Veredito, atendimento assistido por inteligência artificial", width: 1800, height: 1125 },
      { src: "/work/veredito/propostas.jpg", alt: "Veredito, propostas comerciais e contratos", width: 1800, height: 1125 },
      { src: "/work/veredito/relatorios.jpg", alt: "Veredito, relatórios e indicadores", width: 1800, height: 1125 },
      { src: "/work/veredito/land-hero.jpg", alt: "Veredito, hero da landing page institucional", width: 1800, height: 1300 },
      { src: "/work/veredito/land-features.jpg", alt: "Veredito, seção de funcionalidades da landing page", width: 1800, height: 433 },
      { src: "/work/veredito/land-journey.jpg", alt: "Veredito, jornada do cliente na landing page", width: 1800, height: 475 },
    ],
  },
  {
    slug: "identidade-v3x",
    name: "Identidade Visual V3X",
    category: "Identidade de marca · Projeto próprio",
    status: "Estudo conceitual",
    cover: "/brand/brandboard.jpg",
    summary: "O sistema de marca da própria V3X, logotipo, tipografia, paleta e aplicações.",
    problem:
      "A V3X precisava de uma identidade que comunicasse precisão técnica e direção de arte antes de assinar qualquer projeto de cliente, a marca como primeiro produto da marca.",
    contribution:
      "Construímos o logotipo (símbolo X com gradiente de assinatura), sistema tipográfico, paleta, grid, aplicações em papelaria, mockups de produto e guia de uso da marca.",
    tech: ["Identidade de marca", "Design de sistema"],
    gallery: [{ src: "/brand/brandboard.jpg", alt: "Brand board completo da identidade visual V3X", width: 1536, height: 1024 }],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug) ?? null;
}
