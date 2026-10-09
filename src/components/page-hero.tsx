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
    <section className="border-b border-border bg-surface/40 pb-16 pt-36 text-foreground md:pb-20 md:pt-44">
      <div className="mx-auto max-w-[1280px] px-6">
        <nav aria-label="Breadcrumb" className="label-mono flex items-center gap-2 text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            V3X
          </Link>
          <span>/</span>
          <span>{crumb}</span>
        </nav>
        <p className="label-mono mt-8 text-muted-foreground">{eyebrow}</p>
        <h1 className="mt-4 max-w-[26ch] text-4xl font-bold tracking-tight md:text-6xl">{title}</h1>
        {lead && <p className="mt-6 max-w-[56ch] text-lg leading-relaxed text-muted-foreground">{lead}</p>}
        {children}
      </div>
    </section>
  );
}
