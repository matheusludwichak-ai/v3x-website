"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, MessageCircle, ChevronLeft } from "lucide-react";

// ─── WhatsApp config ─────────────────────────────────────────────────────────

const WA_NUMBER = "5547992770101";
const WA_MSG = encodeURIComponent(
  "Olá Matheus! Vi o anúncio da V3X e quero saber mais sobre a Análise Estratégica Gratuita."
);
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_MSG}`;

// ─── Steps ───────────────────────────────────────────────────────────────────

type Step =
  | { type: "text"; key: string; question: string; placeholder: string; required?: boolean }
  | { type: "choice"; key: string; question: string; options: string[] };

const STEPS: Step[] = [
  {
    type: "text",
    key: "nome",
    question: "Qual é o seu nome?",
    placeholder: "Seu nome",
    required: true,
  },
  {
    type: "text",
    key: "whatsapp",
    question: "Qual é o seu WhatsApp?",
    placeholder: "(00) 00000-0000",
    required: true,
  },
  {
    type: "text",
    key: "empresa",
    question: "Qual é o nome da sua empresa?",
    placeholder: "Nome da empresa",
    required: true,
  },
  {
    type: "choice",
    key: "faturamento",
    question: "Qual é o faturamento mensal aproximado?",
    options: ["Até R$ 30 mil", "R$ 30 mil a R$ 100 mil", "R$ 100 mil a R$ 500 mil", "Acima de R$ 500 mil"],
  },
];

// ─── Mask ─────────────────────────────────────────────────────────────────────

function maskPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

// ─── WhatsApp button ──────────────────────────────────────────────────────────

function WAButton() {
  return (
    <a
      href={WA_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-[#25D366] text-white text-[13px] font-bold px-4 py-3 shadow-lg hover:bg-[#1ebe5d] transition-colors"
      style={{ fontFamily: "var(--font-montserrat)" }}
    >
      <MessageCircle size={18} />
      Falar no WhatsApp
    </a>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function Progress({ current, total }: { current: number; total: number }) {
  return (
    <div className="w-full h-[2px] bg-[#1A1A1A] mb-10">
      <div
        className="h-full bg-[#F5C242] transition-all duration-500"
        style={{ width: `${((current + 1) / total) * 100}%` }}
      />
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function AnaliseForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [textVal, setTextVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const current = STEPS[step];

  const advance = useCallback(
    async (value: string) => {
      const updated = { ...fields, [current.key]: value };
      setFields(updated);
      setTextVal("");
      setError("");

      if (step < STEPS.length - 1) {
        setStep((s) => s + 1);
        return;
      }

      // last step — submit
      setLoading(true);
      try {
        if (typeof window !== "undefined" && (window as any).fbq) {
          (window as any).fbq("track", "Lead");
        }
        const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
        if (scriptUrl) {
          const params = new URLSearchParams({
            ...updated,
            origem: document.referrer || "direto",
          });
          await fetch(`${scriptUrl}?${params.toString()}`, { method: "GET", mode: "no-cors" }).catch(() => null);
        }
        router.push("/analise/obrigado");
      } catch {
        setLoading(false);
        setError("Erro ao enviar. Tente novamente.");
      }
    },
    [current, fields, step, router]
  );

  const handleText = (e: React.FormEvent) => {
    e.preventDefault();
    const val = current.key === "whatsapp" ? textVal : textVal.trim();
    const isRequired = current.type === "text" && current.required;
    if (isRequired && !val) {
      setError("Campo obrigatório.");
      return;
    }
    advance(val);
  };

  const goBack = () => {
    if (step === 0) return;
    setStep((s) => s - 1);
    setTextVal(fields[STEPS[step - 1].key] ?? "");
    setError("");
  };

  return (
    <>
      <WAButton />

      <div className="min-h-screen bg-[#0B0B0B] flex flex-col">
        {/* grid bg */}
        <div
          className="fixed inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#F5C242 1px, transparent 1px), linear-gradient(90deg, #F5C242 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#F5C242]/3 blur-[120px] pointer-events-none" />

        <div className="relative z-10 flex flex-col flex-1">
          {/* logo */}
          <div className="flex justify-center pt-8 pb-2">
            <Image src="/logo.png" alt="V3X" width={64} height={64} className="object-contain" priority />
          </div>

          {/* badge */}
          <div className="flex justify-center mt-4 mb-2">
            <div className="inline-flex items-center gap-2 border border-[#2A2A2A] bg-[#1A1A1A] px-4 py-1.5">
              <span className="w-1.5 h-1.5 bg-[#F5C242] animate-pulse" />
              <span
                className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#F5C242]"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                Análise Estratégica Gratuita
              </span>
            </div>
          </div>

          {/* card */}
          <div className="flex-1 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-lg">
              <Progress current={step} total={STEPS.length} />

              {/* back */}
              {step > 0 && (
                <button
                  onClick={goBack}
                  className="flex items-center gap-1 text-[#F3F3F3]/30 hover:text-[#F3F3F3]/60 text-[12px] mb-6 transition-colors"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  <ChevronLeft size={14} /> Voltar
                </button>
              )}

              {/* step counter */}
              <p
                className="text-[10px] text-[#F3F3F3]/30 tracking-widest uppercase mb-3"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                {step + 1} / {STEPS.length}
              </p>

              {/* question */}
              <h2
                className="text-[28px] sm:text-[36px] text-white leading-tight mb-8"
                style={{ fontFamily: "var(--font-anton)", letterSpacing: "0.02em" }}
              >
                {current.question}
              </h2>

              {/* choices */}
              {current.type === "choice" && (
                <div className="flex flex-col gap-3">
                  {current.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => advance(opt)}
                      className="w-full text-left border border-[#2A2A2A] bg-[#0F0F0F] hover:border-[#F5C242]/60 hover:bg-[#F5C242]/5 text-white text-[15px] px-5 py-4 transition-all duration-150 flex items-center justify-between group"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {opt}
                      <ArrowRight size={14} className="text-[#F3F3F3]/20 group-hover:text-[#F5C242] transition-colors" />
                    </button>
                  ))}
                </div>
              )}

              {/* text input */}
              {current.type === "text" && (
                <form onSubmit={handleText} className="flex flex-col gap-4">
                  <input
                    autoFocus
                    type={current.key === "whatsapp" ? "tel" : "text"}
                    placeholder={current.placeholder}
                    value={current.key === "whatsapp" ? maskPhone(textVal) : textVal}
                    onChange={(e) =>
                      setTextVal(current.key === "whatsapp" ? e.target.value.replace(/\D/g, "").slice(0, 11) : e.target.value)
                    }
                    className="bg-[#0B0B0B] border border-[#2A2A2A] text-white text-[18px] placeholder:text-[#F3F3F3]/20 focus:outline-none focus:border-[#F5C242]/50 transition-colors px-5 py-4"
                    style={{ fontFamily: "var(--font-inter)" }}
                  />
                  {error && (
                    <p className="text-[12px] text-red-400" style={{ fontFamily: "var(--font-inter)" }}>
                      {error}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#F5C242] text-[#0B0B0B] font-bold text-[14px] py-4 hover:bg-white transition-all duration-200 tracking-wide disabled:opacity-60 flex items-center justify-center gap-2"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-[#0B0B0B]/30 border-t-[#0B0B0B] rounded-full animate-spin" />
                        Enviando...
                      </span>
                    ) : step === STEPS.length - 1 ? (
                      <>Solicitar minha análise <ArrowRight size={16} /></>
                    ) : (
                      <>Continuar <ArrowRight size={16} /></>
                    )}
                  </button>
                </form>
              )}

              <p
                className="text-[11px] text-[#F3F3F3]/20 text-center mt-8"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Suas informações são confidenciais e utilizadas apenas para análise interna.
              </p>
            </div>
          </div>

          {/* footer */}
          <div className="border-t border-[#1A1A1A] py-5 text-center">
            <p className="text-[11px] text-[#F3F3F3]/20" style={{ fontFamily: "var(--font-inter)" }}>
              © {new Date().getFullYear()} Grupo V3X · grupov3x.com.br
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
