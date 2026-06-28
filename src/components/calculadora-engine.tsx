"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Copy, RotateCcw, CheckCheck, ArrowRight, ChevronRight } from "lucide-react";
import { calculadoras } from "@/data/calculadoras";
import type { CalcResult } from "@/data/calculadoras";

interface Props {
  slug: string;
  name: string;
  relatedBlogSlug: string;
  relatedBlogTitle: string;
}

function parseBRL(raw: string): number {
  const cleaned = raw.replace(/[^\d,]/g, "").replace(",", ".");
  return parseFloat(cleaned) || 0;
}

function formatInput(raw: string, prefix?: string, suffix?: string): string {
  if (!raw) return "";
  const n = parseFloat(raw.replace(",", "."));
  if (isNaN(n)) return raw;
  if (prefix === "R$") {
    return n.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }
  return raw;
}

export function CalculadoraEngine({ slug, name, relatedBlogSlug, relatedBlogTitle }: Props) {
  const config = calculadoras[slug];
  if (!config) return null;

  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(config.fields.map((f) => [f.key, f.defaultValue !== undefined ? String(f.defaultValue) : ""]))
  );
  const [copied, setCopied] = useState(false);

  const numValues = Object.fromEntries(
    config.fields.map((f) => {
      const raw = values[f.key] || "0";
      const n = parseFloat(raw.replace(/\./g, "").replace(",", "."));
      return [f.key, isNaN(n) ? 0 : n];
    })
  );

  const results: CalcResult[] | null = config.calculate(numValues);
  const interpretation = results ? config.interpret(numValues, results) : "";

  const handleChange = useCallback((key: string, val: string) => {
    const cleaned = val.replace(/[^0-9.,]/g, "");
    setValues((prev) => ({ ...prev, [key]: cleaned }));
  }, []);

  const handleClear = useCallback(() => {
    setValues(Object.fromEntries(config.fields.map((f) => [f.key, ""])));
  }, [config.fields]);

  const handleCopy = useCallback(() => {
    if (!results) return;
    const text = results.map((r) => `${r.label}: ${r.value}`).join("\n") +
      (interpretation ? `\n\nAnálise: ${interpretation}` : "") +
      `\n\nCalculado em grupov3x.com.br/ferramentas/${slug}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }, [results, interpretation, slug]);

  return (
    <div className="max-w-3xl mx-auto">

      {/* Inputs */}
      <div className="border border-[#2A2A2A] bg-[#111111] p-6 sm:p-8 mb-6">
        <h2 className="text-xs font-[family-name:var(--font-montserrat)] font-bold text-[#F5C242] tracking-[0.2em] uppercase mb-6">
          Dados de Entrada
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {config.fields.map((field) => (
            <div key={field.key} className="flex flex-col gap-1.5">
              <label className="text-[11px] font-[family-name:var(--font-montserrat)] font-semibold text-[#F3F3F3]/50 tracking-widest uppercase">
                {field.label}
              </label>
              <div className="relative flex items-center">
                {field.prefix && (
                  <span className="absolute left-3 text-[13px] font-semibold text-[#F3F3F3]/40 pointer-events-none select-none">
                    {field.prefix}
                  </span>
                )}
                <input
                  type="text"
                  inputMode="decimal"
                  value={values[field.key]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className={`w-full bg-[#0B0B0B] border border-[#2A2A2A] text-white text-[14px] font-semibold placeholder:text-[#F3F3F3]/20 focus:outline-none focus:border-[#F5C242]/60 transition-colors py-3
                    ${field.prefix ? "pl-10 pr-4" : field.suffix ? "pl-4 pr-9" : "px-4"}`}
                />
                {field.suffix && (
                  <span className="absolute right-3 text-[13px] font-semibold text-[#F3F3F3]/40 pointer-events-none select-none">
                    {field.suffix}
                  </span>
                )}
              </div>
              {field.hint && (
                <span className="text-[11px] text-[#F3F3F3]/30 leading-relaxed">{field.hint}</span>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-6 pt-5 border-t border-[#1A1A1A]">
          <button
            onClick={handleClear}
            className="flex items-center gap-2 text-[12px] font-[family-name:var(--font-montserrat)] font-semibold text-[#F3F3F3]/40 hover:text-[#F3F3F3]/70 transition-colors py-2 px-3 border border-[#2A2A2A] hover:border-[#3A3A3A]"
          >
            <RotateCcw size={12} />
            Limpar
          </button>
          {results && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 text-[12px] font-[family-name:var(--font-montserrat)] font-semibold text-[#F3F3F3]/40 hover:text-[#F3F3F3]/70 transition-colors py-2 px-3 border border-[#2A2A2A] hover:border-[#3A3A3A]"
            >
              {copied ? <CheckCheck size={12} className="text-[#F5C242]" /> : <Copy size={12} />}
              {copied ? "Copiado!" : "Copiar Resultado"}
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {results ? (
        <div className="border border-[#F5C242]/20 bg-[#0F0E09] p-6 sm:p-8 mb-6">
          <h2 className="text-xs font-[family-name:var(--font-montserrat)] font-bold text-[#F5C242] tracking-[0.2em] uppercase mb-6">
            Resultado
          </h2>

          <div className="space-y-3">
            {results.map((r, i) => (
              <div
                key={i}
                className={`flex items-center justify-between gap-4 py-3 px-4 ${
                  r.highlight
                    ? "bg-[#F5C242]/5 border border-[#F5C242]/20"
                    : "border-b border-[#2A2A2A]/50"
                }`}
              >
                <span className={`text-[12px] font-[family-name:var(--font-montserrat)] font-semibold tracking-wide ${
                  r.highlight ? "text-[#F3F3F3]/60" : "text-[#F3F3F3]/40"
                } uppercase`}>
                  {r.label}
                </span>
                <span className={`text-[18px] font-bold font-[family-name:var(--font-montserrat)] tabular-nums ${
                  r.highlight
                    ? "text-[#F5C242]"
                    : r.positive
                    ? "text-emerald-400"
                    : r.negative
                    ? "text-red-400"
                    : "text-white"
                }`}>
                  {r.value}
                </span>
              </div>
            ))}
          </div>

          {interpretation && (
            <div className="mt-5 pt-5 border-t border-[#F5C242]/10">
              <p className="text-[13px] text-[#F3F3F3]/60 leading-relaxed">
                <span className="text-[#F5C242] font-semibold">Análise: </span>
                {interpretation}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="border border-[#2A2A2A] bg-[#111111] p-8 mb-6 text-center">
          <p className="text-[13px] text-[#F3F3F3]/30 font-[family-name:var(--font-montserrat)]">
            Preencha os campos acima para ver o resultado
          </p>
        </div>
      )}

      {/* Related blog */}
      <div className="border border-[#2A2A2A] bg-[#111111] p-5 mb-6">
        <p className="text-[10px] font-[family-name:var(--font-montserrat)] font-bold text-[#F3F3F3]/30 tracking-[0.2em] uppercase mb-2">
          Leitura Recomendada
        </p>
        <Link
          href={`/blog/${relatedBlogSlug}`}
          className="group flex items-center justify-between gap-3 text-[13px] font-semibold text-[#F3F3F3]/70 hover:text-white transition-colors"
        >
          <span>{relatedBlogTitle}</span>
          <ChevronRight size={14} className="text-[#F5C242] flex-shrink-0 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* CTA */}
      <div className="border border-[#F5C242]/15 bg-gradient-to-b from-[#0F0E09] to-[#0B0B0B] p-8 text-center">
        <p className="text-[10px] font-[family-name:var(--font-montserrat)] font-bold text-[#F5C242] tracking-[0.25em] uppercase mb-3">
          Diagnóstico Gratuito
        </p>
        <h3 className="text-[22px] sm:text-[26px] font-[family-name:var(--font-anton)] text-white leading-tight mb-3">
          DESCUBRA OS GARGALOS INVISÍVEIS<br className="hidden sm:block" /> DA SUA EMPRESA
        </h3>
        <p className="text-[13px] text-[#F3F3F3]/50 max-w-md mx-auto mb-6 leading-relaxed">
          As calculadoras mostram os números. O V3X Diagnóstico mostra o que está por trás deles — com benchmarking do seu segmento.
        </p>
        <Link
          href="https://app.grupov3x.com.br"
          target="_blank"
          className="inline-flex items-center gap-2 btn-glow-gold text-[13px] font-[family-name:var(--font-montserrat)] font-semibold bg-[#F5C242] text-[#0B0B0B] px-8 py-3 hover:bg-white transition-all duration-200 tracking-wide"
        >
          Fazer Diagnóstico Gratuito
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
