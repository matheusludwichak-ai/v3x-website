import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Web design, motion design, software e produtos digitais — conteúdo da V3X.",
  alternates: { canonical: "https://grupov3x.com.br/blog" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Blog V3X",
  url: "https://grupov3x.com.br/blog",
  description: "Conteúdo sobre web design, motion design, software e produtos digitais.",
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        eyebrow="Blog V3X"
        crumb="Blog"
        title="Conteúdo que gera resultado."
        lead="Sobre web design, motion design, sistemas e produtos digitais — o que realmente usamos para construir."
      />

      <section className="bg-paper py-20 md:py-28">
        <div className="mx-auto max-w-[1280px] px-6">
          {posts.length === 0 ? (
            <p className="text-neutral-600">Nenhum artigo publicado ainda.</p>
          ) : (
            <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-3">
              {posts.map((post, i) => (
                <Reveal key={post.slug} delay={i * 60}>
                  <Link href={`/blog/${post.slug}`} className="group block border-t border-neutral-200 pt-6">
                    <p className="eyebrow text-neutral-600">{post.category}</p>
                    <h2 className="mt-4 text-xl font-semibold leading-snug text-ink group-hover:text-accent">
                      {post.title}
                    </h2>
                    <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">{post.excerpt}</p>
                    <p className="numbering mt-5 text-neutral-400">{post.readingTime}</p>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
