"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Logo } from "@/components/brand/Logo";
import { SplitWords } from "./Reveal";
import { Reveal } from "./Reveal";
import { Button } from "@/components/ui/button";

export function Founders() {
  return (
    <section id="people" className="grid gap-10 border-t border-border px-6 py-24 md:grid-cols-12 md:px-12 md:py-32">
      <Reveal className="md:col-span-4">
        <span className="label-mono">( The people )</span>
        <h2 className="mt-6 text-3xl font-semibold leading-tight md:text-4xl xl:text-5xl">
          Business vision, engineering and finance under one roof.
        </h2>
        <dl className="mt-10 space-y-5 text-sm">
          {[
            ["Matheus Ludwichak", "CEO & Founder"],
            ["Isabella Christina", "CTO & Co-founder"],
            ["Emmanuelle Assanté", "CFO & Co-founder"],
          ].map(([n, r]) => (
            <div key={n} className="flex flex-wrap justify-between gap-2 border-b border-border pb-3">
              <dt className="font-medium">{n}</dt>
              <dd className="text-muted-foreground">{r}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
      <Reveal mask className="self-start md:col-span-8">
        <div className="overflow-hidden rounded-2xl border border-border md:ml-auto md:max-w-[560px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/work/v3x-team.jpg" alt="V3X founders in the studio" loading="lazy" className="concept-image h-auto w-full" />
        </div>
      </Reveal>
    </section>
  );
}

export function ContactDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [sent, setSent] = useState(false);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };
  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) setTimeout(() => setSent(false), 300); }}>
      <DialogContent className="max-h-[90svh] overflow-y-auto border-border bg-surface sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">Start a conversation</DialogTitle>
          <DialogDescription>Prototype form. Nothing is sent anywhere yet.</DialogDescription>
        </DialogHeader>
        {sent ? (
          <div className="flex flex-col items-center gap-4 py-10 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground"><Check /></span>
            <p className="text-muted-foreground">Demo complete. In the live version, this would reach the V3X team.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2"><Label htmlFor="c-name">Name</Label><Input id="c-name" required /></div>
            <div className="space-y-2"><Label htmlFor="c-co">Company</Label><Input id="c-co" /></div>
            <div className="space-y-2"><Label htmlFor="c-msg">What are you building?</Label><Textarea id="c-msg" rows={4} required /></div>
            <Button type="submit" className="w-full">
              Send (demo)
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function Closing({ onContact }: { onContact: () => void }) {
  return (
    <section className="relative overflow-hidden border-t border-border bg-surface/60 px-6 pb-10 pt-24 md:px-12 md:pt-32">
      <div aria-hidden className="tech-grid absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="relative">
        <span className="label-mono">( Next )</span>
        <h2 className="mt-8 text-4xl font-medium leading-tight sm:text-6xl md:text-7xl xl:text-8xl">
          <SplitWords text="Let's build" />
          <SplitWords text="something" className="text-muted-foreground" />
          <SplitWords text="meaningful." className="text-gradient-x" />
        </h2>
        <Button
          onClick={onContact}
          className="group mt-10 h-14 gap-10 rounded-sm px-6 text-base"
        >
          Start a project
          <span className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
            <ArrowUpRight className="h-5 w-5" />
          </span>
        </Button>
      </div>
      <footer className="relative mt-24 flex flex-col justify-between gap-6 border-t border-border pt-6 md:mt-32 md:flex-row md:items-center">
        <Logo className="text-xl" tagline />
        <span className="label-mono">Design. Technology. Digital Products.</span>
        <span className="label-mono">© 2026 V3X</span>
      </footer>
    </section>
  );
}
