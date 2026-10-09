export type Service = {
  slug: string;
  number: string;
  name: string;
  short: string;
  description: string;
  heroLine: string;
  problems: string[];
  scope: string[];
  process: { title: string; body: string }[];
  faq: { q: string; a: string }[];
};

export const services: Service[] = [
  {
    slug: "web-design",
    number: "01",
    name: "Web Design & Development",
    short: "Sites, landing pages e experiências web com design claro e execução técnica precisa.",
    description:
      "Construímos sites institucionais, landing pages e redesigns que comunicam, orientam e convertem — não apenas páginas bonitas, mas experiências estruturadas em torno de um objetivo de negócio.",
    heroLine: "Um site bonito que não comunica nada não é um bom site.",
    problems: [
      "O site atual não representa a qualidade real do negócio",
      "Visitantes não entendem o que a empresa faz em poucos segundos",
      "Não existe uma arquitetura de informação clara — tudo numa página só",
      "O site não foi pensado para conversão, só para existir",
    ],
    scope: [
      "Arquitetura de informação e páginas com URLs permanentes",
      "Design system próprio — tipografia, cor, componentes",
      "Desenvolvimento em Next.js/Astro com performance e SEO desde o início",
      "Conteúdo e copy orientados a venda, não genéricos",
      "Responsividade real — mobile como prioridade, não adaptação",
    ],
    process: [
      { title: "Discover", body: "Entendemos o negócio, o público e o que o site precisa provar." },
      { title: "Design", body: "Arquitetura, wireframes e direção visual antes de qualquer linha de código." },
      { title: "Build", body: "Desenvolvimento com stack moderna, validando cada fluxo real." },
      { title: "Launch", body: "Deploy, SEO técnico e checklist de qualidade antes de publicar." },
    ],
    faq: [
      {
        q: "Vocês fazem só o design ou também o desenvolvimento?",
        a: "As duas coisas. Design e desenvolvimento são feitos pela mesma equipe, sem perda de fidelidade entre a ideia e o código.",
      },
      {
        q: "O site fica fácil de atualizar depois?",
        a: "Sim — conteúdo estruturado para ser editado sem depender de um novo deploy a cada mudança simples.",
      },
    ],
  },
  {
    slug: "motion-design",
    number: "02",
    name: "Motion Design",
    short: "Animação de marcas e produtos, peças para campanhas e vídeos curtos de 15 a 60 segundos.",
    description:
      "Produzimos motion design renderizado a partir de código — identidade animada, demonstrações de produto e peças para campanha, com domínio de ritmo, tipografia em movimento e sincronismo sonoro.",
    heroLine: "Movimento com propósito, não decoração.",
    problems: [
      "A marca não tem nenhuma peça em vídeo para redes ou apresentações",
      "O produto é difícil de explicar só com texto e imagem estática",
      "Peças de campanha genéricas não destacam a marca da concorrência",
    ],
    scope: [
      "Identidade animada (logo reveal, motion guidelines)",
      "Vídeos de produto e demonstração de 15 a 60 segundos",
      "Peças para campanhas pagas e redes sociais",
      "Renderização via código — sem dependência de templates genéricos",
    ],
    process: [
      { title: "Discover", body: "Entendemos a mensagem e onde a peça vai rodar (feed, stories, apresentação)." },
      { title: "Design", body: "Roteiro, storyboard e direção de arte antes de animar." },
      { title: "Build", body: "Animação renderizada por código, trilha e sincronismo sonoro." },
      { title: "Launch", body: "Exportação nos formatos certos para cada canal." },
    ],
    faq: [
      {
        q: "Como funciona o processo criativo?",
        a: "Começamos por roteiro e referência visual, validamos o storyboard com você antes de qualquer render final.",
      },
    ],
  },
  {
    slug: "software",
    number: "03",
    name: "Software & Systems",
    short: "CRMs, dashboards e sistemas sob medida para organizar processos e centralizar informações.",
    description:
      "Desenvolvemos sistemas personalizados — CRMs, dashboards operacionais e ferramentas internas — para organizar processos que hoje vivem espalhados em planilhas, grupos de WhatsApp e memória de quem trabalha na empresa.",
    heroLine: "Processo organizado é dinheiro que para de vazar.",
    problems: [
      "Informação de cliente espalhada entre planilhas, e-mail e WhatsApp",
      "Ninguém sabe em que etapa cada oportunidade comercial está",
      "Decisões são tomadas sem dado nenhum à frente",
    ],
    scope: [
      "CRM e pipeline comercial sob medida",
      "Dashboards com indicadores reais da operação",
      "Autenticação, permissões e controle de acesso por papel",
      "Banco de dados estruturado, com políticas de segurança por linha",
    ],
    process: [
      { title: "Discover", body: "Mapeamos o processo real da operação, não o ideal." },
      { title: "Design", body: "Modelo de dados e fluxos de tela antes de construir." },
      { title: "Build", body: "Sistema funcional, com autenticação e persistência real." },
      { title: "Evolve", body: "Acompanhamos o uso e evoluímos o sistema com o negócio." },
    ],
    faq: [
      {
        q: "O sistema fica hospedado onde?",
        a: "Em infraestrutura própria do cliente (Vercel + banco gerenciado), com total propriedade sobre os dados.",
      },
    ],
  },
  {
    slug: "produtos-digitais",
    number: "04",
    name: "Digital Products",
    short: "SaaS, MVPs e plataformas, da concepção ao lançamento, com espaço para evoluir.",
    description:
      "Levamos produtos digitais da ideia ao lançamento — descoberta, definição de escopo, experiência, desenvolvimento, validação e evolução. O Veredito, nosso CRM jurídico em desenvolvimento, nasceu desse processo.",
    heroLine: "De ideia a produto, com espaço para crescer.",
    problems: [
      "Existe uma ideia de produto mas nenhuma validação de escopo",
      "Faltam decisões técnicas e de arquitetura antes de começar a construir",
      "O MVP precisa sair rápido sem virar um protótipo descartável",
    ],
    scope: [
      "Discovery e definição de escopo do MVP",
      "Arquitetura de produto e modelo de dados",
      "Desenvolvimento full-stack com stack moderna",
      "Plano de evolução pós-lançamento",
    ],
    process: [
      { title: "Discover", body: "Validamos o problema e o usuário antes de qualquer tela." },
      { title: "Design", body: "Experiência e fluxos definidos antes de codar." },
      { title: "Build", body: "MVP funcional, não um protótipo estático." },
      { title: "Launch", body: "Lançamento com o escopo acordado." },
      { title: "Evolve", body: "Novas funcionalidades conforme o produto validar no mercado." },
    ],
    faq: [
      {
        q: "Vocês entram como sócios ou como prestadores?",
        a: "Depende do projeto — trabalhamos tanto em parceria quanto em contrato de desenvolvimento. Conversamos sobre o modelo que faz sentido para o seu caso.",
      },
    ],
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug) ?? null;
}
