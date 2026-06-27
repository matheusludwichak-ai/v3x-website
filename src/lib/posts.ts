import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

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
}

export async function getAllPosts(): Promise<Post[]> {
  if (!fs.existsSync(postsDir)) return [];

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((file) => {
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
    };
  });

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const filePath = path.join(postsDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const stats = readingTime(content);

  return {
    slug,
    title: data.title ?? "",
    excerpt: data.excerpt ?? "",
    date: data.date ?? "",
    category: data.category ?? "",
    readingTime: `${Math.ceil(stats.minutes)} min de leitura`,
    tags: data.tags ?? [],
    content,
  };
}
