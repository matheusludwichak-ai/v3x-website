import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { getAllGuias } from "@/lib/guias";
import { ferramentas } from "@/lib/ferramentas";

const BASE = "https://grupov3x.com.br";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  const guias = await getAllGuias();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/guias`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/ferramentas`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/estudos-de-caso`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/sobre`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/contato`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const guiaRoutes: MetadataRoute.Sitemap = guias.map((guia) => ({
    url: `${BASE}/guias/${guia.slug}`,
    lastModified: new Date(guia.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const ferramentaRoutes: MetadataRoute.Sitemap = ferramentas.map((f) => ({
    url: `${BASE}/ferramentas/${f.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...postRoutes, ...guiaRoutes, ...ferramentaRoutes];
}
