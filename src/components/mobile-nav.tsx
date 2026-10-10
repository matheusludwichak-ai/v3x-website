"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function MobileNav({ links }: { links: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative z-50 flex h-11 w-11 flex-col items-center justify-center gap-[5px]"
      >
        <span className={`block h-[1.5px] w-6 bg-foreground transition-transform ${open ? "translate-y-[3.25px] rotate-45" : ""}`} />
        <span className={`block h-[1.5px] w-6 bg-foreground transition-transform ${open ? "-translate-y-[3.25px] -rotate-45" : ""}`} />
      </button>

      {open && (
        <div className="hero-glow fixed inset-0 top-[60px] z-40 flex flex-col justify-between bg-background px-6 pb-10 pt-8">
          <nav aria-label="Menu mobile" className="flex flex-col">
            {[{ href: "/", label: "Início" }, ...links, { href: "/contato", label: "Contato" }].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-border py-4 text-3xl font-semibold tracking-tight text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/login" onClick={() => setOpen(false)} className="border-b border-border py-4 text-base text-muted-foreground">
              Control
            </Link>
          </nav>
          <Link href="/contato" onClick={() => setOpen(false)} className="btn-primary justify-center">
            Começar um projeto <ArrowUpRight className="size-5" />
          </Link>
        </div>
      )}
    </div>
  );
}
