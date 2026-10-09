import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contato",
  description: "Conte-nos o que você está construindo. Vamos explorar a melhor forma de tirar sua ideia do papel.",
  alternates: { canonical: "https://grupov3x.com.br/contato" },
};

export default function ContatoPage() {
  return (
    <>
      <PageHero
        eyebrow="Vamos conversar"
        crumb="Contato"
        title="Have an idea? Let's build it."
        lead="Conte-nos o que você está construindo e vamos explorar a melhor forma de tirar sua ideia do papel."
      />

      <section className="bg-paper py-20 md:py-28">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-16 px-6 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <p className="eyebrow text-neutral-600">Outro jeito de falar com a gente</p>
            <a
              href="mailto:suporte@grupov3x.com.br"
              className="mt-4 block border-t border-neutral-200 pt-6 text-xl font-medium text-ink hover:text-accent"
            >
              suporte@grupov3x.com.br
            </a>
            <p className="mt-10 max-w-[40ch] text-[15px] leading-relaxed text-neutral-600">
              Respondemos em até 1 dia útil. Se preferir, descreva o projeto no formulário ao lado
              — quanto mais contexto, mais rápido conseguimos te responder com algo útil.
            </p>
          </Reveal>

          <Reveal delay={100}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
