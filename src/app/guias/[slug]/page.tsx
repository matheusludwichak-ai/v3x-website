import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllGuias, getGuiaBySlug } from "@/lib/guias";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Clock, ArrowLeft, ArrowRight, BookOpen } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const guias = await getAllGuias();
  return guias.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guia = await getGuiaBySlug(slug);
  if (!guia) return {};

  return {
    title: guia.title,
    description: guia.excerpt,
    alternates: { canonical: `https://grupov3x.com.br/guias/${slug}` },
    openGraph: {
      title: guia.title,
      description: guia.excerpt,
      url: `https://grupov3x.com.br/guias/${slug}`,
      type: "article",
    },
  };
}

export default async function GuiaPage({ params }: Props) {
  const { slug } = await params;
  const guia = await getGuiaBySlug(slug);
  if (!guia) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guia.title,
    description: guia.excerpt,
    datePublished: guia.date,
    author: { "@type": "Organization", name: "V3X" },
    publisher: { "@type": "Organization", name: "V3X" },
    url: `https://grupov3x.com.br/guias/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="min-h-screen bg-[#0B0B0B] pt-24">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-[#F3F3F3]/40 font-[family-name:var(--font-inter)] mb-8">
            <Link href="/" className="hover:text-[#F5C242] transition-colors">V3X</Link>
            <span>/</span>
            <Link href="/guias" className="hover:text-[#F5C242] transition-colors">Guias</Link>
            <span>/</span>
            <span className="text-[#F3F3F3]/70 truncate max-w-[200px]">{guia.title}</span>
          </nav>

          {/* Meta */}
          <div className="mb-4 flex items-center gap-4 flex-wrap">
            <span className="text-xs font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.15em] uppercase text-[#F5C242] border border-[#F5C242]/30 px-2 py-1">
              {guia.difficulty ?? "Guia Completo"}
            </span>
            <span className="flex items-center gap-1 text-xs text-[#F3F3F3]/40 font-[family-name:var(--font-inter)]">
              <Clock size={12} />
              {guia.readingTime}
            </span>
            {guia.wordCount && (
              <span className="flex items-center gap-1 text-xs text-[#F3F3F3]/40 font-[family-name:var(--font-inter)]">
                <BookOpen size={12} />
                ~{guia.wordCount.toLocaleString("pt-BR")} palavras
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="font-[family-name:var(--font-anton)] text-3xl sm:text-4xl md:text-5xl text-white tracking-wide leading-tight mb-6">
            {guia.title}
          </h1>

          <p className="text-base md:text-lg text-[#F3F3F3]/60 font-[family-name:var(--font-inter)] leading-relaxed mb-10 pb-10 border-b border-[#2A2A2A]">
            {guia.excerpt}
          </p>

          {/* Content */}
          <div className="prose-v3x">
            <MDXRemote
              source={guia.content}
              components={{
                h2: ({ children }) => {
                  const id = String(children)
                    .toLowerCase()
                    .normalize("NFD").replace(/[̀-ͯ]/g, "")
                    .replace(/[^a-z0-9\s-]/g, "")
                    .trim()
                    .replace(/\s+/g, "-");
                  return <h2 id={id}>{children}</h2>;
                },
                h3: ({ children }) => {
                  const id = String(children)
                    .toLowerCase()
                    .normalize("NFD").replace(/[̀-ͯ]/g, "")
                    .replace(/[^a-z0-9\s-]/g, "")
                    .trim()
                    .replace(/\s+/g, "-");
                  return <h3 id={id}>{children}</h3>;
                },
              }}
            />
          </div>

          {/* Tags */}
          {guia.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-[#2A2A2A] flex flex-wrap gap-2">
              {guia.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-[#2A2A2A] px-3 py-1 text-xs font-[family-name:var(--font-montserrat)] font-semibold tracking-wide text-[#F3F3F3]/40"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Back */}
          <div className="mt-8">
            <Link
              href="/guias"
              className="flex items-center gap-2 text-sm font-[family-name:var(--font-montserrat)] font-semibold text-[#F3F3F3]/40 hover:text-[#F5C242] transition-colors"
            >
              <ArrowLeft size={14} />
              Voltar para Guias
            </Link>
          </div>
        </article>

        {/* CTA strip */}
        <div className="border-t border-[#2A2A2A] bg-[#111111]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 text-center">
            <p className="text-xs font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.2em] uppercase text-[#F5C242] mb-3">
              V3X Diagnóstico
            </p>
            <h2 className="font-[family-name:var(--font-anton)] text-2xl sm:text-3xl text-white tracking-wide mb-3">
              COLOQUE EM PRÁTICA O QUE VOCÊ APRENDEU
            </h2>
            <p className="text-sm text-[#F3F3F3]/50 font-[family-name:var(--font-inter)] mb-6">
              Diagnóstico em 5 dimensões estratégicas. 15 minutos. 7 dias grátis.
            </p>
            <Link
              href="https://app.grupov3x.com.br"
              target="_blank"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F5C242] text-[#0B0B0B] font-[family-name:var(--font-montserrat)] font-semibold text-sm px-8 py-4 hover:bg-white transition-all duration-200 hover:scale-[1.02]"
            >
              Começar Diagnóstico Grátis
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
