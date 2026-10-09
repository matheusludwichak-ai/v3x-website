import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { BlogTabs } from "@/components/blog-tabs";
import { getAllPosts } from "@/lib/posts";
import { services } from "@/data/services";

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
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        eyebrow="Blog V3X"
        crumb="Blog"
        title="Conteúdo que gera resultado."
        lead="Sobre web design, motion design, sistemas e produtos digitais — o que realmente usamos para construir."
      >
        <div className="mt-8 flex flex-wrap gap-2">
          {services.map((s) => (
            <span
              key={s.slug}
              className="eyebrow rounded-full border border-dark-border px-4 py-2 text-dark-600"
            >
              {s.name}
            </span>
          ))}
        </div>
      </PageHero>

      {featured && (
        <section className="bg-paper pt-20 md:pt-28">
          <div className="mx-auto max-w-[1280px] px-6">
            <Reveal>
              <Link
                href={`/blog/${featured.slug}`}
                className="group grid grid-cols-1 items-center gap-10 border-b border-neutral-200 pb-16 lg:grid-cols-[1fr_1.1fr]"
              >
                <div>
                  <p className="eyebrow text-accent">Em destaque</p>
                  <h2 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-ink transition-colors group-hover:text-accent md:text-5xl">
                    {featured.title}
                  </h2>
                  <p className="mt-5 max-w-[56ch] text-lg leading-relaxed text-neutral-600">
                    {featured.excerpt}
                  </p>
                  <p className="eyebrow mt-6 inline-flex items-center gap-2 text-ink">
                    Ler artigo
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </p>
                </div>
                <div className="relative overflow-hidden rounded-[8px] border border-neutral-200 bg-ink p-10">
                  <p className="eyebrow text-dark-600">{featured.category}</p>
                  <p className="mt-6 text-2xl font-semibold leading-snug text-on-ink">
                    {featured.title}
                  </p>
                  <p className="numbering mt-8 text-dark-400">{featured.readingTime}</p>
                  <div
                    className="absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-20 blur-2xl"
                    style={{ background: "var(--gradient-signature)" }}
                  />
                </div>
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      <section className="bg-paper py-20 md:py-28">
        <div className="mx-auto max-w-[1280px] px-6">
          <Reveal>
            <BlogTabs posts={rest.length > 0 ? rest : posts} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
