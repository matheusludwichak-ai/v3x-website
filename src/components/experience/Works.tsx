"use client";

import { useState, type PointerEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { demoWorks, type DemoWork } from "./data";
import { Reveal, SplitWords } from "./Reveal";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function WorkTile({ work, onOpen, index }: { work: DemoWork; onOpen: () => void; index: number }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const move = (e: PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== "mouse" || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 });
  };
  return (
    <Reveal delay={index % 2 * 100}>
      <Button variant="ghost"
        onClick={onOpen}
        onPointerMove={move}
        onPointerLeave={() => setTilt({ x: 0, y: 0 })}
        className="group block h-auto w-full whitespace-normal p-0 text-left hover:bg-transparent"
        aria-label={`Open ${work.title} preview`}
      >
        <div className={cn("relative aspect-[4/3] overflow-hidden bg-surface", `work-composition-${work.id}`)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={work.image}
            alt={`${work.title} — illustrative concept`}
            loading="lazy"
            className="concept-image h-full w-full object-cover transition-transform duration-700 ease-out"
            style={{ transform: `translate(${tilt.x * -12}px, ${tilt.y * -12}px)` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <span
            className="absolute hidden h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:grid"
            style={{ left: `calc(${(tilt.x + 0.5) * 100}% - 28px)`, top: `calc(${(tilt.y + 0.5) * 100}% - 28px)` }}
          >
            <ArrowUpRight className="h-5 w-5" />
          </span>
          <span className="label-mono absolute left-4 top-4 rounded-sm bg-background/70 px-2 py-1 backdrop-blur">Concept</span>
        </div>
        <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-border py-6">
          <div>
            <span className="label-mono">0{index + 1} / {work.kind}</span>
            <h3 className="mt-3 text-2xl font-medium">{work.title}</h3>
            <p className="mt-3 max-w-md text-sm font-normal leading-relaxed text-muted-foreground">{work.summary}</p>
          </div>
          <ArrowUpRight className="mt-1 size-5 text-muted-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
        </div>
      </Button>
    </Reveal>
  );
}

export function Works() {
  const [open, setOpen] = useState<DemoWork | null>(null);
  return (
    <section id="work" className="relative px-6 py-24 md:px-12 md:py-32">
      <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <h2 className="text-4xl font-semibold leading-tight md:text-6xl lg:text-7xl">
          <SplitWords text="Selected" />
          <SplitWords text="explorations" className="text-gradient-x" />
        </h2>
        <p className="max-w-xs text-sm text-muted-foreground">
          Illustrative concept pieces that show our visual direction. Not client projects.
        </p>
      </div>

      <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 md:gap-y-16">
        {demoWorks.map((work, index) => <WorkTile key={work.id} work={work} index={index} onOpen={() => setOpen(work)} />)}
      </div>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-h-[90svh] max-w-4xl gap-0 overflow-y-auto border-border bg-surface p-0">
          {open && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={open.image} alt={open.title} className="concept-image aspect-[16/9] w-full object-cover" />
              <div className="grid gap-6 p-8 md:grid-cols-[2fr_1fr]">
                <div>
                  <span className="label-mono">Concept preview · {open.year}</span>
                  <DialogTitle className="mt-2 text-3xl font-semibold">{open.title}</DialogTitle>
                  <DialogDescription className="mt-3 text-muted-foreground">{open.summary}</DialogDescription>
                </div>
                <div className="space-y-2">
                  <span className="label-mono">Disciplines</span>
                  {open.stack.map((s) => <div key={s} className="border-b border-border pb-2 text-sm">{s}</div>)}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
