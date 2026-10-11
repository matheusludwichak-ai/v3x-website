import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArrowLeft } from "lucide-react";
import { CtaBand } from "@/components/site/cta-band";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { safeJson } from "@/lib/json-ld";
import { renderMarkdown } from "@/lib/markdown";

/** JSON for <script> tags with "<" escaped, so content can never close the tag. */

/* Articles published from the V3X Control appear without a new deploy. */
export const dynamicParams = true;
export const revalidate = 300;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const description = post.metaDescription || post.excerpt;
  return {
    title: post.seoTitle ? { absolute: post.seoTitle } : post.title,
    description,
    alternates: { canonical: `https://grupov3x.com.br/blog/${slug}` },
    openGraph: {
      title: post.seoTitle || post.title,
      description,
      url: `https://grupov3x.com.br/blog/${slug}`,
      type: "article",
      publishedTime: post.date || undefined,
      modifiedTime: post.updated || undefined,
      ...(post.coverUrl ? { images: [{ url: post.coverUrl, alt: post.coverAlt ?? post.title }] } : {}),
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    mainEntityOfPage: `https://grupov3x.com.br/blog/${slug}`,
    ...(post.coverUrl ? { image: post.coverUrl } : {}),
    author: { "@type": "Person", name: "Matheus Ludwichak" },
    publisher: { "@type": "Organization", name: "V3X" },
    url: `https://grupov3x.com.br/blog/${slug}`,
    keywords: [post.primaryKeyword, ...post.tags].filter(Boolean).join(", "),
  };

  const faqLd = post.faq?.length
    ? { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: post.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }
    : null;

  const date = post.date ? new Date(post.date).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }) : "";

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(jsonLd) }} />
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(faqLd) }} />}

      <article>
        <header className="hero-glow relative overflow-hidden border-b border-border pb-14 pt-36 md:pt-44">
          <div className="relative mx-auto max-w-[820px] px-6">
            <nav aria-label="Trilha de navegação" className="flex items-center gap-2 text-xs text-muted-foreground">
              <Link href="/" className="transition-colors hover:text-foreground">Início</Link>
              <span aria-hidden>/</span>
              <Link href="/blog" className="transition-colors hover:text-foreground">Blog</Link>
            </nav>
            <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
              <span className="font-semibold uppercase tracking-[0.16em] text-[#7fb2ff]">{post.category}</span>
              <span className="text-muted-foreground">{post.readingTime}</span>
              {date && <time dateTime={post.date} className="text-muted-foreground">{date}</time>}
            </div>
            <h1 className="hero-in t-display mt-5 text-balance font-semibold">{post.title}</h1>
            <p className="hero-in hero-in-2 mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl">{post.excerpt}</p>
          </div>
        </header>

        <div className="mx-auto max-w-[820px] px-6 py-16 md:py-20">
          {post.source === "mdx" ? (
            <div className="prose-v3x">
              <MDXRemote source={post.content} />
            </div>
          ) : (
            <div className="prose-v3x" dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }} />
          )}

          {post.faq && post.faq.length > 0 && (
            <section aria-labelledby="faq-title" className="mt-14 border-t border-border pt-10">
              <h2 id="faq-title" className="text-2xl font-semibold tracking-tight">Perguntas frequentes</h2>
              <div className="mt-6 divide-y divide-border">
                {post.faq.map((f) => (
                  <details key={f.q} className="group py-4">
                    <summary className="cursor-pointer list-none font-medium">{f.q}</summary>
                    <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {post.tags.length > 0 && (
            <div className="mt-14 flex flex-wrap gap-2 border-t border-border pt-8">
              {post.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/12 px-3 py-1 text-xs text-muted-foreground">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <Link href="/blog" className="link-underline mt-10 inline-flex items-center gap-2 text-sm font-medium">
            <ArrowLeft className="size-4" /> Voltar para o blog
          </Link>
        </div>
      </article>

      <CtaBand title="Quer colocar isso em prática" highlight="no seu projeto?" />
    </>
  );
}
