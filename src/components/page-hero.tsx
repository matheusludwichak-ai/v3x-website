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
    <section className="hero-glow relative overflow-hidden border-b border-border pb-14 pt-32 md:pb-20 md:pt-40">
      <div
        aria-hidden
        className="tech-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_70%_80%_at_20%_40%,black,transparent_75%)]"
      />
      <div className="relative container-v3x">
        <nav aria-label="Trilha de navegação" className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">
            Início
          </Link>
          <span aria-hidden>/</span>
          <span className="text-foreground/90">{crumb}</span>
        </nav>
        <p className="eyebrow mt-10">{eyebrow}</p>
        <h1 className="hero-in t-display mt-6 max-w-[22ch] text-balance font-semibold">
          {title}
        </h1>
        {lead && (
          <p className="hero-in hero-in-2 t-lead mt-6 max-w-[58ch] text-muted-foreground">{lead}</p>
        )}
        {children}
      </div>
    </section>
  );
}
