import { demoWorks } from "@/components/experience/data";

export const projectStatuses = ["Backlog", "Planning", "In Progress", "In Review", "Waiting for Client", "Completed"];
export const leadStatuses = ["New Lead", "First Contact", "Discovery", "Proposal Sent", "Negotiation", "Won", "Lost"];
export type RecordItem = { id: string; title: string; client: string; category: string; owner: string; status: string; priority: string; deadline: string; image?: string; summary?: string; content?: string; slug?: string; seo?: string; value?: string };
export const projects: RecordItem[] = [
 { id:"p1",title:"Orbit — Analytics platform",client:"Example: Northstar",category:"Software & Systems",owner:"Isabella",status:"In Progress",priority:"High",deadline:"2026-10-16" },
 { id:"p2",title:"Monolith — Web experience",client:"Example: Forma",category:"Web Design",owner:"Matheus",status:"In Review",priority:"High",deadline:"2026-10-12" },
 { id:"p3",title:"Fold — Brand motion",client:"Example: Studio 04",category:"Motion Design",owner:"Isabella",status:"In Progress",priority:"Medium",deadline:"2026-10-22" },
 { id:"p4",title:"Pulse — Digital product",client:"Example: Vertex",category:"Digital Products",owner:"Isabella",status:"Planning",priority:"Medium",deadline:"2026-10-30" },
 { id:"p5",title:"Atlas — Operations CRM",client:"Example: Northstar",category:"Software & Systems",owner:"Matheus",status:"Waiting for Client",priority:"High",deadline:"2026-10-19" },
 { id:"p6",title:"Signal — Launch campaign",client:"Example: Studio 04",category:"Motion Design",owner:"Emmanuelle",status:"Backlog",priority:"Low",deadline:"2026-11-06" },
 { id:"p7",title:"Forma — Design system",client:"Example: Forma",category:"Web Design",owner:"Isabella",status:"Completed",priority:"Medium",deadline:"2026-10-07" },
];
export const tasks: RecordItem[] = [
 {id:"t1",title:"Review navigation prototypes",client:"Monolith — Web experience",category:"Design",owner:"Matheus",status:"In Progress",priority:"High",deadline:"2026-10-12"},
 {id:"t2",title:"Map analytics event schema",client:"Orbit — Analytics platform",category:"Development",owner:"Isabella",status:"To Do",priority:"High",deadline:"2026-10-13"},
 {id:"t3",title:"Approve motion storyboard",client:"Fold — Brand motion",category:"Motion",owner:"Matheus",status:"To Do",priority:"Medium",deadline:"2026-10-15"},
 {id:"t4",title:"Prepare discovery workshop",client:"Pulse — Digital product",category:"Strategy",owner:"Emmanuelle",status:"In Progress",priority:"Medium",deadline:"2026-10-16"},
 {id:"t5",title:"Document component tokens",client:"Forma — Design system",category:"Design",owner:"Isabella",status:"Completed",priority:"Low",deadline:"2026-10-07"},
];
export const clients: RecordItem[] = [
 {id:"c1",title:"Alex Morgan",client:"Example: Northstar",category:"Software & Systems",owner:"Matheus",status:"Active",priority:"Medium",deadline:"2026-10-09"},
 {id:"c2",title:"Jamie Lee",client:"Example: Forma",category:"Web Design",owner:"Matheus",status:"Active",priority:"Medium",deadline:"2026-10-08"},
 {id:"c3",title:"Sam Rivera",client:"Example: Studio 04",category:"Motion Design",owner:"Emmanuelle",status:"Active",priority:"Medium",deadline:"2026-10-07"},
 {id:"c4",title:"Taylor Quinn",client:"Example: Vertex",category:"Digital Products",owner:"Matheus",status:"Prospect",priority:"Medium",deadline:"2026-10-06"},
];
export const pipeline: RecordItem[] = [
 {id:"l1",title:"Example: Meridian",client:"Casey",category:"Digital Products",owner:"Matheus",status:"New Lead",priority:"Medium",deadline:"2026-10-13",value:"R$ 24,000"},
 {id:"l2",title:"Example: Offset",client:"Jordan",category:"Web Design",owner:"Matheus",status:"Discovery",priority:"High",deadline:"2026-10-14",value:"R$ 18,000"},
 {id:"l3",title:"Example: Frame",client:"Robin",category:"Motion Design",owner:"Emmanuelle",status:"Proposal Sent",priority:"Medium",deadline:"2026-10-16",value:"R$ 8,500"},
 {id:"l4",title:"Example: Nimbus",client:"Avery",category:"Software & Systems",owner:"Matheus",status:"Negotiation",priority:"High",deadline:"2026-10-19",value:"R$ 42,000"},
];
export const portfolio: RecordItem[] = demoWorks.map(w => ({id:w.id,title:w.title,client:"Illustrative concept",category:w.kind.split(" · ")[0] ?? "Concept",owner:"V3X",status:"Draft",priority:"Medium",deadline:"2026-10-09",image:w.image,summary:w.summary}));
export const articles: RecordItem[] = [
 {id:"a1",title:"Designing clarity in complex systems",client:"Example article",category:"Design",owner:"Isabella",status:"Draft",priority:"Medium",deadline:"2026-10-09",slug:"designing-clarity",summary:"An exploration of clarity, hierarchy and product decisions.",content:"This is a demonstration article. Explore how visual hierarchy makes complex software feel understandable.",seo:"Designing clarity — V3X"},
 {id:"a2",title:"Motion as a product language",client:"Example article",category:"Motion",owner:"Matheus",status:"Published",priority:"Medium",deadline:"2026-10-05",slug:"motion-language",summary:"Purposeful movement in digital products.",content:"Demonstration content: purposeful motion can communicate state and continuity.",seo:"Motion as a product language — V3X"},
];
export type CollectionKey = "projects"|"tasks"|"clients"|"pipeline"|"portfolio"|"motion-library"|"blog";
export type Collections = Record<CollectionKey, RecordItem[]>;
export const initialCollections: Collections = { projects, tasks, clients, pipeline, portfolio, "motion-library":portfolio.filter(p=>p.category.startsWith("Motion")), blog:articles };
