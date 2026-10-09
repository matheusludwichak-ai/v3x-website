"use client";

import Image from "next/image";
import { CheckCircle2, MessageCircle } from "lucide-react";

const WA_NUMBER = "5547992770101";
const WA_MSG = encodeURIComponent(
  "Olá Matheus! Acabei de preencher o formulário da V3X e gostaria de conversar sobre a Análise Estratégica Gratuita."
);
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_MSG}`;

export default function ObrigadoPage() {
  return (
    <div className="min-h-screen bg-[#0B0B0B] flex flex-col items-center justify-center px-4 text-center">
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
          Concluído
        </p>

        <h1 className="font-[family-name:var(--font-anton)] text-[40px] sm:text-[52px] text-white leading-tight mb-5">
          RECEBEMOS<br />SUA SOLICITAÇÃO
        </h1>

        <p className="text-[15px] text-[#F3F3F3]/50 font-[family-name:var(--font-inter)] leading-relaxed mb-10 max-w-sm">
          Analisaremos as informações e entraremos em contato em breve. Se preferir, você pode me chamar agora no WhatsApp.
        </p>

        <a
          href={WA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-[#25D366] text-white font-[family-name:var(--font-montserrat)] font-bold text-[14px] px-8 py-4 hover:bg-[#1ebe5d] transition-all duration-200 tracking-wide"
        >
          <MessageCircle size={18} />
          Falar com Matheus no WhatsApp
        </a>

        <p className="text-[11px] text-[#F3F3F3]/20 font-[family-name:var(--font-inter)] mt-8">
          © {new Date().getFullYear()} Grupo V3X · grupov3x.com.br
        </p>
      </div>
    </div>
  );
}
