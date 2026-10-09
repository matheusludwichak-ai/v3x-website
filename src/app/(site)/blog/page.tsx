import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { BlogTabs } from "@/components/blog-tabs";
import { XMark } from "@/components/brand/XMark";
import { CtaBand } from "@/components/site/cta-band";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Web design, motion design, software e produtos digitais: conteúdo da V3X.",
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
        title={<>O que usamos <span className="text-gradient-x">para construir.</span></>}
        lead="Web design, motion design, sistemas e produtos digitais, escrito por quem executa."
      />

      {featured && (
        <section className="mx-auto max-w-[1280px] px-6 pt-20 md:px-12 md:pt-28">
          <Reveal>
            <Link href={`/blog/${featured.slug}`} className="group grid items-stretch gap-8 lg:grid-cols-12">
              <div className="flex flex-col justify-center lg:col-span-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7fb2ff]">{featured.category}</p>
                <h2 className="mt-5 text-balance text-3xl font-semibold leading-[1.1] tracking-[-0.03em] transition-colors md:text-5xl">
                  {featured.title}
                </h2>
                <p className="mt-5 max-w-[54ch] text-lg leading-relaxed text-muted-foreground">{featured.excerpt}</p>
                <span className="link-underline mt-8 inline-flex w-fit items-center gap-2 font-medium">
                  Ler artigo <ArrowUpRight className="size-4" />
                </span>
              </div>
              <div className="case-stage relative flex min-h-72 flex-col justify-between overflow-hidden p-8 lg:col-span-6">
                <XMark className="pointer-events-none absolute -right-10 -top-6 w-[360px] opacity-90 transition-transform duration-700 ease-out group-hover:-translate-x-2 group-hover:translate-y-1" />
                <span className="relative text-xs uppercase tracking-[0.2em] text-muted-foreground">Artigo em destaque</span>
                <span className="relative">
                  <span className="block text-2xl font-semibold">{featured.category}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">{featured.readingTime}</span>
                </span>
              </div>
            </Link>
          </Reveal>
        </section>
      )}

      <section className="mx-auto max-w-[1280px] px-6 py-20 md:px-12 md:py-28">
        <Reveal>
          <BlogTabs posts={rest.length > 0 ? rest : posts} />
        </Reveal>
      </section>

      <CtaBand title="Quer colocar isso em prática" highlight="no seu projeto?" />
    </>
  );
}
