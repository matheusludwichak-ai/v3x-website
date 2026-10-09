"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Logo } from "@/components/brand/Logo";
import { XMark } from "@/components/brand/XMark";
import { Reveal, SplitWords } from "./Reveal";

const areas = [
  { area: "Negócios", text: "Visão comercial, prospecção e desenvolvimento de negócios." },
  { area: "Tecnologia", text: "Arquitetura de soluções e desenvolvimento dos sistemas." },
  { area: "Finanças", text: "Organização financeira e estruturação do negócio." },
];

export function Founders() {
  return (
    <section id="fundadores" className="border-t border-border px-6 py-28 md:px-12 md:py-36">
      <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-5">
          <span className="eyebrow">Fundadores</span>
          <h2 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-[-0.035em] md:text-5xl xl:text-6xl">
            As pessoas por trás <span className="text-gradient-x">da V3X.</span>
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
            Três perspectivas, uma visão: negócios, tecnologia e finanças trabalhando juntos desde o primeiro contato.
          </p>
          <dl className="mt-10 grid gap-6 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {areas.map((a) => (
              <div key={a.area} className="border-t border-border pt-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7fb2ff]">{a.area}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-foreground/85">{a.text}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal mask className="lg:col-span-7">
          <figure className="relative ml-auto max-w-[760px]">
            <div className="overflow-hidden rounded-[28px] border border-white/12 shadow-[0_40px_90px_-40px_rgba(56,130,246,0.45)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/work/v3x-team.jpg"
                alt="Isabella Christina (CTO), Matheus Ludwichak (CEO) e Emmanuelle Assanté (CFO), fundadores da V3X"
                width={1536}
                height={1024}
                loading="lazy"
                className="h-auto w-full transition-transform duration-[1200ms] ease-out hover:scale-[1.025]"
              />
            </div>
            <span aria-hidden className="mx-auto mt-5 block h-[3px] w-24 bg-gradient-x" />
          </figure>
        </Reveal>
      </div>
    </section>
  );
}

type Status = "idle" | "sending" | "sent" | "error";

export function ContactDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contato", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setStatus("error");
        setError(json.error ?? "Não foi possível enviar. Tente novamente.");
        return;
      }
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
      setError("Não foi possível enviar. Verifique sua conexão e tente novamente.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) setTimeout(() => setStatus("idle"), 300); }}>
      <DialogContent className="max-h-[90svh] overflow-y-auto border-border bg-surface sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">Vamos conversar sobre o seu projeto</DialogTitle>
          <DialogDescription>Conte o que você precisa. Respondemos em até 1 dia útil.</DialogDescription>
        </DialogHeader>
        {status === "sent" ? (
          <div className="flex flex-col items-center gap-4 py-10 text-center" role="status">
            <span className="grid size-14 place-items-center rounded-full bg-gradient-x text-white"><Check /></span>
            <p className="text-muted-foreground">Recebemos sua mensagem. Vamos responder no e-mail informado.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label htmlFor="c-nome">Nome</Label><Input id="c-nome" name="nome" autoComplete="name" required /></div>
              <div className="space-y-2"><Label htmlFor="c-empresa">Empresa <span className="text-muted-foreground">(opcional)</span></Label><Input id="c-empresa" name="empresa" autoComplete="organization" /></div>
            </div>
            <div className="space-y-2"><Label htmlFor="c-email">E-mail</Label><Input id="c-email" name="email" type="email" autoComplete="email" required /></div>
            <div className="space-y-2"><Label htmlFor="c-desc">O que você quer construir?</Label><Textarea id="c-desc" name="descricao" rows={4} required placeholder="Ex.: um site novo, um sistema interno, um app..." /></div>
            {status === "error" && <p role="alert" className="text-sm text-[#c4b5fd]">{error}</p>}
            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-x font-semibold text-white transition-[filter,transform] hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
            >
              {status === "sending" ? "Enviando..." : "Enviar mensagem"}
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

const footerLinks = [
  { href: "#servicos", label: "Serviços" },
  { href: "#projetos", label: "Projetos" },
  { href: "#fundadores", label: "Fundadores" },
  { href: "/blog", label: "Blog" },
];

export function Closing({ onContact }: { onContact: () => void }) {
  return (
    <section className="hero-glow relative overflow-hidden border-t border-border px-6 pb-10 pt-28 md:px-12 md:pt-36">
      <div aria-hidden className="tech-grid absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <XMark className="pointer-events-none absolute -right-24 top-16 hidden w-[520px] opacity-25 lg:block" />
      <div className="relative">
        <span className="eyebrow">Próximo passo</span>
        <h2 className="mt-8 text-[2.75rem] font-semibold leading-[1.02] tracking-[-0.04em] sm:text-6xl md:text-7xl xl:text-8xl">
          <SplitWords text="Vamos construir" />
          <SplitWords text="algo que importa." className="text-gradient-x" />
        </h2>
        <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
          Do primeiro contato à evolução do produto, com um processo claro em cada etapa.
        </p>
        <button
          type="button"
          onClick={onContact}
          className="group mt-10 inline-flex h-14 items-center gap-4 rounded-full bg-gradient-x px-8 text-base font-semibold text-white shadow-[0_18px_40px_-18px_rgba(56,130,246,0.9)] transition-[filter,transform] hover:brightness-110 active:scale-[0.97]"
        >
          Começar um projeto
          <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </button>
      </div>

      <footer className="relative mt-24 grid gap-10 border-t border-border pt-10 md:mt-32 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <Logo className="w-[150px]" />
          <p className="mt-3 text-[0.65rem] font-semibold uppercase tracking-[0.42em] text-foreground/80">Digital Product Studio</p>
          <p className="mt-6 text-sm text-muted-foreground">Design. Tecnologia. Produtos digitais.</p>
        </div>
        <div className="flex flex-col gap-6 md:items-end">
          <nav aria-label="Rodapé" className="flex flex-wrap gap-x-7 gap-y-3 text-sm">
            {footerLinks.map((l) => (
              <a key={l.href} href={l.href} className="nav-link text-muted-foreground transition-colors hover:text-foreground">{l.label}</a>
            ))}
          </nav>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span>© 2026 V3X</span>
            <Link href="/privacidade" className="transition-colors hover:text-foreground">Privacidade</Link>
            <Link href="/termos" className="transition-colors hover:text-foreground">Termos</Link>
            <span>grupov3x.com.br</span>
          </div>
        </div>
      </footer>
    </section>
  );
}
