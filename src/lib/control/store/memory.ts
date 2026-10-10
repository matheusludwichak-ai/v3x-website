import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { Entity, EntityKey } from "../schema";
import { StoreError, type ControlStore, type ListOptions } from "./types";
import { realSeed, demoSeed } from "./seed";

type Tables = Partial<Record<EntityKey, Record<string, unknown>[]>>;

function applyList<T extends Record<string, unknown>>(rows: T[], options: ListOptions = {}) {
  let out = rows;
  if (options.where) {
    const entries = Object.entries(options.where);
    out = out.filter((row) => entries.every(([k, v]) => (row[k] ?? null) === v));
  }
  const order = options.orderBy ?? { column: "updated_at", ascending: false };
  out = [...out].sort((a, b) => {
    const av = String(a[order.column] ?? "");
    const bv = String(b[order.column] ?? "");
    return order.ascending ? av.localeCompare(bv) : bv.localeCompare(av);
  });
  return options.limit ? out.slice(0, options.limit) : out;
}

/** Same unique constraints the database enforces. */
function checkUnique(tables: Tables, entity: EntityKey, row: Record<string, unknown>) {
  if (entity === "articles" && row.slug) {
    const clash = (tables.articles ?? []).find((a) => a.slug === row.slug && a.id !== row.id);
    if (clash) throw new StoreError("Já existe um artigo com este slug.", 409, "duplicate_slug");
  }
  if (entity === "messages" && row.external_id) {
    const clash = (tables.messages ?? []).find((m) => m.external_id === row.external_id && m.id !== row.id);
    if (clash) throw new StoreError("Mensagem já registrada.", 409, "duplicate_message");
  }
}

/**
 * Development store: one JSON file in .data/ (git-ignored). Lets every Control
 * flow be exercised locally before the Supabase project is connected.
 */
export class FileStore implements ControlStore {
  kind = "file" as const;
  readonly = false;
  private file: string;

  constructor(file = path.join(process.cwd(), ".data", "control.json")) {
    this.file = file;
  }

  private load(): Tables {
    if (!fs.existsSync(this.file)) {
      const now = new Date().toISOString();
      const seeded: Tables = realSeed(now) as Tables;
      fs.mkdirSync(path.dirname(this.file), { recursive: true });
      fs.writeFileSync(this.file, JSON.stringify(seeded, null, 2));
      return seeded;
    }
    return JSON.parse(fs.readFileSync(this.file, "utf8")) as Tables;
  }

  private save(tables: Tables) {
    const tmp = `${this.file}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(tables, null, 2));
    fs.renameSync(tmp, this.file);
  }

  async list<K extends EntityKey>(entity: K, options?: ListOptions) {
    return applyList(this.load()[entity] ?? [], options) as Entity<K>[];
  }

  async get<K extends EntityKey>(entity: K, id: string) {
    return ((this.load()[entity] ?? []).find((r) => r.id === id) as Entity<K> | undefined) ?? null;
  }

  async insert<K extends EntityKey>(entity: K, data: Record<string, unknown>) {
    const tables = this.load();
    const now = new Date().toISOString();
    const row = { ...data, id: randomUUID(), created_at: now, updated_at: now };
    checkUnique(tables, entity, row);
    tables[entity] = [...(tables[entity] ?? []), row];
    this.save(tables);
    return row as Entity<K>;
  }

  async update<K extends EntityKey>(entity: K, id: string, patch: Record<string, unknown>) {
    const tables = this.load();
    const rows = tables[entity] ?? [];
    const index = rows.findIndex((r) => r.id === id);
    if (index < 0) throw new StoreError("Registro não encontrado.", 404, "not_found");
    const row = { ...rows[index], ...patch, id, updated_at: new Date().toISOString() };
    checkUnique(tables, entity, row);
    rows[index] = row;
    tables[entity] = rows;
    this.save(tables);
    return row as Entity<K>;
  }

  async remove(entity: EntityKey, id: string) {
    const tables = this.load();
    tables[entity] = (tables[entity] ?? []).filter((r) => r.id !== id);
    this.save(tables);
  }
}

/** Production fallback while no database exists: read-only, labelled demo records. */
export class DemoStore implements ControlStore {
  kind = "demo" as const;
  readonly = true;
  private tables: Tables;

  constructor() {
    const now = new Date().toISOString();
    this.tables = { ...(realSeed(now) as Tables), ...(demoSeed(now) as Tables) };
  }

  async list<K extends EntityKey>(entity: K, options?: ListOptions) {
    return applyList(this.tables[entity] ?? [], options) as Entity<K>[];
  }
  async get<K extends EntityKey>(entity: K, id: string) {
    return ((this.tables[entity] ?? []).find((r) => r.id === id) as Entity<K> | undefined) ?? null;
  }
  private refuse(): never {
    throw new StoreError("Modo demonstração: o banco de dados ainda não foi configurado, então nada é salvo.", 503, "readonly_demo");
  }
  async insert<K extends EntityKey>(): Promise<Entity<K>> {
    this.refuse();
  }
  async update<K extends EntityKey>(): Promise<Entity<K>> {
    this.refuse();
  }
  async remove() {
    this.refuse();
  }
}
