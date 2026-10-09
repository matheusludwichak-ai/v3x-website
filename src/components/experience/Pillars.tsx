"use client";

import { Reveal, SplitWords } from "./Reveal";
import { cn } from "@/lib/utils";

function WebVisual() {
  return (
    <div className="w-full max-w-sm rounded-md border border-border bg-surface p-3">
      <div className="mb-3 flex gap-1.5">{[0, 1, 2].map((i) => <span key={i} className="h-2 w-2 rounded-full bg-muted-foreground/40" />)}</div>
      <div className="space-y-2">
        <div className="h-6 w-2/3 origin-left rounded-sm bg-gradient-x transition-transform duration-500 group-hover:scale-x-110" />
        <div className="h-2 w-1/2 rounded-sm bg-muted-foreground/40" />
        <div className="grid grid-cols-3 gap-2 pt-2">
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ transitionDelay: `${i * 70}ms` }} className="h-14 translate-y-2 rounded-sm bg-surface-2 transition-all duration-500 group-hover:translate-y-0 group-hover:bg-accent" />
          ))}
        </div>
      </div>
    </div>
  );
}

function MotionVisual() {
  return (
    <svg viewBox="0 0 320 140" className="w-full max-w-sm" aria-hidden>
      <path d="M10 120 C 110 120, 120 20, 310 20" fill="none" stroke="currentColor" strokeOpacity=".25" />
      <path d="M10 120 C 110 120, 120 20, 310 20" fill="none" className="stroke-primary [stroke-dasharray:400] [stroke-dashoffset:400] transition-[stroke-dashoffset] duration-1000 ease-out group-hover:[stroke-dashoffset:0] group-focus-visible:[stroke-dashoffset:0]" strokeWidth="2" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={20 + i * 62} y={60} width="14" height="14" className="fill-brand-violet transition-transform duration-700" style={{ transformBox: "fill-box", transformOrigin: "center", transitionDelay: `${i * 60}ms` }} />
      ))}
    </svg>
  );
}

function SystemsVisual() {
  const rows = [["#0142", "CRM sync", "ok"], ["#0143", "Invoice job", "run"], ["#0144", "Report build", "ok"], ["#0145", "Webhook", "wait"]];
  return (
    <div className="w-full max-w-sm font-mono text-[11px] text-muted-foreground">
      {rows.map((r, i) => (
        <div key={i} className="flex justify-between border-b border-border py-2 transition-colors duration-300 group-hover:text-foreground" style={{ transitionDelay: `${i * 50}ms` }}>
          <span>{r[0]}</span><span>{r[1]}</span>
          <span className={cn(r[2] === "run" && "group-hover:text-primary")}>{r[2]}</span>
        </div>
      ))}
    </div>
  );
}

function ProductsVisual() {
  return (
    <div className="relative h-36 w-full max-w-sm">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute left-1/2 top-1/2 h-24 w-40 rounded-lg border border-border bg-surface transition-transform duration-700 ease-out"
          style={{ transform: `translate(-50%,-50%) translate(${(i - 1) * 14}px, ${(i - 1) * -10}px)` }}
          data-i={i}
        >
          <div className={cn("m-3 h-2 w-12 rounded-sm", i === 2 ? "bg-primary" : "bg-muted-foreground/30")} />
        </div>
      ))}
      <style>{`.group:hover [data-i="0"]{transform:translate(-50%,-50%) translate(-60px,24px) rotate(-6deg)}.group:hover [data-i="2"]{transform:translate(-50%,-50%) translate(60px,-24px) rotate(6deg)}`}</style>
    </div>
  );
}

const pillars = [
  { n: "01", title: "Web Design & Development", body: "Experiências web, landing pages, sites institucionais e interfaces digitais.", Visual: WebVisual },
  { n: "02", title: "Motion Design", body: "Animação publicitária, motion 2D/3D e comunicação visual em movimento.", Visual: MotionVisual },
  { n: "03", title: "Software & Systems", body: "CRMs, dashboards, sistemas personalizados e ferramentas operacionais.", Visual: SystemsVisual },
  { n: "04", title: "Digital Products", body: "SaaS, micro-SaaS, MVPs e plataformas digitais.", Visual: ProductsVisual },
] as const;

export function Pillars() {
  return (
    <section id="pillars" className="relative px-6 py-32 md:px-12">
      <div className="mb-20 grid gap-8 md:grid-cols-[1fr_2fr]">
        <span className="label-mono">( What we build )</span>
        <h2 className="text-4xl font-semibold leading-tight md:text-6xl lg:text-7xl">
          <SplitWords text="Four disciplines." />
          <SplitWords text="One studio." className="text-gradient-x" />
        </h2>
      </div>

      <div className="border-t border-border">
        {pillars.map(({ n, title, body, Visual }, i) => (
          <Reveal key={n} delay={i * 80}>
            <article
              tabIndex={0}
              className="group relative grid cursor-default items-center gap-8 border-b border-border py-10 outline-none transition-colors duration-500 hover:bg-surface/60 focus-visible:bg-surface/60 md:grid-cols-12 md:py-14"
            >
              <span className="label-mono text-brand-blue md:col-span-1">{n}</span>
              <div className="md:col-span-6">
                <h3 className="text-3xl font-medium leading-tight transition-transform duration-500 group-hover:translate-x-2 group-focus-visible:translate-x-2 md:text-4xl lg:text-5xl">
                  {title}
                </h3>
                <p className="mt-4 max-w-md text-sm text-muted-foreground md:inline-block">{body}</p>
              </div>
              <div className="flex text-foreground opacity-60 transition-all duration-500 group-hover:opacity-100 md:col-span-5 md:justify-end">
                <Visual />
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
