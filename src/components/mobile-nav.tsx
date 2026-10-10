"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { CONTACT_EMAIL, CONTACT_EMAIL_HREF } from "@/config/contact";
import { lockScroll } from "@/lib/motion";
import { track } from "@/lib/analytics/track";

export function MobileNav({ links }: { links: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const items = [{ href: "/", label: "Início" }, ...links, { href: "/contato", label: "Contato" }];

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const html = document.documentElement;
    html.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      lockScroll(false);
      html.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => {
          track("menu_toggle", { menu_state: open ? "close" : "open" });
          setOpen((v) => !v);
        }}
        className="relative z-50 flex h-11 w-11 flex-col items-center justify-center gap-[5px]"
      >
        <span className={`block h-[1.5px] w-6 bg-foreground transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? "translate-y-[3.25px] rotate-45" : ""}`} />
        <span className={`block h-[1.5px] w-6 bg-foreground transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? "-translate-y-[3.25px] -rotate-45" : ""}`} />
      </button>

      <div id="mobile-menu" className="mnav fixed inset-0 top-[60px] z-40 flex flex-col justify-between overflow-y-auto bg-background px-6 pb-10 pt-6" data-open={open} inert={!open} data-track-area="mobile_menu">
        <div aria-hidden className="hero-glow pointer-events-none absolute inset-0" />
        <nav aria-label="Menu mobile" className="relative flex flex-col">
          {items.map((link, i) => {
            const active = link.href === "/" ? path === "/" : path.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                style={{ "--i": i } as React.CSSProperties}
                className="mnav-item flex items-center justify-between border-b border-border py-4 text-3xl font-semibold tracking-tight"
              >
                <span className={active ? "text-gradient-x" : "text-foreground"}>{link.label}</span>
                <span className="text-xs font-semibold tracking-[0.18em] text-[#7fb2ff]">{String(i + 1).padStart(2, "0")}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mnav-item relative mt-10 space-y-5" style={{ "--i": items.length + 1 } as React.CSSProperties}>
          <Link href="/contato" onClick={() => setOpen(false)} data-track="cta_click" data-track-cta-name="comecar_projeto" className="btn-primary w-full justify-center">
            Começar um projeto <ArrowUpRight className="size-5" />
          </Link>
          <a href={CONTACT_EMAIL_HREF} className="block text-center text-sm text-muted-foreground">{CONTACT_EMAIL}</a>
        </div>
      </div>
    </div>
  );
}
