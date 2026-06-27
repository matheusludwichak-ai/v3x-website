import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Blog — Gestão, Estratégia e Crescimento Empresarial",
  description:
    "Artigos sobre diagnóstico empresarial, pipeline de vendas, escalabilidade, gestão financeira e muito mais. Conteúdo para empresários que querem crescer.",
  alternates: { canonical: "https://grupov3x.com.br/blog" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Blog V3X",
  url: "https://grupov3x.com.br/blog",
  description: "Conteúdo sobre gestão empresarial, escalabilidade e estratégia para empresários.",
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="min-h-screen bg-[#0B0B0B] pt-24">
        {/* Header */}
        <div className="border-b border-[#2A2A2A] pb-12 pt-8">
          <div className="max-w-7xl mx-auto px-6">
            <nav className="flex items-center gap-2 text-xs text-[#F3F3F3]/40 font-[family-name:var(--font-inter)] mb-6">
              <Link href="/" className="hover:text-[#F5C242] transition-colors">V3X</Link>
              <span>/</span>
              <span className="text-[#F3F3F3]/70">Blog</span>
            </nav>
            <p className="text-xs font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.2em] uppercase text-[#F5C242] mb-3">
              Blog V3X
            </p>
            <h1 className="font-[family-name:var(--font-anton)] text-5xl text-white tracking-wide">
              CONTEÚDO QUE GERA RESULTADO
            </h1>
            <p className="text-[#F3F3F3]/60 font-[family-name:var(--font-inter)] mt-3 max-w-xl">
              Artigos sobre gestão empresarial, escalabilidade, comercial e estratégia. Sem teoria — só o que funciona na prática.
            </p>
          </div>
        </div>

        {/* Posts */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          {posts.length === 0 ? (
            <p className="text-[#F3F3F3]/40 font-[family-name:var(--font-inter)]">Nenhum artigo publicado ainda.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group border border-[#2A2A2A] bg-[#1A1A1A] hover:border-[#F5C242]/40 transition-colors flex flex-col"
                >
                  <div className="p-6 flex flex-col gap-3 flex-1">
                    {post.category && (
                      <span className="text-xs font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.15em] uppercase text-[#F5C242]">
                        {post.category}
                      </span>
                    )}
                    <h2 className="font-[family-name:var(--font-anton)] text-xl text-white tracking-wide leading-snug group-hover:text-[#F5C242] transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-sm text-[#F3F3F3]/50 font-[family-name:var(--font-inter)] leading-relaxed flex-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-[#2A2A2A]">
                      <span className="text-xs text-[#F3F3F3]/30 font-[family-name:var(--font-inter)]">
                        {post.readingTime}
                      </span>
                      <span className="text-xs text-[#F5C242] font-[family-name:var(--font-montserrat)] font-semibold">
                        Ler →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
