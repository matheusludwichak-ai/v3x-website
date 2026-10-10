import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { ContactForm } from "@/components/contact-form";
import { WhatsAppIcon } from "@/components/site/whatsapp-icon";
import { CONTACT_EMAIL, CONTACT_EMAIL_HREF, WHATSAPP_DISPLAY, whatsappHref } from "@/config/contact";

export const metadata: Metadata = {
  title: "Contato",
  description: "Conte o que você está construindo. Respondemos em até 1 dia útil com um caminho claro para tirar sua ideia do papel.",
  alternates: { canonical: "https://grupov3x.com.br/contato" },
};

const steps = [
  { title: "Você conta o que precisa", text: "Quanto mais contexto, mais útil será a nossa resposta." },
  { title: "Respondemos em até 1 dia útil", text: "Com perguntas objetivas ou uma proposta de próxima conversa." },
  { title: "Escopo claro antes de começar", text: "Prazo, entregas e investimento definidos por escrito." },
];

export default function ContatoPage() {
  const wa = whatsappHref();
  return (
    <>
      <PageHero
        eyebrow="Vamos conversar"
        crumb="Contato"
        title={<>Tem uma ideia? <span className="text-gradient-x">Vamos construir.</span></>}
        lead="Conte o que você está construindo e vamos encontrar a melhor forma de tirar sua ideia do papel."
      />

      <section className="container-v3x grid gap-16 section-y lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow">Como funciona</p>
          <ol className="mt-8">
            {steps.map((step, i) => (
              <li key={step.title} className="flex gap-5 border-t border-border py-6">
                <span className="text-gradient-x text-2xl font-bold tracking-tight">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="block text-lg font-medium">{step.title}</span>
                  <span className="mt-1 block text-[15px] leading-relaxed text-muted-foreground">{step.text}</span>
                </span>
              </li>
            ))}
          </ol>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="group rounded-2xl border border-white/10 bg-[#07080f] p-6 transition-colors hover:border-white/25">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <WhatsAppIcon className="size-4 text-foreground" /> WhatsApp
                </span>
                <span className="mt-2 block text-lg font-medium">{WHATSAPP_DISPLAY}</span>
                <span className="mt-1 block text-xs text-muted-foreground">Abre uma conversa com mensagem pronta</span>
              </a>
            )}
            <a href={CONTACT_EMAIL_HREF} className="group rounded-2xl border border-white/10 bg-[#07080f] p-6 transition-colors hover:border-white/25">
              <span className="text-sm text-muted-foreground">E-mail</span>
              <span className="mt-2 block break-all text-lg font-medium">{CONTACT_EMAIL}</span>
              <span className="mt-1 block text-xs text-muted-foreground">Respondemos em até 1 dia útil</span>
            </a>
          </div>
        </Reveal>

        <Reveal delay={100} className="lg:col-span-7">
          <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.01] p-6 sm:p-10">
            <ContactForm />
          </div>
        </Reveal>
      </section>
    </>
  );
}
