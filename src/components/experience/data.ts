export type DemoWork = {
  id: string;
  title: string;
  kind: string;
  year: string;
  image: string;
  summary: string;
  stack: string[];
};

/** Illustrative concept pieces only — not delivered client work. */
export const demoWorks: DemoWork[] = [
  { id: "orbit", title: "Orbit Analytics", kind: "Dashboard · Concept", year: "2026", image: "/work/work-dashboard.jpg", summary: "A dense analytics surface exploring how financial signals can read at a glance.", stack: ["Data viz", "Design system", "React"] },
  { id: "fold", title: "Fold / Motion", kind: "Motion frame · Concept", year: "2026", image: "/work/work-motion.jpg", summary: "Extruded geometry and a single light streak: a study in brand motion.", stack: ["3D", "Motion", "Art direction"] },
  { id: "monolith", title: "Monolith Site", kind: "Web interface · Concept", year: "2026", image: "/work/work-web.jpg", summary: "An editorial landing system built around oversized type and quiet imagery.", stack: ["Web design", "Typography", "Front-end"] },
  { id: "pulse", title: "Pulse App", kind: "Digital product · Concept", year: "2026", image: "/work/work-product.jpg", summary: "A mobile SaaS prototype pairing an assistant flow with live business metrics.", stack: ["Product", "Mobile UI", "MVP"] },
];
