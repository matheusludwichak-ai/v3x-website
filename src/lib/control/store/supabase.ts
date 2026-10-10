import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Entity, EntityKey } from "../schema";
import { StoreError, type ControlStore, type ListOptions } from "./types";

/**
 * Supabase-backed store. It receives a client created with the signed-in
 * user's session, so every query runs under Row Level Security.
 */
export class SupabaseStore implements ControlStore {
  kind = "supabase" as const;
  readonly = false;

  constructor(private db: SupabaseClient) {}

  private fail(error: { message: string; code?: string } | null, fallback = "Falha ao acessar o banco de dados."): never {
    if (error?.code === "23505") throw new StoreError("Já existe um registro com este valor único (por exemplo, o slug).", 409, "duplicate");
    if (error?.code === "42501") throw new StoreError("Sem permissão para esta operação.", 403, "forbidden");
    // The database message can contain internal details; keep it out of the response.
    console.error("[control] supabase error", error?.code ?? "unknown");
    throw new StoreError(fallback, 500, "db_error");
  }

  async list<K extends EntityKey>(entity: K, options: ListOptions = {}) {
    let query = this.db.from(entity).select("*");
    for (const [key, value] of Object.entries(options.where ?? {})) query = value === null ? query.is(key, null) : query.eq(key, value);
    const order = options.orderBy ?? { column: "updated_at", ascending: false };
    query = query.order(order.column, { ascending: order.ascending ?? false });
    if (options.limit) query = query.limit(options.limit);
    const { data, error } = await query;
    if (error) this.fail(error);
    return (data ?? []) as Entity<K>[];
  }

  async get<K extends EntityKey>(entity: K, id: string) {
    const { data, error } = await this.db.from(entity).select("*").eq("id", id).maybeSingle();
    if (error) this.fail(error);
    return (data as Entity<K> | null) ?? null;
  }

  async insert<K extends EntityKey>(entity: K, row: Record<string, unknown>) {
    const { data, error } = await this.db.from(entity).insert(row).select("*").single();
    if (error) this.fail(error);
    return data as Entity<K>;
  }

  async update<K extends EntityKey>(entity: K, id: string, patch: Record<string, unknown>) {
    const { data, error } = await this.db.from(entity).update(patch).eq("id", id).select("*").maybeSingle();
    if (error) this.fail(error);
    if (!data) throw new StoreError("Registro não encontrado ou sem permissão.", 404, "not_found");
    return data as Entity<K>;
  }

  async remove(entity: EntityKey, id: string) {
    const { error } = await this.db.from(entity).delete().eq("id", id);
    if (error) this.fail(error);
  }
}
