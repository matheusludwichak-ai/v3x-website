import Link from "next/link";
import Image from "next/image";
import { MobileNav } from "@/components/mobile-nav";

const NAV_LINKS = [
  { href: "/servicos", label: "Serviços" },
  { href: "/projetos", label: "Projetos" },
  { href: "/sobre", label: "Sobre" },
  { href: "/blog", label: "Blog" },
];

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-neutral-200/70 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6">
        <Link href="/" aria-label="V3X — início" className="flex items-center gap-2">
          <Image
            src="/brand/logo-dark.png"
            alt="V3X — Digital Product Studio"
            width={104}
            height={28}
            priority
            className="h-[22px] w-auto"
          />
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="eyebrow relative text-neutral-800 transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center md:flex">
          <Link
            href="/contato"
            className="eyebrow inline-flex h-10 items-center rounded-[4px] border border-ink bg-ink px-5 text-[#F3F2EE] transition-all hover:-translate-y-px hover:bg-neutral-800"
          >
            Start a project
          </Link>
        </div>

        <MobileNav links={NAV_LINKS} />
      </div>
    </header>
  );
}
