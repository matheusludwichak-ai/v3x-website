import type { Entity, EntityKey } from "../schema";

export type ListOptions = {
  /** Equality filters, e.g. { status: "draft" }. */
  where?: Record<string, string | number | boolean | null>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
};

export type AnyEntity = Entity<EntityKey>;

export interface ControlStore {
  kind: "supabase" | "file" | "demo";
  /** True when writes are refused (production without database). */
  readonly: boolean;
  list<K extends EntityKey>(entity: K, options?: ListOptions): Promise<Entity<K>[]>;
  get<K extends EntityKey>(entity: K, id: string): Promise<Entity<K> | null>;
  insert<K extends EntityKey>(entity: K, data: Record<string, unknown>): Promise<Entity<K>>;
  update<K extends EntityKey>(entity: K, id: string, patch: Record<string, unknown>): Promise<Entity<K>>;
  remove(entity: EntityKey, id: string): Promise<void>;
}

export class StoreError extends Error {
  constructor(
    message: string,
    public status = 400,
    public code = "store_error",
  ) {
    super(message);
  }
}
