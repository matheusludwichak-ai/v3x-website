import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const guiasDir = path.join(process.cwd(), "content", "guias");

export interface Guia {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readingTime: string;
  tags: string[];
  content: string;
  difficulty?: string;
  wordCount?: number;
}

export async function getAllGuias(): Promise<Guia[]> {
  if (!fs.existsSync(guiasDir)) return [];

  const files = fs.readdirSync(guiasDir).filter((f) => f.endsWith(".mdx"));

  const guias = files.map((file) => {
    const raw = fs.readFileSync(path.join(guiasDir, file), "utf-8");
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
      difficulty: data.difficulty ?? "Guia Completo",
      wordCount: data.wordCount,
    };
  });

  return guias.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getGuiaBySlug(slug: string): Promise<Guia | null> {
  const filePath = path.join(guiasDir, `${slug}.mdx`);
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
    difficulty: data.difficulty ?? "Guia Completo",
    wordCount: data.wordCount,
  };
}
