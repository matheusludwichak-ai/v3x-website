import type { EntityKey } from "./schema";

/**
 * Business rules the generic data API refuses to bypass. Publishing an article
 * and approving a portfolio item for the public site need their own explicit,
 * confirmed actions (see /api/control/articles/[id]/publish and
 * /api/control/portfolio/[id]/visibility).
 */
export function enforceEntityRules(entity: EntityKey, body: unknown, op: "create" | "update"): Response | null {
  const data = (body ?? {}) as Record<string, unknown>;
  if (entity === "articles") {
    if (data.status === "published" || "published_at" in data) {
      return Response.json({ error: "Para publicar, use a ação Publicar, que pede confirmação." }, { status: 400 });
    }
  }
  if (entity === "portfolio_items" && data.public_approved === true) {
    return Response.json({ error: "A exibição pública precisa ser aprovada pela ação própria, com confirmação." }, { status: 400 });
  }
  if (entity === "monitors" && op === "update") {
    const verified = ["last_status", "last_http_status", "last_latency_ms", "tls_expires_at", "last_checked_at", "last_error"];
    if (verified.some((k) => k in data)) {
      return Response.json({ error: "O estado do monitor só é atualizado por uma verificação real." }, { status: 400 });
    }
  }
  if (entity === "monitors" && op === "create") {
    data.last_status = "unknown";
  }
  return null;
}
