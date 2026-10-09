import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArrowLeft } from "lucide-react";
import { CtaBand } from "@/components/site/cta-band";
import { getAllPosts, getPostBySlug } from "@/lib/posts";

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

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `https://grupov3x.com.br/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://grupov3x.com.br/blog/${slug}`,
      type: "article",
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
    author: { "@type": "Person", name: "Matheus Ludwichak" },
    publisher: { "@type": "Organization", name: "V3X" },
    url: `https://grupov3x.com.br/blog/${slug}`,
    keywords: post.tags.join(", "),
  };

  const date = post.date ? new Date(post.date).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }) : "";

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

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
            <h1 className="hero-in mt-5 text-balance text-4xl font-semibold leading-[1.08] tracking-[-0.035em] md:text-6xl">{post.title}</h1>
            <p className="hero-in hero-in-2 mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl">{post.excerpt}</p>
          </div>
        </header>

        <div className="mx-auto max-w-[820px] px-6 py-16 md:py-20">
          <div className="prose-v3x">
            <MDXRemote source={post.content} />
          </div>

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
