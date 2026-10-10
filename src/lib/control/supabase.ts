import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { supabaseConfig } from "./env";

/** Client bound to the visitor's session cookies: every query runs under RLS as that user. */
export async function supabaseForRequest(): Promise<SupabaseClient | null> {
  const { url, anonKey, configured } = supabaseConfig();
  if (!configured || !url || !anonKey) return null;
  const store = await cookies();
  return createServerClient(url, anonKey, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Called from a Server Component: the proxy refreshes cookies instead.
        }
      },
    },
  });
}

/** Anonymous client for public reads (published articles, approved portfolio) under RLS. */
export function supabasePublic(): SupabaseClient | null {
  const { url, anonKey, configured } = supabaseConfig();
  if (!configured || !url || !anonKey) return null;
  return createClient(url, anonKey, { auth: { persistSession: false } });
}

/**
 * Service-role client. Server-only and used exclusively by flows without a user
 * session (WhatsApp webhooks). Never imported by client components.
 */
export function supabaseAdmin(): SupabaseClient | null {
  const { url, serviceKey } = supabaseConfig();
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}
