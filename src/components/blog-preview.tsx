import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllPosts } from "@/lib/posts";
import { ScrollReveal } from "./scroll-reveal";

export async function BlogPreview() {
  const posts = await getAllPosts();
  const recent = posts.slice(0, 3);

  if (recent.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-[#111111] border-y border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <ScrollReveal className="flex items-end justify-between mb-10 md:mb-12">
          <div>
            <p className="text-xs font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.2em] uppercase text-[#F5C242] mb-3">
              Blog V3X
            </p>
            <h2 className="font-[family-name:var(--font-anton)] text-3xl sm:text-4xl text-white tracking-wide">
              CONTEÚDO QUE GERA RESULTADO
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden md:flex items-center gap-2 text-sm font-[family-name:var(--font-montserrat)] font-semibold text-[#F5C242] hover:text-white transition-colors group"
          >
            Ver todos
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </ScrollReveal>

        {/* Posts grid */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {recent.map((post, i) => (
            <ScrollReveal key={post.slug} delay={i * 100}>
              <Link
                href={`/blog/${post.slug}`}
                className="group border border-[#2A2A2A] bg-[#1A1A1A] hover:border-[#F5C242]/40 transition-all duration-200 flex flex-col hover:translate-y-[-4px]"
              >
                <div className="p-5 md:p-6 flex flex-col gap-3 flex-1">
                  {post.category && (
                    <span className="text-xs font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.15em] uppercase text-[#F5C242]">
                      {post.category}
                    </span>
                  )}
                  <h3 className="font-[family-name:var(--font-anton)] text-lg text-white tracking-wide leading-snug group-hover:text-[#F5C242] transition-colors duration-200">
                    {post.title}
                  </h3>
                  <p className="text-sm text-[#F3F3F3]/50 font-[family-name:var(--font-inter)] leading-relaxed flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-[#2A2A2A]">
                    <span className="text-xs text-[#F3F3F3]/30 font-[family-name:var(--font-inter)]">
                      {post.readingTime}
                    </span>
                    <span className="text-xs text-[#F5C242] font-[family-name:var(--font-montserrat)] font-semibold flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                      Ler <ArrowRight size={11} />
                    </span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="mt-6 md:hidden">
          <Link
            href="/blog"
            className="flex items-center justify-center gap-2 border border-[#2A2A2A] py-3 text-sm font-[family-name:var(--font-montserrat)] font-semibold text-[#F3F3F3] hover:border-[#F5C242] hover:text-[#F5C242] transition-colors"
          >
            Ver todos os artigos <ArrowRight size={14} />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
