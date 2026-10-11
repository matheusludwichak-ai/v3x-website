import "server-only";
import { ENTITIES, type EntityKey } from "./schema";
import { supabaseAdmin } from "./supabase";
import type { ControlStore } from "./store/types";

/**
 * Logical backup of the Control data (JSON). The Supabase Free plan has no backups, so the
 * daily routine keeps 14 days of snapshots in the private "control-backups" bucket and admins
 * can download a fresh copy to keep outside Supabase. Contains personal data (leads,
 * conversations): never public, only the server and admins can get it.
 */
export const BACKUP_BUCKET = "control-backups";
const KEEP_DAYS = 14;

export async function exportControlData(store: ControlStore) {
  const tables: Record<string, unknown[]> = {};
  const counts: Record<string, number> = {};
  for (const entity of Object.keys(ENTITIES) as EntityKey[]) {
    const rows = await store.list(entity, { limit: 10000 });
    tables[entity] = rows;
    counts[entity] = rows.length;
  }
  return { format: "v3x-control-backup", version: 1, generated_at: new Date().toISOString(), counts, tables };
}

/** Saves today's snapshot and removes snapshots older than 14 days. Returns what happened. */
export async function saveDailyBackup(store: ControlStore): Promise<{ ok: boolean; file?: string; bytes?: number; removed?: number; error?: string }> {
  const db = supabaseAdmin();
  if (!db) return { ok: false, error: "Supabase não configurado" };
  try {
    const data = await exportControlData(store);
    const body = JSON.stringify(data);
    const day = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(new Date());
    const file = `daily/${day}.json`;
    const { error } = await db.storage.from(BACKUP_BUCKET).upload(file, new Blob([body], { type: "application/json" }), { upsert: true, contentType: "application/json" });
    if (error) return { ok: false, error: error.message.slice(0, 120) };
    const { data: list } = await db.storage.from(BACKUP_BUCKET).list("daily", { limit: 100 });
    const cutoff = Date.now() - KEEP_DAYS * 86_400_000;
    const old = (list ?? []).filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f.name) && Date.parse(`${f.name.slice(0, 10)}T12:00:00Z`) < cutoff).map((f) => `daily/${f.name}`);
    if (old.length) await db.storage.from(BACKUP_BUCKET).remove(old);
    return { ok: true, file, bytes: body.length, removed: old.length };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message.slice(0, 120) : "falha no backup" };
  }
}
