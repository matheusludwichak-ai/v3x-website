"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

export default function ObrigadoPage() {
  const [countdown, setCountdown] = useState(8);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          window.location.href = "https://grupov3x.com.br";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0B0B] flex flex-col items-center justify-center px-4 text-center">
      {/* Grid bg */}
      <div
        className="fixed inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#F5C242 1px, transparent 1px), linear-gradient(90deg, #F5C242 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-[#F5C242]/4 blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-lg w-full">

        <Image
          src="/logo.png"
          alt="V3X"
          width={72}
          height={72}
          className="object-contain mb-8"
          style={{ width: "72px", height: "72px" }}
        />

        <div className="w-14 h-14 border border-[#F5C242]/30 flex items-center justify-center mb-6">
          <CheckCircle2 size={26} className="text-[#F5C242]" />
        </div>

        <p className="text-[10px] font-[family-name:var(--font-montserrat)] font-bold text-[#F5C242] tracking-[0.3em] uppercase mb-4">
          Solicitação Recebida
        </p>

        <h1 className="font-[family-name:var(--font-anton)] text-[40px] sm:text-[52px] text-white leading-tight mb-5">
          SOLICITAÇÃO<br />RECEBIDA!
        </h1>

        <p className="text-[14px] text-[#F3F3F3]/50 font-[family-name:var(--font-inter)] leading-relaxed mb-8 max-w-sm">
          Recebemos sua solicitação. Nossa equipe analisará as informações e entrará em contato caso sua empresa esteja dentro do perfil da análise.
        </p>

        <Link
          href="https://grupov3x.com.br"
          className="btn-glow-gold font-[family-name:var(--font-montserrat)] font-bold text-[13px] bg-[#F5C242] text-[#0B0B0B] px-8 py-3.5 hover:bg-white transition-all duration-200 tracking-wide mb-8"
        >
          Conhecer o Grupo V3X →
        </Link>

        <p className="text-[11px] text-[#F3F3F3]/20 font-[family-name:var(--font-inter)]">
          Redirecionando automaticamente em {countdown}s...
        </p>
      </div>
    </div>
  );
}
