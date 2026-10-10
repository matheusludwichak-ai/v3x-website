import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { getPublishedArticles } from "@/lib/control/articles";
import type { Article } from "@/lib/control/schema";

const postsDir = path.join(process.cwd(), "content", "blog");

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readingTime: string;
  tags: string[];
  content: string;
  /** "mdx": file in content/blog. "control": article published from the V3X Control (Markdown). */
  source: "mdx" | "control";
  seoTitle?: string;
  metaDescription?: string;
  updated?: string;
  coverUrl?: string | null;
  coverAlt?: string | null;
  faq?: { q: string; a: string }[];
  primaryKeyword?: string | null;
}

function readMdx(file: string): Post {
  const raw = fs.readFileSync(path.join(postsDir, file), "utf-8");
  const { data, content } = matter(raw);
  const stats = readingTime(content);
  return {
    slug: file.replace(/\.mdx$/, ""),
    title: data.title ?? "",
    excerpt: data.excerpt ?? "",
    date: data.date ?? "",
    category: data.category ?? "",
    readingTime: `${Math.ceil(stats.minutes)} min de leitura`,
    tags: data.tags ?? [],
    content,
    source: "mdx",
  };
}

function fromArticle(a: Article): Post {
  const stats = readingTime(a.content_md ?? "");
  return {
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt ?? a.meta_description ?? "",
    date: (a.published_at ?? a.updated_at ?? "").slice(0, 10),
    updated: a.updated_at,
    category: a.category ?? "Artigo",
    readingTime: `${Math.max(1, Math.ceil(stats.minutes))} min de leitura`,
    tags: a.tags ?? [],
    content: a.content_md ?? "",
    source: "control",
    seoTitle: a.seo_title ?? undefined,
    metaDescription: a.meta_description ?? undefined,
    coverUrl: a.cover_url,
    coverAlt: a.cover_alt,
    faq: a.faq ?? [],
    primaryKeyword: a.primary_keyword,
  };
}

function mdxPosts(): Post[] {
  if (!fs.existsSync(postsDir)) return [];
  return fs.readdirSync(postsDir).filter((f) => f.endsWith(".mdx")).map(readMdx);
}

/** MDX files plus articles published from the Control. An MDX file wins on a slug clash. */
export async function getAllPosts(): Promise<Post[]> {
  const files = mdxPosts();
  const taken = new Set(files.map((p) => p.slug));
  const published = (await getPublishedArticles()).filter((a) => !taken.has(a.slug)).map(fromArticle);
  return [...files, ...published].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const filePath = path.join(postsDir, `${slug}.mdx`);
  if (fs.existsSync(filePath)) return readMdx(`${slug}.mdx`);
  const article = (await getPublishedArticles()).find((a) => a.slug === slug);
  return article ? fromArticle(article) : null;
}

/** Slugs already used by MDX files (the Control must not publish over them). */
export function mdxSlugs() {
  return mdxPosts().map((p) => p.slug);
}
