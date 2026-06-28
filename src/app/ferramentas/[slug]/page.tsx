import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { ferramentas, getFerramentaBySlug } from "@/lib/ferramentas";
import { CalculadoraEngine } from "@/components/calculadora-engine";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ferramentas.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const f = getFerramentaBySlug(slug);
  if (!f) return {};
  return {
    title: f.seoTitle,
    description: f.seoDescription,
    openGraph: {
      title: f.seoTitle,
      description: f.seoDescription,
      url: `https://grupov3x.com.br/ferramentas/${f.slug}`,
    },
    alternates: {
      canonical: `https://grupov3x.com.br/ferramentas/${f.slug}`,
    },
  };
}

export default async function FerramentaPage({ params }: Props) {
  const { slug } = await params;
  const f = getFerramentaBySlug(slug);
  if (!f) notFound();

  return (
    <main className="min-h-screen bg-[#0B0B0B] pt-[76px]">

      {/* Breadcrumb */}
      <div className="border-b border-[#1A1A1A] py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-1.5 text-[11px] font-[family-name:var(--font-montserrat)] font-semibold text-[#F3F3F3]/30 tracking-wide">
            <Link href="/" className="hover:text-[#F3F3F3]/60 transition-colors">Início</Link>
            <ChevronRight size={10} />
            <Link href="/ferramentas" className="hover:text-[#F3F3F3]/60 transition-colors">Ferramentas</Link>
            <ChevronRight size={10} />
            <span className="text-[#F5C242]/70">{f.shortName}</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <section className="border-b border-[#1A1A1A] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <p className="text-[10px] font-[family-name:var(--font-montserrat)] font-bold text-[#F5C242] tracking-[0.3em] uppercase mb-4">
              {f.category} · Ferramenta Gratuita
            </p>
            <h1 className="text-[36px] sm:text-[48px] lg:text-[56px] font-[family-name:var(--font-anton)] text-white leading-none mb-5">
              {f.name.toUpperCase()}
            </h1>
            <p className="text-[15px] text-[#F3F3F3]/50 leading-relaxed max-w-xl">
              {f.longDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <CalculadoraEngine
            slug={f.slug}
            name={f.name}
            relatedBlogSlug={f.relatedBlogSlug}
            relatedBlogTitle={f.relatedBlogTitle}
          />
        </div>
      </section>

      {/* More tools */}
      <section className="border-t border-[#1A1A1A] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <p className="text-[11px] font-[family-name:var(--font-montserrat)] font-bold text-[#F3F3F3]/30 tracking-[0.2em] uppercase">
              Mais Ferramentas
            </p>
            <Link
              href="/ferramentas"
              className="text-[11px] font-[family-name:var(--font-montserrat)] font-bold text-[#F5C242]/60 hover:text-[#F5C242] transition-colors tracking-wider uppercase"
            >
              Ver todas →
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {ferramentas
              .filter((other) => other.slug !== f.slug)
              .slice(0, 8)
              .map((other) => (
                <Link
                  key={other.slug}
                  href={`/ferramentas/${other.slug}`}
                  className="text-[11px] font-[family-name:var(--font-montserrat)] font-semibold text-[#F3F3F3]/40 hover:text-white border border-[#2A2A2A] hover:border-[#F5C242]/30 px-3 py-1.5 transition-all tracking-wide"
                >
                  {other.shortName}
                </Link>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}
