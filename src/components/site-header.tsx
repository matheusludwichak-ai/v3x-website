"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { MobileNav } from "@/components/mobile-nav";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/servicos", label: "Serviços" },
  { href: "/projetos", label: "Projetos" },
  { href: "/sobre", label: "Sobre" },
  { href: "/blog", label: "Blog" },
];

export function SiteHeader() {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header className="site-header fixed inset-x-0 top-0 z-50" data-scrolled={scrolled}>
      <div aria-hidden className="scroll-progress" />
      <div aria-hidden className="site-header-bg absolute inset-0 -z-10 border-b border-white/8 bg-background/85 backdrop-blur-md" />
      <div className="site-header-bar container-v3x flex h-[72px] items-center justify-between">
        <Link href="/" aria-label="V3X, página inicial" className="block">
          <Logo className="w-[104px]" />
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-9 text-sm md:flex">
          {NAV_LINKS.map((link) => {
            const active = path === link.href || path.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn("nav-link transition-colors hover:text-foreground", active ? "text-foreground" : "text-muted-foreground")}
              >
                {link.label}
                {active && <span aria-hidden className="absolute -bottom-2 left-0 h-[2px] w-full bg-gradient-x" />}
              </Link>
            );
          })}
          <Link href="/login" className="nav-link text-muted-foreground transition-colors hover:text-foreground">
            Control
          </Link>
        </nav>

        <Link href="/contato" className="btn-primary hidden h-10 px-5 text-sm md:inline-flex">
          Começar um projeto <ArrowUpRight className="size-4" />
        </Link>

        <MobileNav links={NAV_LINKS} />
      </div>
    </header>
  );
}
