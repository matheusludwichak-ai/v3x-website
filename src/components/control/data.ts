import { demoWorks } from "@/components/experience/data";

export const projectStatuses = ["Backlog", "Planejamento", "Em andamento", "Em revisão", "Aguardando cliente", "Concluído"];
export const leadStatuses = ["Novo lead", "Primeiro contato", "Descoberta", "Proposta enviada", "Negociação", "Ganho", "Perdido"];
export type RecordItem = { id: string; title: string; client: string; category: string; owner: string; status: string; priority: string; deadline: string; image?: string; summary?: string; content?: string; slug?: string; seo?: string; value?: string };
export const projects: RecordItem[] = [
 { id:"p1",title:"Orbit · Plataforma de analytics",client:"Exemplo: Northstar",category:"Software e Sistemas",owner:"Isabella",status:"Em andamento",priority:"Alta",deadline:"2026-10-16" },
 { id:"p2",title:"Monolith · Experiência web",client:"Exemplo: Forma",category:"Web Design",owner:"Matheus",status:"Em revisão",priority:"Alta",deadline:"2026-10-12" },
 { id:"p3",title:"Fold · Motion de marca",client:"Exemplo: Studio 04",category:"Motion Design",owner:"Isabella",status:"Em andamento",priority:"Média",deadline:"2026-10-22" },
 { id:"p4",title:"Pulse · Produto digital",client:"Exemplo: Vertex",category:"Produtos Digitais",owner:"Isabella",status:"Planejamento",priority:"Média",deadline:"2026-10-30" },
 { id:"p5",title:"Atlas · CRM de operações",client:"Exemplo: Northstar",category:"Software e Sistemas",owner:"Matheus",status:"Aguardando cliente",priority:"Alta",deadline:"2026-10-19" },
 { id:"p6",title:"Signal · Campanha de lançamento",client:"Exemplo: Studio 04",category:"Motion Design",owner:"Emmanuelle",status:"Backlog",priority:"Baixa",deadline:"2026-11-06" },
 { id:"p7",title:"Forma · Design system",client:"Exemplo: Forma",category:"Web Design",owner:"Isabella",status:"Concluído",priority:"Média",deadline:"2026-10-07" },
];
export const tasks: RecordItem[] = [
 {id:"t1",title:"Revisar protótipos de navegação",client:"Monolith · Experiência web",category:"Design",owner:"Matheus",status:"Em andamento",priority:"Alta",deadline:"2026-10-12"},
 {id:"t2",title:"Mapear eventos de analytics",client:"Orbit · Plataforma de analytics",category:"Desenvolvimento",owner:"Isabella",status:"A fazer",priority:"Alta",deadline:"2026-10-13"},
 {id:"t3",title:"Aprovar storyboard do motion",client:"Fold · Motion de marca",category:"Motion",owner:"Matheus",status:"A fazer",priority:"Média",deadline:"2026-10-15"},
 {id:"t4",title:"Preparar workshop de descoberta",client:"Pulse · Produto digital",category:"Estratégia",owner:"Emmanuelle",status:"Em andamento",priority:"Média",deadline:"2026-10-16"},
 {id:"t5",title:"Documentar tokens dos componentes",client:"Forma · Design system",category:"Design",owner:"Isabella",status:"Concluído",priority:"Baixa",deadline:"2026-10-07"},
];
export const clients: RecordItem[] = [
 {id:"c1",title:"Rafael Moura",client:"Exemplo: Northstar",category:"Software e Sistemas",owner:"Matheus",status:"Ativo",priority:"Média",deadline:"2026-10-09"},
 {id:"c2",title:"Camila Duarte",client:"Exemplo: Forma",category:"Web Design",owner:"Matheus",status:"Ativo",priority:"Média",deadline:"2026-10-08"},
 {id:"c3",title:"Bruno Teixeira",client:"Exemplo: Studio 04",category:"Motion Design",owner:"Emmanuelle",status:"Ativo",priority:"Média",deadline:"2026-10-07"},
 {id:"c4",title:"Larissa Prado",client:"Exemplo: Vertex",category:"Produtos Digitais",owner:"Matheus",status:"Prospecto",priority:"Média",deadline:"2026-10-06"},
];
export const pipeline: RecordItem[] = [
 {id:"l1",title:"Exemplo: Meridian",client:"Diego",category:"Produtos Digitais",owner:"Matheus",status:"Novo lead",priority:"Média",deadline:"2026-10-13",value:"R$ 24.000"},
 {id:"l2",title:"Exemplo: Offset",client:"Paula",category:"Web Design",owner:"Matheus",status:"Descoberta",priority:"Alta",deadline:"2026-10-14",value:"R$ 18.000"},
 {id:"l3",title:"Exemplo: Frame",client:"Tiago",category:"Motion Design",owner:"Emmanuelle",status:"Proposta enviada",priority:"Média",deadline:"2026-10-16",value:"R$ 8.500"},
 {id:"l4",title:"Exemplo: Nimbus",client:"Renata",category:"Software e Sistemas",owner:"Matheus",status:"Negociação",priority:"Alta",deadline:"2026-10-19",value:"R$ 42.000"},
];
export const portfolio: RecordItem[] = demoWorks.map(w => ({id:w.id,title:w.title,client:"Conceito ilustrativo",category:w.kind.split(" · ")[0] ?? "Conceito",owner:"V3X",status:"Rascunho",priority:"Média",deadline:"2026-10-09",image:w.image,summary:w.summary}));
export const articles: RecordItem[] = [
 {id:"a1",title:"Clareza em sistemas complexos",client:"Artigo de exemplo",category:"Design",owner:"Isabella",status:"Rascunho",priority:"Média",deadline:"2026-10-09",slug:"clareza-sistemas-complexos",summary:"Hierarquia e decisões de produto que deixam um software fácil de entender.",content:"Artigo de demonstração. Como a hierarquia visual torna um software complexo compreensível.",seo:"Clareza em sistemas complexos | V3X"},
 {id:"a2",title:"Motion como linguagem de produto",client:"Artigo de exemplo",category:"Motion",owner:"Matheus",status:"Publicado",priority:"Média",deadline:"2026-10-05",slug:"motion-linguagem-produto",summary:"Movimento com propósito em produtos digitais.",content:"Conteúdo de demonstração: o movimento com propósito comunica estado e continuidade.",seo:"Motion como linguagem de produto | V3X"},
];
export type CollectionKey = "projects"|"tasks"|"clients"|"pipeline"|"portfolio"|"motion-library"|"blog";
export type Collections = Record<CollectionKey, RecordItem[]>;
export const initialCollections: Collections = { projects, tasks, clients, pipeline, portfolio, "motion-library":portfolio.filter(p=>p.category.startsWith("Motion")), blog:articles };
