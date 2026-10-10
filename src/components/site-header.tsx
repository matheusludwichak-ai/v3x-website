"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { MobileNav } from "@/components/mobile-nav";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/servicos", label: "Serviços", section: "servicos" },
  { href: "/projetos", label: "Projetos", section: "projetos" },
  { href: "/sobre", label: "Sobre", section: "fundadores" },
  { href: "/blog", label: "Blog" },
];

export function SiteHeader() {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [section, setSection] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  // On the home page, the link of the section on screen is highlighted.
  useEffect(() => {
    if (path !== "/") return;
    const ids = NAV_LINKS.flatMap((l) => (l.section ? [l.section] : []));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setSection(e.target.id);
          else setSection((cur) => (cur === e.target.id ? null : cur));
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => {
      io.disconnect();
      setSection(null);
    };
  }, [path]);

  return (
    <header className="site-header fixed inset-x-0 top-0 z-50" data-scrolled={scrolled}>
      <div aria-hidden className="scroll-progress" />
      <div aria-hidden className="site-header-bg absolute inset-0 -z-10 border-b border-white/8 bg-background/85 backdrop-blur-md" />
      <div className="site-header-bar container-v3x flex h-[72px] items-center justify-between">
        <Link href="/" aria-label="V3X, página inicial" className="block">
          <Logo className="w-[104px]" />
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-9 text-sm lg:flex">
          {NAV_LINKS.map((link) => {
            const active = path === link.href || path.startsWith(`${link.href}/`);
            const here = !active && path === "/" && link.section === section;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn("nav-link transition-colors duration-500 hover:text-foreground", active || here ? "text-foreground" : "text-muted-foreground")}
              >
                {link.label}
                <span aria-hidden className={cn("nav-indicator", (active || here) && "is-on")} />
              </Link>
            );
          })}
          <Link href="/login" className="nav-link text-muted-foreground transition-colors hover:text-foreground">
            Control
          </Link>
        </nav>

        <Link href="/contato" data-magnetic="0.2" className="btn-primary hidden h-10 px-5 text-sm lg:inline-flex">
          Começar um projeto <ArrowUpRight className="size-4" />
        </Link>

        <MobileNav links={NAV_LINKS} />
      </div>
    </header>
  );
}
