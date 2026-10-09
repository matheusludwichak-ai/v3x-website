import Link from "next/link";
import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  lead,
  crumb,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  crumb: string;
  children?: ReactNode;
}) {
  return (
    <section className="hero-glow relative overflow-hidden border-b border-border pb-16 pt-36 md:pb-24 md:pt-44">
      <div
        aria-hidden
        className="tech-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_70%_80%_at_20%_40%,black,transparent_75%)]"
      />
      <div className="relative mx-auto max-w-[1280px] px-6 md:px-12">
        <nav aria-label="Trilha de navegação" className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">
            Início
          </Link>
          <span aria-hidden>/</span>
          <span className="text-foreground/90">{crumb}</span>
        </nav>
        <p className="eyebrow mt-10">{eyebrow}</p>
        <h1 className="hero-in mt-6 max-w-[20ch] text-balance text-4xl font-semibold leading-[1.04] tracking-[-0.035em] md:text-6xl lg:text-7xl">
          {title}
        </h1>
        {lead && (
          <p className="hero-in hero-in-2 mt-6 max-w-[58ch] text-lg leading-relaxed text-muted-foreground">{lead}</p>
        )}
        {children}
      </div>
    </section>
  );
}
