"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { WhatsAppIcon } from "@/components/site/whatsapp-icon";
import { CONTACT_EMAIL, CONTACT_EMAIL_HREF, whatsappHref } from "@/config/contact";
import { useLeadFormTracking } from "@/lib/analytics/forms";
import { SplitReveal } from "./Reveal";
import { gsap, useGSAP, EASE, MOTION_OK, lockScroll } from "@/lib/motion";

const areas = [
  { area: "Negócios", text: "Visão comercial, prospecção e desenvolvimento de negócios." },
  { area: "Tecnologia", text: "Arquitetura de soluções e desenvolvimento dos sistemas." },
  { area: "Finanças", text: "Organização financeira e estruturação do negócio." },
];

export function Founders() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(".founders-frame", { clipPath: "inset(14% 12% 14% 12% round 28px)" }, { clipPath: "inset(0% 0% 0% 0% round 28px)", ease: "none", scrollTrigger: { trigger: ".founders-frame", start: "top bottom", end: "center 60%", scrub: 0.7 } });
        gsap.fromTo(".founders-img", { scale: 1.18 }, { scale: 1, ease: "none", scrollTrigger: { trigger: ".founders-frame", start: "top bottom", end: "bottom 40%", scrub: 0.7 } });
        gsap.from(".founders-area", { y: 24, autoAlpha: 0, duration: 1, ease: EASE, stagger: 0.1, scrollTrigger: { trigger: ".founders-areas", start: "top 85%", once: true } });
        gsap.from(".founders-line", { scaleX: 0, transformOrigin: "50% 50%", duration: 1.4, ease: EASE, scrollTrigger: { trigger: ".founders-line", start: "top 95%", once: true } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="fundadores" className="border-t border-border">
      <div className="container-v3x section-y">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <span className="eyebrow">Fundadores</span>
            <SplitReveal className="t-h2 mt-6 font-semibold">
              As pessoas por trás <span className="text-gradient-x">da V3X.</span>
            </SplitReveal>
            <p className="t-lead mt-6 max-w-md text-muted-foreground">
              Três perspectivas, uma visão: negócios, tecnologia e finanças trabalhando juntos desde o primeiro contato.
            </p>
            <dl className="founders-areas mt-10 grid gap-6 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {areas.map((a) => (
                <div key={a.area} className="founders-area border-t border-border pt-4">
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7fb2ff]">{a.area}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-foreground/85">{a.text}</dd>
                </div>
              ))}
            </dl>
            <Link href="/sobre" className="link-underline mt-10 inline-flex items-center gap-2 font-medium">
              Conhecer o estúdio <ArrowUpRight className="size-4" />
            </Link>
          </div>

          <figure className="relative lg:col-span-7">
            <div className="founders-frame relative ml-auto max-w-[760px] overflow-hidden rounded-[28px] border border-white/12 shadow-[0_40px_90px_-40px_rgba(56,130,246,0.45)]">
              <Image
                src="/work/v3x-team.jpg"
                alt="Isabella Christina (CTO), Matheus Ludwichak (CEO) e Emmanuelle Assanté (CFO), fundadores da V3X"
                width={3072}
                height={2048}
                sizes="(min-width: 1024px) 760px, 100vw"
                quality={90}
                className="founders-img h-auto w-full"
              />
            </div>
            <span aria-hidden className="founders-line mx-auto mt-6 block h-[3px] w-24 bg-gradient-x" />
          </figure>
        </div>
      </div>
    </section>
  );
}

type Status = "idle" | "sending" | "sent" | "error";

export function ContactDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const lead = useLeadFormTracking("contato_modal");

  useEffect(() => {
    lockScroll(open);
    return () => lockScroll(false);
  }, [open]);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    lead.submitted();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contato", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setStatus("error");
        setError(json.error ?? "Não foi possível enviar. Tente novamente.");
        lead.failed(res.status === 503 ? "unavailable" : res.status === 400 ? "validation" : "server");
        return;
      }
      lead.succeeded();
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
      setError("Não foi possível enviar. Verifique sua conexão e tente novamente.");
      lead.failed("network");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) { lead.closed(); setTimeout(() => setStatus("idle"), 300); } }}>
      <DialogContent data-lenis-prevent className="max-h-[90svh] overflow-y-auto border-border bg-surface sm:max-w-lg">
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
          <form onSubmit={submit} onFocusCapture={lead.onFocusCapture} onInvalidCapture={lead.invalid} className="space-y-4">
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
  const root = useRef<HTMLElement>(null);
  const wa = whatsappHref();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Arriving at the last step: the X draws itself and the light rises with the scroll.
        const arrive = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 85%", end: "center center", scrub: 0.8 } });
        arrive
          .fromTo(".closing-x-line", { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: "none", stagger: 0.15 }, 0)
          .fromTo(".closing-x-fill", { autoAlpha: 0 }, { autoAlpha: 0.1, ease: "none" }, 0.55)
          .fromTo(".closing-light", { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, ease: "none" }, 0);
        gsap.from(".contact-tile", { y: 40, autoAlpha: 0, duration: 1.1, ease: EASE, stagger: 0.1, scrollTrigger: { trigger: ".contact-tiles", start: "top 88%", once: true } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="contato" className="closing relative overflow-hidden border-t border-border">
      <div aria-hidden className="closing-light pointer-events-none absolute inset-0" />
      <div aria-hidden className="tech-grid absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_70%_40%,black,transparent_70%)]" />
      <svg aria-hidden viewBox="-8 -8 331 211" className="closing-x pointer-events-none absolute -right-[7%] top-[6%] hidden w-[40%] max-w-[560px] overflow-visible lg:block">
        <defs>
          <linearGradient id="closing-x-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3882F6" />
            <stop offset="1" stopColor="#8856CF" />
          </linearGradient>
        </defs>
        <g className="closing-x-fill" opacity="0.1">
          <polygon points="228,0 315,0 94,194 0,194" fill="url(#closing-x-g)" />
          <polygon points="5,0 98,0 301,194 208,194" fill="url(#closing-x-g)" />
        </g>
        <polygon className="closing-x-line" points="5,0 98,0 301,194 208,194" fill="none" stroke="url(#closing-x-g)" strokeWidth="1.2" pathLength={1} strokeLinejoin="round" />
        <polygon className="closing-x-line" points="228,0 315,0 94,194 0,194" fill="none" stroke="url(#closing-x-g)" strokeWidth="1.2" pathLength={1} strokeLinejoin="round" />
      </svg>

      <div className="container-v3x section-y relative">
        <span className="eyebrow">Próximo passo</span>
        <SplitReveal className="t-h2 mt-7 max-w-[16ch] font-semibold">
          Vamos construir <span className="text-gradient-x">algo que importa.</span>
        </SplitReveal>
        <p className="t-lead mt-6 max-w-lg text-muted-foreground">
          Conte o que você precisa. Respondemos em até 1 dia útil, com um caminho claro para o seu projeto.
        </p>

        <div className="contact-tiles mt-12 grid gap-4 md:grid-cols-3">
          <button type="button" onClick={onContact} data-tilt="3" data-track="cta_click" data-track-cta-name="abrir_formulario" className="contact-tile contact-tile-main group">
            <span className="contact-tile-kicker">Formulário</span>
            <span className="contact-tile-title">Começar um projeto</span>
            <span className="contact-tile-text">Algumas perguntas rápidas sobre o que você quer construir.</span>
            <span className="contact-tile-arrow"><ArrowUpRight className="size-5" /></span>
            <span aria-hidden className="tilt-light" />
          </button>
          {wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer" data-tilt="3" className="contact-tile group">
              <span className="contact-tile-kicker"><WhatsAppIcon className="size-4" /> WhatsApp</span>
              <span className="contact-tile-title">Conversar agora</span>
              <span className="contact-tile-text">Abre o WhatsApp com uma mensagem pronta. Você decide quando enviar.</span>
              <span className="contact-tile-arrow"><ArrowUpRight className="size-5" /></span>
              <span aria-hidden className="tilt-light" />
            </a>
          )}
          <a href={CONTACT_EMAIL_HREF} data-tilt="3" className="contact-tile group">
            <span className="contact-tile-kicker">E-mail</span>
            <span className="contact-tile-title contact-tile-email">{CONTACT_EMAIL.split("@")[0]}@<wbr />{CONTACT_EMAIL.split("@")[1]}</span>
            <span className="contact-tile-text">Para briefings, propostas e documentos.</span>
            <span className="contact-tile-arrow"><ArrowUpRight className="size-5" /></span>
            <span aria-hidden className="tilt-light" />
          </a>
        </div>
      </div>
    </section>
  );
}
