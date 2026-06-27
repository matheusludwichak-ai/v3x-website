import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllPosts } from "@/lib/posts";

export async function BlogPreview() {
  const posts = await getAllPosts();
  const recent = posts.slice(0, 3);

  if (recent.length === 0) return null;

  return (
    <section className="py-24 bg-[#111111] border-y border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.2em] uppercase text-[#F5C242] mb-3">
              Blog V3X
            </p>
            <h2 className="font-[family-name:var(--font-anton)] text-4xl text-white tracking-wide">
              CONTEÚDO QUE GERA RESULTADO
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden md:flex items-center gap-2 text-sm font-[family-name:var(--font-montserrat)] font-semibold text-[#F5C242] hover:text-white transition-colors"
          >
            Ver todos <ArrowRight size={14} />
          </Link>
        </div>

        {/* Posts grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {recent.map((post) => (
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
                <h3 className="font-[family-name:var(--font-anton)] text-lg text-white tracking-wide leading-snug group-hover:text-[#F5C242] transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-[#F3F3F3]/50 font-[family-name:var(--font-inter)] leading-relaxed flex-1">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-[#2A2A2A]">
                  <span className="text-xs text-[#F3F3F3]/30 font-[family-name:var(--font-inter)]">
                    {post.readingTime}
                  </span>
                  <span className="text-xs text-[#F5C242] font-[family-name:var(--font-montserrat)] font-semibold group-hover:gap-2 transition-all">
                    Ler →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 md:hidden">
          <Link
            href="/blog"
            className="flex items-center justify-center gap-2 border border-[#2A2A2A] py-3 text-sm font-[family-name:var(--font-montserrat)] font-semibold text-[#F3F3F3] hover:border-[#F5C242] hover:text-[#F5C242] transition-colors"
          >
            Ver todos os artigos <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
