import "server-only";
import { ENTITIES, type Entity, type EntityKey, fieldErrors } from "./schema";
import { getStore, StoreError } from "./store";
import type { ControlSession } from "./auth";

const LABEL: Partial<Record<EntityKey, string>> = {
  tasks: "Tarefa",
  projects: "Projeto",
  clients: "Cliente",
  leads: "Oportunidade",
  articles: "Artigo",
  portfolio_items: "Item do portfólio",
  motion_items: "Peça de motion",
  org_members: "Pessoa",
  reports: "Relatório",
  monitors: "Monitor",
};

const titleOf = (row: Record<string, unknown>) => String(row.title ?? row.name ?? row.company ?? row.id ?? "");

export class ValidationError extends StoreError {
  constructor(public fields: Record<string, string>) {
    super("Revise os campos destacados.", 422, "validation");
  }
}

/** Records who did what, for project history and the overview feed. Never stores secrets or message bodies. */
export async function logActivity(entity: EntityKey, entityId: string | null, action: string, summary: string, session?: ControlSession) {
  if (entity === "activity_log" || entity === "messages") return;
  try {
    const store = await getStore();
    if (store.readonly) return;
    await store.insert("activity_log", { entity, entity_id: entityId, action, summary: summary.slice(0, 500), actor: session?.user?.email ?? (session?.mode === "local" ? "Desenvolvimento local" : null) });
  } catch {
    // History is best effort; the main operation already succeeded.
  }
}

export async function createEntity<K extends EntityKey>(entity: K, input: unknown, session?: ControlSession): Promise<Entity<K>> {
  const parsed = ENTITIES[entity].safeParse(input);
  if (!parsed.success) throw new ValidationError(fieldErrors(parsed.error));
  const store = await getStore();
  const row = await store.insert(entity, parsed.data as Record<string, unknown>);
  await logActivity(entity, row.id, "created", `${LABEL[entity] ?? entity} criado: ${titleOf(row)}`, session);
  return row;
}

export async function updateEntity<K extends EntityKey>(entity: K, id: string, input: unknown, session?: ControlSession): Promise<Entity<K>> {
  // Partial validation without applying defaults to fields that were not sent.
  const schema = ENTITIES[entity] as unknown as { partial: () => { safeParse: (v: unknown) => { success: boolean; data?: unknown; error?: unknown } } };
  const parsed = schema.partial().safeParse(input);
  if (!parsed.success) throw new ValidationError(fieldErrors(parsed.error as never));
  const sent = Object.keys((input ?? {}) as object);
  const patch = Object.fromEntries(Object.entries(parsed.data as Record<string, unknown>).filter(([k]) => sent.includes(k)));
  const store = await getStore();
  const before = await store.get(entity, id);
  if (!before) throw new StoreError("Registro não encontrado.", 404, "not_found");
  const row = await store.update(entity, id, patch);
  const statusChanged = "status" in patch && (before as Record<string, unknown>).status !== patch.status;
  await logActivity(entity, id, statusChanged ? "status" : "updated", statusChanged ? `${LABEL[entity] ?? entity} "${titleOf(row)}" mudou para ${String(patch.status)}` : `${LABEL[entity] ?? entity} atualizado: ${titleOf(row)}`, session);
  return row;
}

export async function deleteEntity(entity: EntityKey, id: string, session?: ControlSession) {
  const store = await getStore();
  const before = await store.get(entity, id);
  if (!before) throw new StoreError("Registro não encontrado.", 404, "not_found");
  await store.remove(entity, id);
  await logActivity(entity, id, "deleted", `${LABEL[entity] ?? entity} removido: ${titleOf(before)}`, session);
}

/** Uniform JSON error responses for the Control API (no stack traces, no internals). */
export function errorResponse(error: unknown) {
  if (error instanceof ValidationError) return Response.json({ error: error.message, fields: error.fields }, { status: 422 });
  if (error instanceof StoreError) return Response.json({ error: error.message, code: error.code }, { status: error.status });
  console.error("[control] unexpected error", error instanceof Error ? error.name : "unknown");
  return Response.json({ error: "Erro inesperado. Tente novamente." }, { status: 500 });
}
