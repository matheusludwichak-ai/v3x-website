"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CheckCircle2, ArrowRight, ShieldCheck, TrendingUp, Lightbulb } from "lucide-react";

// ─── Radio option component ───────────────────────────────────────────────────

function RadioOption({
  value,
  label,
  selected,
  onSelect,
}: {
  value: string;
  label: string;
  selected: string;
  onSelect: (v: string) => void;
}) {
  return (
    <label
      onClick={() => onSelect(value)}
      className="flex items-center gap-3 cursor-pointer group py-2"
    >
      <div
        className={`w-4 h-4 border flex-shrink-0 flex items-center justify-center transition-all duration-150 ${
          selected === value
            ? "border-[#F5C242] bg-[#F5C242]/10"
            : "border-[#3A3A3A] group-hover:border-[#F5C242]/40"
        }`}
      >
        {selected === value && <div className="w-1.5 h-1.5 bg-[#F5C242]" />}
      </div>
      <span
        className={`text-[13px] font-[family-name:var(--font-inter)] leading-snug transition-colors ${
          selected === value ? "text-white font-medium" : "text-[#F3F3F3]/50 group-hover:text-[#F3F3F3]/80"
        }`}
      >
        {label}
      </span>
    </label>
  );
}

// ─── Benefits ────────────────────────────────────────────────────────────────

const benefits = [
  {
    icon: ShieldCheck,
    title: "Descubra gargalos ocultos",
    desc: "Identifique o que está travando o crescimento que você ainda não consegue ver.",
  },
  {
    icon: TrendingUp,
    title: "Oportunidades de crescimento",
    desc: "Visualize onde sua empresa pode crescer com os recursos que já tem.",
  },
  {
    icon: Lightbulb,
    title: "Direcionamentos estratégicos",
    desc: "Receba orientações claras e priorizadas pelo impacto financeiro real.",
  },
];

// ─── Masks ───────────────────────────────────────────────────────────────────

function maskWhatsApp(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

// ─── Main component ──────────────────────────────────────────────────────────

export function AnaliseForm() {
  const router = useRouter();

  const [fields, setFields] = useState({
    nome: "",
    whatsapp: "",
    empresa: "",
    faturamento: "",
    colaboradores: "",
    areaFoco: "",
    crescimento: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = useCallback((key: string, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    if (error) setError("");
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fields.nome.trim() || !fields.whatsapp.trim() || !fields.empresa.trim()) {
      setError("Preencha nome, WhatsApp e nome da empresa.");
      return;
    }
    setLoading(true);
    try {
      // Fire Meta Pixel lead event if available
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "Lead");
      }
      // Fire Google conversion event if available
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "conversion", { send_to: "AW-CONVERSION_ID/CONVERSION_LABEL" });
      }
      await fetch("/api/analise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fields,
          origem: document.referrer || "direto",
        }),
      });
      router.push("/analise/obrigado");
    } catch {
      setLoading(false);
      setError("Erro ao enviar. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] flex flex-col">

      {/* ── Grid background ── */}
      <div
        className="fixed inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#F5C242 1px, transparent 1px), linear-gradient(90deg, #F5C242 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Glow ── */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#F5C242]/3 blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col flex-1">

        {/* ── Logo strip ── */}
        <div className="flex justify-center pt-8 pb-2">
          <Image
            src="/logo.png"
            alt="V3X"
            width={80}
            height={80}
            className="object-contain"
            style={{ width: "80px", height: "80px" }}
            priority
          />
        </div>

        {/* ── Hero ── */}
        <section className="text-center px-4 sm:px-6 pt-6 pb-10 max-w-3xl mx-auto w-full">
          <div className="inline-flex items-center gap-2 border border-[#2A2A2A] bg-[#1A1A1A] px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 bg-[#F5C242] animate-pulse" />
            <span className="text-[10px] font-[family-name:var(--font-montserrat)] font-bold tracking-[0.25em] uppercase text-[#F5C242]">
              Análise Estratégica Gratuita
            </span>
          </div>

          <h1 className="font-[family-name:var(--font-anton)] text-[38px] sm:text-[52px] lg:text-[64px] text-white leading-tight tracking-wide mb-5">
            DESCUBRA OS GARGALOS<br className="hidden sm:block" />{" "}
            <span className="text-[#F5C242]">INVISÍVEIS DA SUA EMPRESA</span>
          </h1>

          <p className="text-[15px] sm:text-[16px] text-[#F3F3F3]/55 font-[family-name:var(--font-inter)] leading-relaxed max-w-xl mx-auto">
            Receba gratuitamente uma análise estratégica para identificar oportunidades reais de crescimento.
          </p>
        </section>

        {/* ── Benefits ── */}
        <section className="px-4 sm:px-6 pb-12 max-w-4xl mx-auto w-full">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#1A1A1A]">
            {benefits.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-[#0B0B0B] p-6 flex flex-col gap-3">
                <div className="w-9 h-9 border border-[#2A2A2A] flex items-center justify-center">
                  <Icon size={16} className="text-[#F5C242]" />
                </div>
                <p className="text-[13px] font-[family-name:var(--font-montserrat)] font-bold text-white">
                  {title}
                </p>
                <p className="text-[12px] text-[#F3F3F3]/40 font-[family-name:var(--font-inter)] leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Form ── */}
        <section className="px-4 sm:px-6 pb-16 max-w-2xl mx-auto w-full">
          <div className="border border-[#2A2A2A] bg-[#0F0F0F]">

            <div className="border-b border-[#1A1A1A] px-8 py-5">
              <p className="text-[11px] font-[family-name:var(--font-montserrat)] font-bold text-[#F5C242] tracking-[0.2em] uppercase">
                Preencha os dados abaixo
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-7">

              {/* ─ Text inputs ─ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { key: "nome", label: "Nome completo", placeholder: "Seu nome" },
                  { key: "empresa", label: "Nome da empresa", placeholder: "Nome da sua empresa" },
                ].map(({ key, label, placeholder }) => (
                  <div key={key} className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-[family-name:var(--font-montserrat)] font-bold text-[#F3F3F3]/40 tracking-widest uppercase">
                      {label}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={placeholder}
                      value={fields[key as keyof typeof fields]}
                      onChange={(e) => set(key, e.target.value)}
                      className="bg-[#0B0B0B] border border-[#2A2A2A] text-white text-[14px] font-[family-name:var(--font-inter)] placeholder:text-[#F3F3F3]/20 focus:outline-none focus:border-[#F5C242]/50 transition-colors px-4 py-3"
                    />
                  </div>
                ))}

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-[10px] font-[family-name:var(--font-montserrat)] font-bold text-[#F3F3F3]/40 tracking-widest uppercase">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(00) 00000-0000"
                    value={fields.whatsapp}
                    onChange={(e) => set("whatsapp", maskWhatsApp(e.target.value))}
                    className="bg-[#0B0B0B] border border-[#2A2A2A] text-white text-[14px] font-[family-name:var(--font-inter)] placeholder:text-[#F3F3F3]/20 focus:outline-none focus:border-[#F5C242]/50 transition-colors px-4 py-3"
                  />
                </div>
              </div>

              {/* ─ Divider ─ */}
              <div className="border-t border-[#1A1A1A]" />

              {/* ─ Faturamento ─ */}
              <div className="flex flex-col gap-3">
                <p className="text-[11px] font-[family-name:var(--font-montserrat)] font-bold text-[#F3F3F3]/50 tracking-widest uppercase">
                  Faturamento mensal
                </p>
                <div className="space-y-0.5">
                  {[
                    { value: "ate-30k", label: "Até R$ 30 mil" },
                    { value: "30k-100k", label: "R$ 30 mil a R$ 100 mil" },
                    { value: "100k-500k", label: "R$ 100 mil a R$ 500 mil" },
                    { value: "acima-500k", label: "Acima de R$ 500 mil" },
                  ].map((opt) => (
                    <RadioOption key={opt.value} {...opt} selected={fields.faturamento} onSelect={(v) => set("faturamento", v)} />
                  ))}
                </div>
              </div>

              {/* ─ Colaboradores ─ */}
              <div className="flex flex-col gap-3">
                <p className="text-[11px] font-[family-name:var(--font-montserrat)] font-bold text-[#F3F3F3]/50 tracking-widest uppercase">
                  Quantidade de colaboradores
                </p>
                <div className="space-y-0.5">
                  {[
                    { value: "apenas-eu", label: "Apenas eu" },
                    { value: "2-5", label: "2–5" },
                    { value: "6-20", label: "6–20" },
                    { value: "21-50", label: "21–50" },
                    { value: "mais-50", label: "Mais de 50" },
                  ].map((opt) => (
                    <RadioOption key={opt.value} {...opt} selected={fields.colaboradores} onSelect={(v) => set("colaboradores", v)} />
                  ))}
                </div>
              </div>

              {/* ─ Área de melhoria ─ */}
              <div className="flex flex-col gap-3">
                <p className="text-[11px] font-[family-name:var(--font-montserrat)] font-bold text-[#F3F3F3]/50 tracking-widest uppercase">
                  Qual área mais precisa de melhoria hoje?
                </p>
                <div className="grid grid-cols-2 gap-x-6">
                  {[
                    { value: "comercial", label: "Comercial" },
                    { value: "marketing", label: "Marketing" },
                    { value: "financeiro", label: "Financeiro" },
                    { value: "gestao", label: "Gestão" },
                    { value: "processos", label: "Processos" },
                    { value: "pessoas", label: "Pessoas" },
                  ].map((opt) => (
                    <RadioOption key={opt.value} {...opt} selected={fields.areaFoco} onSelect={(v) => set("areaFoco", v)} />
                  ))}
                </div>
              </div>

              {/* ─ Crescimento ─ */}
              <div className="flex flex-col gap-3">
                <p className="text-[11px] font-[family-name:var(--font-montserrat)] font-bold text-[#F3F3F3]/50 tracking-widest uppercase">
                  Você pretende crescer sua empresa nos próximos 12 meses?
                </p>
                <div className="space-y-0.5">
                  {[
                    { value: "sim", label: "Sim" },
                    { value: "talvez", label: "Talvez" },
                    { value: "ainda-nao", label: "Ainda não" },
                  ].map((opt) => (
                    <RadioOption key={opt.value} {...opt} selected={fields.crescimento} onSelect={(v) => set("crescimento", v)} />
                  ))}
                </div>
              </div>

              {/* ─ Error ─ */}
              {error && (
                <p className="text-[12px] text-red-400 font-[family-name:var(--font-inter)]">{error}</p>
              )}

              {/* ─ Submit ─ */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-glow-gold font-[family-name:var(--font-montserrat)] font-bold text-[14px] bg-[#F5C242] text-[#0B0B0B] py-4 px-8 hover:bg-white transition-all duration-200 tracking-wide disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#0B0B0B]/30 border-t-[#0B0B0B] rounded-full animate-spin" />
                    Enviando...
                  </span>
                ) : (
                  <>
                    Solicitar Minha Análise Gratuita
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <p className="text-[11px] text-[#F3F3F3]/25 text-center font-[family-name:var(--font-inter)] leading-relaxed">
                Suas informações são confidenciais e utilizadas apenas para análise interna.
              </p>
            </form>
          </div>
        </section>

        {/* ── Footer minimal ── */}
        <div className="mt-auto border-t border-[#1A1A1A] py-5 text-center">
          <p className="text-[11px] text-[#F3F3F3]/20 font-[family-name:var(--font-inter)]">
            © {new Date().getFullYear()} Grupo V3X · grupov3x.com.br
          </p>
        </div>
      </div>
    </div>
  );
}
