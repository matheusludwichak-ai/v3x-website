import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="bg-paper pb-20 pt-36 md:pt-44">
        <div className="mx-auto max-w-[760px] px-6">
          <nav aria-label="Breadcrumb" className="numbering flex items-center gap-2 text-neutral-400">
            <Link href="/" className="hover:text-ink">
              V3X
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-ink">
              Blog
            </Link>
          </nav>

          <div className="mt-8 flex items-center gap-4">
            <span className="eyebrow text-accent">{post.category}</span>
            <span className="numbering text-neutral-400">{post.readingTime}</span>
          </div>

          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-ink md:text-5xl">
            {post.title}
          </h1>

          <p className="mt-6 border-b border-neutral-200 pb-10 text-lg leading-relaxed text-neutral-600">
            {post.excerpt}
          </p>

          <div className="prose-v3x pt-10">
            <MDXRemote source={post.content} />
          </div>

          {post.tags.length > 0 && (
            <div className="mt-12 flex flex-wrap gap-2 border-t border-neutral-200 pt-8">
              {post.tags.map((tag) => (
                <span key={tag} className="eyebrow border border-neutral-200 px-3 py-1 text-neutral-600">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <Link href="/blog" className="eyebrow mt-10 inline-flex items-center gap-2 text-ink">
            ← Voltar para o blog
          </Link>
        </div>
      </article>

      <section className="bg-ink py-20 text-on-ink md:py-28">
        <div className="mx-auto max-w-[1280px] px-6 text-center">
          <h2 className="mx-auto max-w-[24ch] text-3xl font-semibold tracking-tight md:text-5xl">
            Quer colocar isso em prática no seu projeto?
          </h2>
          <Link
            href="/contato"
            className="mt-8 inline-flex h-12 items-center rounded-[4px] border border-[#F3F2EE] bg-[#F3F2EE] px-8 text-[16px] font-semibold text-ink transition-all hover:-translate-y-px hover:bg-neutral-200"
          >
            Start a project
          </Link>
        </div>
      </section>
    </>
  );
}
