"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { TrendingUp, Users } from "lucide-react";

const toolsPreview = [
  { slug: "calculadora-roi", label: "Calculadora de ROI", Icon: TrendingUp },
  { slug: "calculadora-cac", label: "Calculadora de CAC", Icon: Users },
];

export function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(40px)";
    el.style.transition = "opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s";
    requestAnimationFrame(() => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0B0B0B]">
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(#F5C242 1px, transparent 1px), linear-gradient(90deg, #F5C242 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] md:w-[700px] h-[500px] md:h-[700px] bg-[#F5C242]/4 blur-[140px] pointer-events-none animate-pulse" style={{ animationDuration: "4s" }} />

      {/* Corner accents */}
      <div className="hidden sm:block absolute top-24 left-0 w-32 h-px bg-gradient-to-r from-[#F5C242]/40 to-transparent" />
      <div className="hidden sm:block absolute top-24 left-0 w-px h-32 bg-gradient-to-b from-[#F5C242]/40 to-transparent" />
      <div className="hidden sm:block absolute top-24 right-0 w-32 h-px bg-gradient-to-l from-[#F5C242]/40 to-transparent" />
      <div className="hidden sm:block absolute top-24 right-0 w-px h-32 bg-gradient-to-b from-[#F5C242]/40 to-transparent" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-24 pb-16">
        {/* Eyebrow */}
        <div
          className="inline-flex items-center gap-2 border border-[#2A2A2A] bg-[#1A1A1A] px-4 py-2 mb-8"
          style={{ opacity: 0, animation: "fadeInDown 0.6s ease 0.2s forwards" }}
        >
          <span className="w-1.5 h-1.5 bg-[#F5C242] animate-pulse" />
          <span className="text-xs font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.2em] uppercase text-[#F5C242]">
            Estratégia · Escala · Performance
          </span>
        </div>

        {/* Headline */}
        <h1
          ref={titleRef}
          className="font-[family-name:var(--font-anton)] text-5xl sm:text-7xl md:text-8xl text-white leading-none tracking-wide mb-6"
        >
          GESTÃO COM DADOS,
          <br />
          <span className="text-[#F5C242]">CRESCIMENTO COM MÉTODO</span>
        </h1>

        {/* Sub */}
        <p
          className="text-base sm:text-lg text-[#F3F3F3]/60 font-[family-name:var(--font-inter)] max-w-2xl mx-auto leading-relaxed mb-10"
          style={{ opacity: 0, animation: "fadeInUp 0.7s ease 0.5s forwards" }}
        >
          Ferramentas gratuitas, conteúdo estratégico e diagnóstico empresarial
          para quem quer entender o negócio antes de tomar decisão.
        </p>

        {/* Tool shortcuts */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8"
          style={{ opacity: 0, animation: "fadeInUp 0.7s ease 0.65s forwards" }}
        >
          {toolsPreview.map(({ slug, label, Icon }) => (
            <Link
              key={slug}
              href={`/ferramentas/${slug}`}
              className="group flex items-center gap-2.5 border border-[#2A2A2A] bg-[#111111] hover:border-[#F5C242]/40 hover:bg-[#141414] transition-all duration-200 px-4 py-2.5 text-[12px] font-[family-name:var(--font-montserrat)] font-semibold text-[#F3F3F3]/50 hover:text-white tracking-wide w-full sm:w-auto justify-center"
            >
              <Icon size={13} className="text-[#F5C242]/60 group-hover:text-[#F5C242] transition-colors" />
              {label}
              <span className="text-[#F5C242]/40 group-hover:text-[#F5C242] transition-colors group-hover:translate-x-0.5 inline-block">→</span>
            </Link>
          ))}
          <Link
            href="/ferramentas"
            className="text-[11px] font-[family-name:var(--font-montserrat)] font-semibold text-[#F3F3F3]/25 hover:text-[#F5C242]/60 transition-colors tracking-wider"
          >
            +18 ferramentas →
          </Link>
        </div>

        {/* Primary CTA */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          style={{ opacity: 0, animation: "fadeInUp 0.7s ease 0.8s forwards" }}
        >
          <Link
            href="https://app.grupov3x.com.br"
            target="_blank"
            className="group w-full sm:w-auto font-[family-name:var(--font-montserrat)] font-semibold text-sm bg-[#F5C242] text-[#0B0B0B] px-8 py-4 hover:bg-white transition-all duration-200 hover:scale-[1.02] tracking-wide text-center"
          >
            Diagnóstico Gratuito
            <span className="inline-block ml-1 group-hover:translate-x-1 transition-transform duration-200">→</span>
          </Link>
          <Link
            href="/guias"
            className="w-full sm:w-auto font-[family-name:var(--font-montserrat)] font-semibold text-sm border border-[#2A2A2A] text-[#F3F3F3] px-8 py-4 hover:border-[#F5C242]/40 hover:text-white transition-all duration-200 tracking-wide text-center"
          >
            Ver Guias →
          </Link>
        </div>

        {/* Stats */}
        <div
          className="mt-14 md:mt-16 pt-8 border-t border-[#2A2A2A] grid grid-cols-3 gap-4 md:gap-6 max-w-xl mx-auto"
          style={{ opacity: 0, animation: "fadeInUp 0.7s ease 1s forwards" }}
        >
          {[
            { value: "R$ 4M+", label: "Gerados pelo método" },
            { value: "20", label: "Ferramentas gratuitas" },
            { value: "15 min", label: "Para o diagnóstico" },
          ].map((s) => (
            <div key={s.label} className="text-center group cursor-default">
              <p className="font-[family-name:var(--font-bebas)] text-2xl sm:text-3xl text-[#F5C242] tracking-wide group-hover:scale-110 transition-transform duration-200">
                {s.value}
              </p>
              <p className="text-[10px] sm:text-xs text-[#F3F3F3]/40 font-[family-name:var(--font-inter)] mt-1 leading-tight">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-16px); }
          to { opacity: 1; transform: none; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </section>
  );
}
