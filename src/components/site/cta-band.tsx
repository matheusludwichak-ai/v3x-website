import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { XMark } from "@/components/brand/XMark";
import { Reveal } from "@/components/reveal";

export function CtaBand({ title, highlight, lead }: { title: string; highlight: string; lead?: string }) {
  return (
    <section className="hero-glow relative overflow-hidden border-t border-border py-24 md:py-32">
      <XMark className="pointer-events-none absolute -right-24 top-1/2 hidden w-[480px] -translate-y-1/2 opacity-20 lg:block" />
      <Reveal className="relative mx-auto max-w-[1280px] px-6 md:px-12">
        <p className="eyebrow">Próximo passo</p>
        <h2 className="mt-6 max-w-[18ch] text-balance text-4xl font-semibold leading-[1.04] tracking-[-0.035em] md:text-6xl">
          {title} <span className="text-gradient-x">{highlight}</span>
        </h2>
        {lead && <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-muted-foreground">{lead}</p>}
        <Link href="/contato" className="btn-primary mt-10">
          Começar um projeto <ArrowUpRight className="size-5" />
        </Link>
      </Reveal>
    </section>
  );
}
