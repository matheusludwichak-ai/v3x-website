"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { ArrowUpRight, Check } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { XMark } from "@/components/brand/XMark";
import { WhatsAppIcon } from "@/components/site/whatsapp-icon";
import { CONTACT_EMAIL, CONTACT_EMAIL_HREF, whatsappHref } from "@/config/contact";
import { Reveal, SplitWords } from "./Reveal";

const areas = [
  { area: "Negócios", text: "Visão comercial, prospecção e desenvolvimento de negócios." },
  { area: "Tecnologia", text: "Arquitetura de soluções e desenvolvimento dos sistemas." },
  { area: "Finanças", text: "Organização financeira e estruturação do negócio." },
];

export function Founders() {
  return (
    <section id="fundadores" className="border-t border-border">
      <div className="container-v3x section-y">
      <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-5">
          <span className="eyebrow">Fundadores</span>
          <h2 className="t-h2 mt-6 font-semibold">
            As pessoas por trás <span className="text-gradient-x">da V3X.</span>
          </h2>
          <p className="t-lead mt-6 max-w-md text-muted-foreground">
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
              <Image
                src="/work/v3x-team.jpg"
                alt="Isabella Christina (CTO), Matheus Ludwichak (CEO) e Emmanuelle Assanté (CFO), fundadores da V3X"
                width={3072}
                height={2048}
                sizes="(min-width: 1024px) 760px, 100vw"
                quality={90}
                className="h-auto w-full transition-transform duration-[1200ms] ease-out hover:scale-[1.025]"
              />
            </div>
            <span aria-hidden className="mx-auto mt-5 block h-[3px] w-24 bg-gradient-x" />
          </figure>
        </Reveal>
      </div>
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

export function Closing({ onContact }: { onContact: () => void }) {
  const wa = whatsappHref();
  return (
    <section className="hero-glow relative overflow-hidden border-t border-border">
      <div aria-hidden className="tech-grid absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <XMark className="scroll-drift pointer-events-none absolute -right-24 top-16 hidden w-[480px] opacity-25 lg:block" />
      <div className="container-v3x section-y relative">
        <span className="eyebrow">Próximo passo</span>
        <h2 className="t-h2 mt-7 font-semibold">
          <SplitWords text="Vamos construir" />
          <SplitWords text="algo que importa." className="text-gradient-x" />
        </h2>
        <p className="t-lead mt-6 max-w-lg text-muted-foreground">
          Conte o que você precisa. Respondemos em até 1 dia útil, com um caminho claro para o seu projeto.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <button type="button" onClick={onContact} className="btn-primary">
            Começar um projeto
            <ArrowUpRight className="size-5" />
          </button>
          {wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-outline">
              <WhatsAppIcon className="size-[18px]" />
              Conversar no WhatsApp
            </a>
          )}
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          Prefere e-mail?{" "}
          <a href={CONTACT_EMAIL_HREF} className="link-underline font-medium text-foreground">
            {CONTACT_EMAIL}
          </a>
        </p>
      </div>
    </section>
  );
}
