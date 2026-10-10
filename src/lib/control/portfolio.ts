import "server-only";
import { controlMode } from "./env";
import { supabasePublic } from "./supabase";
import { FileStore } from "./store/memory";

/** Only the fields that may appear on the public site (never client name or internal notes). */
export type PublicPortfolioItem = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  public_url: string | null;
  demo_url: string | null;
  cover_url: string | null;
  technologies: string[];
  services: string[];
  featured: boolean;
};

const pick = (r: Record<string, unknown>): PublicPortfolioItem => ({
  id: String(r.id),
  name: String(r.name),
  category: String(r.category ?? "other"),
  description: (r.description as string | null) ?? null,
  public_url: (r.public_url as string | null) ?? null,
  demo_url: (r.demo_url as string | null) ?? null,
  cover_url: (r.cover_url as string | null) ?? null,
  technologies: (r.technologies as string[] | null) ?? [],
  services: (r.services as string[] | null) ?? [],
  featured: Boolean(r.featured),
});

/**
 * Portfolio items approved in the Control for the public site.
 * Supabase: the public_portfolio view (approved + concluded, safe columns only).
 * Local: same filter on the development store. Demo: nothing.
 */
export async function getPublicPortfolio(): Promise<PublicPortfolioItem[]> {
  try {
    const mode = controlMode();
    if (mode === "supabase") {
      const { data, error } = (await supabasePublic()?.from("public_portfolio").select("*").order("featured", { ascending: false }).order("updated_at", { ascending: false })) ?? { data: null, error: null };
      if (error) {
        console.error("[portfolio] public query failed", error.code);
        return [];
      }
      return (data ?? []).map(pick);
    }
    if (mode === "local") {
      const rows = await new FileStore().list("portfolio_items");
      return rows.filter((r) => r.public_approved && r.status === "done").sort((a, b) => Number(b.featured) - Number(a.featured)).map((r) => pick(r as unknown as Record<string, unknown>));
    }
  } catch {
    return [];
  }
  return [];
}
