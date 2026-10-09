export type DemoWork = {
  id: string;
  title: string;
  kind: string;
  year: string;
  image: string;
  summary: string;
  stack: string[];
};

/** Illustrative concepts only, not delivered client work. Used by the Control portfolio demo. */
export const demoWorks: DemoWork[] = [
  { id: "orbit", title: "Orbit Analytics", kind: "Software e dashboards · Conceito", year: "2026", image: "/work/work-dashboard.jpg", summary: "Painel que reúne receita, clientes e cancelamentos em uma leitura clara.", stack: ["Dashboards", "Design system", "Aplicação web"] },
  { id: "fold", title: "Fold Motion", kind: "Motion design · Peça da V3X", year: "2026", image: "/work/v3x-motion-poster.jpg", summary: "Motion institucional da V3X: um minuto sobre quem somos e o que fazemos.", stack: ["Roteiro", "Animação de marca", "Vídeo"] },
  { id: "monolith", title: "Monolith Site", kind: "Web design · Conceito", year: "2026", image: "/work/work-web.jpg", summary: "Site editorial para um estúdio de arquitetura, com tipografia expressiva.", stack: ["Site institucional", "Direção de arte", "Front-end"] },
  { id: "pulse", title: "Pulse App", kind: "Produto digital · Conceito", year: "2026", image: "/work/work-product.jpg", summary: "App mobile que une o resumo de vendas do dia a um assistente com IA.", stack: ["App mobile", "Assistente com IA", "MVP"] },
];
