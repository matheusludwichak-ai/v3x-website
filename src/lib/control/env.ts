import "server-only";

/**
 * Central place that reads the Control configuration from environment variables.
 * Values are never returned to the browser; only booleans and masked hints are.
 */

export type ControlMode = "supabase" | "local" | "demo";

const read = (name: string) => {
  const value = process.env[name];
  return value && value.trim() ? value.trim() : undefined;
};

export const isProduction = () => process.env.NODE_ENV === "production";

export function supabaseConfig() {
  const url = read("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = read("NEXT_PUBLIC_SUPABASE_ANON_KEY") ?? read("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  const serviceKey = read("SUPABASE_SERVICE_ROLE_KEY") ?? read("SUPABASE_SECRET_KEY");
  return { url, anonKey, serviceKey, configured: Boolean(url && anonKey) };
}

/**
 * supabase: real database + Supabase Auth (production-ready).
 * local:    development only, JSON file store in .data/, no auth, localhost only.
 * demo:     production without database: read-only, clearly labelled demo data,
 *           mutations and AI disabled so nobody can use them anonymously.
 */
export function controlMode(): ControlMode {
  if (supabaseConfig().configured) return "supabase";
  if (!isProduction()) return "local";
  return "demo";
}

export function geminiConfig() {
  const apiKey = read("GEMINI_API_KEY");
  return {
    apiKey,
    configured: Boolean(apiKey),
    /** Long-form generation (articles, reports). */
    model: read("GEMINI_MODEL") ?? "gemini-3.8-flash",
    /** Short actions (rewrite, summarize, suggestions). */
    fastModel: read("GEMINI_MODEL_FAST") ?? "gemini-3.5-flash-lite",
    timeoutMs: Number(read("GEMINI_TIMEOUT_MS") ?? 60000),
    dailyLimit: Number(read("CONTROL_AI_DAILY_LIMIT") ?? 200),
  };
}

export function evolutionConfig() {
  const baseUrl = read("EVOLUTION_API_URL")?.replace(/\/+$/, "");
  const apiKey = read("EVOLUTION_API_KEY");
  const instance = read("EVOLUTION_INSTANCE");
  const webhookSecret = read("EVOLUTION_WEBHOOK_SECRET");
  return { baseUrl, apiKey, instance, webhookSecret, configured: Boolean(baseUrl && apiKey && instance) };
}

export const SITE_URL = read("NEXT_PUBLIC_SITE_URL") ?? "https://grupov3x.com.br";

/** Shows only that a secret exists, never its value. */
export const maskPresence = (value: string | undefined) => (value ? "definida" : "ausente");
