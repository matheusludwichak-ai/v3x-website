import "server-only";
import { controlMode } from "./env";
import { supabasePublic } from "./supabase";
import { FileStore } from "./store/memory";
import type { Article } from "./schema";

/**
 * Read side used by the PUBLIC site: only articles with status "published".
 * - supabase: anonymous client, RLS only exposes published rows.
 * - local:    the development file store, so the full flow can be tested.
 * - demo:     nothing (no database yet); the site keeps its MDX posts.
 */
export async function getPublishedArticles(): Promise<Article[]> {
  const mode = controlMode();
  try {
    if (mode === "supabase") {
      const db = supabasePublic();
      if (!db) return [];
      const { data, error } = await db.from("articles").select("*").eq("status", "published").order("published_at", { ascending: false });
      if (error) {
        console.error("[blog] published articles query failed", error.code);
        return [];
      }
      return (data ?? []) as Article[];
    }
    if (mode === "local") {
      return (await new FileStore().list("articles", { where: { status: "published" }, orderBy: { column: "published_at", ascending: false } })) as Article[];
    }
  } catch {
    return [];
  }
  return [];
}

export async function getPublishedArticle(slug: string) {
  return (await getPublishedArticles()).find((a) => a.slug === slug) ?? null;
}
