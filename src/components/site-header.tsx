import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { MobileNav } from "@/components/mobile-nav";

const NAV_LINKS = [
  { href: "/servicos", label: "Serviços" },
  { href: "/projetos", label: "Projetos" },
  { href: "/sobre", label: "Sobre" },
  { href: "/blog", label: "Blog" },
];

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6">
        <Link href="/" aria-label="V3X — início" className="flex items-center gap-2">
          <Logo className="text-2xl" />
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="label-mono relative text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/login" className="label-mono transition-colors hover:text-primary">
            Control ↗
          </Link>
        </nav>

        <div className="hidden items-center md:flex">
          <Link
            href="/contato"
            className="label-mono inline-flex h-10 items-center rounded-sm border border-border bg-primary px-5 text-primary-foreground transition-all hover:-translate-y-px hover:brightness-110"
          >
            Start a project
          </Link>
        </div>

        <MobileNav links={NAV_LINKS} />
      </div>
    </header>
  );
}
