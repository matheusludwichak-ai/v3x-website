import "server-only";
import { controlMode } from "../env";
import { supabaseAdmin, supabaseForRequest } from "../supabase";
import { DemoStore, FileStore } from "./memory";
import { SupabaseStore } from "./supabase";
import type { ControlStore } from "./types";

let fileStore: FileStore | null = null;
let demoStore: DemoStore | null = null;

/** Picks the data store for the current request according to the Control mode. */
export async function getStore(): Promise<ControlStore> {
  const mode = controlMode();
  if (mode === "supabase") {
    const db = await supabaseForRequest();
    if (db) return new SupabaseStore(db);
  }
  if (mode === "local") return (fileStore ??= new FileStore());
  return (demoStore ??= new DemoStore());
}

/**
 * Store for server flows that run without a user session (WhatsApp webhooks).
 * Uses the service-role key on the server only; returns null when unavailable.
 */
export function getSystemStore(): ControlStore | null {
  const mode = controlMode();
  if (mode === "supabase") {
    const admin = supabaseAdmin();
    return admin ? new SupabaseStore(admin) : null;
  }
  if (mode === "local") return (fileStore ??= new FileStore());
  return null;
}

export { StoreError } from "./types";
export type { ControlStore, ListOptions } from "./types";
