import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { XMark } from "@/components/brand/XMark";
import { Reveal } from "@/components/reveal";

export function CtaBand({ title, highlight, lead }: { title: string; highlight: string; lead?: string }) {
  return (
    <section className="hero-glow relative overflow-hidden border-t border-border section-y">
      <XMark className="pointer-events-none absolute -right-24 top-1/2 hidden w-[480px] -translate-y-1/2 opacity-20 lg:block" />
      <Reveal className="relative container-v3x">
        <p className="eyebrow">Próximo passo</p>
        <h2 className="t-h2 mt-6 max-w-[20ch] text-balance font-semibold">
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
