import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { ContactForm } from "@/components/contact-form";

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
  return (
    <>
      <PageHero
        eyebrow="Vamos conversar"
        crumb="Contato"
        title={<>Tem uma ideia? <span className="text-gradient-x">Vamos construir.</span></>}
        lead="Conte o que você está construindo e vamos encontrar a melhor forma de tirar sua ideia do papel."
      />

      <section className="mx-auto grid max-w-[1280px] gap-16 px-6 py-24 md:px-12 md:py-28 lg:grid-cols-12">
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
          <div className="mt-6 rounded-2xl border border-white/10 bg-[#07080f] p-6">
            <p className="text-sm text-muted-foreground">Prefere e-mail?</p>
            <a href="mailto:suporte@grupov3x.com.br" className="link-underline mt-2 inline-block text-lg font-medium">
              suporte@grupov3x.com.br
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
