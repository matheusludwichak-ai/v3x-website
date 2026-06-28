import type { Metadata } from "next";
import Link from "next/link";
import {
  TrendingUp, Users, Receipt, Percent, DollarSign, Target,
  Filter, GitBranch, Scale, PiggyBank, Tag, Repeat, UserMinus,
  BarChart3, ArrowUpRight, Zap, Activity, Clock, BarChart2, Rocket,
} from "lucide-react";
import { ferramentas } from "@/lib/ferramentas";

export const metadata: Metadata = {
  title: "Ferramentas Gratuitas | Calculadoras Empresariais — V3X",
  description:
    "20 calculadoras gratuitas para gestão, vendas e finanças. ROI, CAC, LTV, Churn, Margem, Break-even e muito mais. Ferramentas práticas para donos de PME.",
  openGraph: {
    title: "Ferramentas Gratuitas | V3X",
    description: "20 calculadoras gratuitas para PMEs: ROI, CAC, LTV, Churn, Margem, Break-even e mais.",
    url: "https://grupov3x.com.br/ferramentas",
  },
};

const iconMap: Record<string, React.ElementType> = {
  "calculadora-roi":                TrendingUp,
  "calculadora-cac":                Users,
  "calculadora-ticket-medio":       Receipt,
  "calculadora-conversao":          Percent,
  "calculadora-comissao":           DollarSign,
  "calculadora-meta-comercial":     Target,
  "calculadora-leads-necessarios":  Filter,
  "calculadora-pipeline-comercial": GitBranch,
  "calculadora-break-even":         Scale,
  "calculadora-margem-lucro":       PiggyBank,
  "calculadora-markup":             Tag,
  "calculadora-ltv":                Repeat,
  "calculadora-churn":              UserMinus,
  "calculadora-mrr":                BarChart3,
  "calculadora-crescimento-mensal": ArrowUpRight,
  "calculadora-capacidade-comercial": Zap,
  "calculadora-produtividade-equipe": Activity,
  "calculadora-tempo-fechamento":   Clock,
  "calculadora-forecast-comercial": BarChart2,
  "calculadora-potencial-faturamento": Rocket,
};

const categoryColor: Record<string, string> = {
  Financeiro:   "text-emerald-400",
  Comercial:    "text-[#F5C242]",
  Marketing:    "text-blue-400",
  Planejamento: "text-purple-400",
  Recorrência:  "text-orange-400",
  Gestão:       "text-rose-400",
};

export default function FerramentasPage() {
  return (
    <main className="min-h-screen bg-[#0B0B0B] pt-[76px]">

      {/* Hero */}
      <section className="border-b border-[#1A1A1A] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-[10px] font-[family-name:var(--font-montserrat)] font-bold text-[#F5C242] tracking-[0.3em] uppercase mb-4">
            Central de Ferramentas Gratuitas
          </p>
          <h1 className="text-[40px] sm:text-[56px] lg:text-[68px] font-[family-name:var(--font-anton)] text-white leading-none mb-5">
            CALCULADORAS<br className="sm:hidden" /> EMPRESARIAIS
          </h1>
          <p className="text-[15px] text-[#F3F3F3]/50 max-w-xl leading-relaxed">
            {ferramentas.length} ferramentas gratuitas para tomar decisões com dados.
            Financeiro, comercial, marketing e gestão — tudo em um lugar.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-[#1A1A1A]">
            {ferramentas.map((f) => {
              const Icon = iconMap[f.slug] || TrendingUp;
              const catColor = categoryColor[f.category] || "text-[#F5C242]";
              return (
                <Link
                  key={f.slug}
                  href={`/ferramentas/${f.slug}`}
                  className="group bg-[#0B0B0B] hover:bg-[#111111] transition-colors duration-200 p-6 flex flex-col gap-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 border border-[#2A2A2A] group-hover:border-[#F5C242]/30 flex items-center justify-center transition-colors">
                      <Icon size={18} className="text-[#F5C242]/60 group-hover:text-[#F5C242] transition-colors" />
                    </div>
                    <span className={`text-[10px] font-[family-name:var(--font-montserrat)] font-bold tracking-widest uppercase ${catColor} opacity-70`}>
                      {f.category}
                    </span>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-[15px] font-[family-name:var(--font-montserrat)] font-bold text-white mb-2 group-hover:text-[#F5C242] transition-colors leading-snug">
                      {f.name}
                    </h3>
                    <p className="text-[12px] text-[#F3F3F3]/40 leading-relaxed">
                      {f.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-[family-name:var(--font-montserrat)] font-bold text-[#F5C242]/50 group-hover:text-[#F5C242] transition-colors tracking-wider uppercase">
                    Abrir Ferramenta
                    <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#1A1A1A] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-[10px] font-[family-name:var(--font-montserrat)] font-bold text-[#F5C242] tracking-[0.3em] uppercase mb-4">
            Diagnóstico Empresarial
          </p>
          <h2 className="text-[32px] sm:text-[44px] font-[family-name:var(--font-anton)] text-white leading-tight mb-4">
            OS NÚMEROS ESTÃO.<br className="hidden sm:block" /> O DIAGNÓSTICO FALTA.
          </h2>
          <p className="text-[14px] text-[#F3F3F3]/50 max-w-lg mx-auto mb-8 leading-relaxed">
            As calculadoras mostram o que medir. O V3X Diagnóstico mostra o que está travando — com benchmarking do seu segmento e plano de ação.
          </p>
          <Link
            href="https://app.grupov3x.com.br"
            target="_blank"
            className="inline-flex items-center gap-2 btn-glow-gold text-[13px] font-[family-name:var(--font-montserrat)] font-semibold bg-[#F5C242] text-[#0B0B0B] px-8 py-3 hover:bg-white transition-all duration-200 tracking-wide"
          >
            Fazer Diagnóstico Gratuito →
          </Link>
        </div>
      </section>
    </main>
  );
}
