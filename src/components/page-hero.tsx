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
    <section className="bg-ink pb-16 pt-36 text-on-ink md:pb-20 md:pt-44">
      <div className="mx-auto max-w-[1280px] px-6">
        <nav aria-label="Breadcrumb" className="numbering flex items-center gap-2 text-dark-400">
          <Link href="/" className="hover:text-on-ink">
            V3X
          </Link>
          <span>/</span>
          <span className="text-dark-600">{crumb}</span>
        </nav>
        <p className="eyebrow mt-8 text-dark-600">{eyebrow}</p>
        <h1 className="mt-4 max-w-[26ch] text-4xl font-bold tracking-tight md:text-6xl">{title}</h1>
        {lead && <p className="mt-6 max-w-[56ch] text-lg leading-relaxed text-dark-600">{lead}</p>}
        {children}
      </div>
    </section>
  );
}
