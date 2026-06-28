"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/blog", label: "Blog" },
  { href: "/guias", label: "Guias" },
  { href: "/faq", label: "FAQ" },
  { href: "/estudos-de-caso", label: "Cases" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[rgba(11,11,11,0.97)] backdrop-blur-md border-b border-[#2A2A2A] shadow-[0_1px_40px_rgba(0,0,0,0.6)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-[76px] flex items-center justify-between relative">

          {/* Logo — bigger, black bg removed via mix-blend-mode */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/logo.png"
              alt="V3X — Estratégia · Escala · Performance"
              width={160}
              height={160}
              className="object-contain"
              style={{ width: "120px", height: "120px" }}
              priority
            />
          </Link>

          {/* Desktop Nav — absolutely centered */}
          <nav className="hidden md:flex items-center gap-9 absolute left-1/2 -translate-x-1/2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="relative text-[13px] font-[family-name:var(--font-montserrat)] font-semibold text-[#F3F3F3]/60 hover:text-white transition-colors duration-200 tracking-wider uppercase group py-1"
              >
                {l.label}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#F5C242] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Premium CTAs */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <Link
              href="https://pipeline.grupov3x.com.br"
              target="_blank"
              className="btn-border-glow text-[13px] font-[family-name:var(--font-montserrat)] font-semibold text-white transition-all duration-200 px-5 py-[9px] border border-[#F5C242]/60 bg-[#1A1A1A] hover:bg-[#252525] hover:border-[#F5C242] tracking-wide"
            >
              Pipeline
            </Link>
            <Link
              href="https://app.grupov3x.com.br"
              target="_blank"
              className="btn-glow-gold text-[13px] font-[family-name:var(--font-montserrat)] font-semibold bg-[#F5C242] text-[#0B0B0B] px-5 py-[9px] hover:bg-white transition-all duration-200 tracking-wide"
            >
              Diagnóstico Grátis
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[rgba(11,11,11,0.98)] backdrop-blur-md border-t border-[#2A2A2A] px-4 sm:px-6 py-5 flex flex-col">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-[13px] font-[family-name:var(--font-montserrat)] font-semibold text-[#F3F3F3]/70 hover:text-white transition-colors py-3 border-b border-[#1A1A1A] tracking-wider uppercase"
            >
              {l.label}
            </Link>
          ))}
          <div className="flex flex-col gap-3 mt-5 pt-4 border-t border-[#2A2A2A]">
            <Link
              href="https://pipeline.grupov3x.com.br"
              target="_blank"
              onClick={() => setOpen(false)}
              className="text-center text-sm font-[family-name:var(--font-montserrat)] font-semibold text-[#F3F3F3] px-4 py-3 border border-[#2A2A2A]"
            >
              V3X Pipeline
            </Link>
            <Link
              href="https://app.grupov3x.com.br"
              target="_blank"
              onClick={() => setOpen(false)}
              className="text-center text-sm font-[family-name:var(--font-montserrat)] font-semibold bg-[#F5C242] text-[#0B0B0B] px-4 py-3"
            >
              Diagnóstico Grátis
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
