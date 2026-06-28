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
          ? "bg-[rgba(11,11,11,0.95)] backdrop-blur-md border-b border-[#2A2A2A]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="V3X — Estratégia · Escala · Performance"
            width={100}
            height={40}
            className="h-9 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-[family-name:var(--font-montserrat)] font-semibold text-[#F3F3F3] hover:text-[#F5C242] transition-colors tracking-wide uppercase"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="https://pipeline.grupov3x.com.br"
            target="_blank"
            className="text-sm font-[family-name:var(--font-montserrat)] font-semibold text-[#F3F3F3] hover:text-white transition-colors px-4 py-2 border border-[#2A2A2A] hover:border-[#F5C242]"
          >
            Pipeline
          </Link>
          <Link
            href="#diagnostico"
            className="text-sm font-[family-name:var(--font-montserrat)] font-semibold bg-[#F5C242] text-[#0B0B0B] px-4 py-2 hover:bg-white transition-colors"
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

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#0B0B0B] border-t border-[#2A2A2A] px-6 py-6 flex flex-col gap-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm font-[family-name:var(--font-montserrat)] font-semibold text-[#F3F3F3] hover:text-[#F5C242] transition-colors tracking-wide uppercase"
            >
              {l.label}
            </Link>
          ))}
          <div className="flex flex-col gap-3 mt-2 pt-4 border-t border-[#2A2A2A]">
            <Link
              href="https://pipeline.grupov3x.com.br"
              target="_blank"
              onClick={() => setOpen(false)}
              className="text-center text-sm font-[family-name:var(--font-montserrat)] font-semibold text-[#F3F3F3] px-4 py-3 border border-[#2A2A2A]"
            >
              V3X Pipeline
            </Link>
            <Link
              href="#diagnostico"
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
