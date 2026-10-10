import { guard, isResponse, sameOrigin } from "@/lib/control/guard";
import { getStore } from "@/lib/control/store";
import { errorResponse, logActivity } from "@/lib/control/service";
import { checkUrl, incidentFrom } from "@/lib/control/monitor";

type Ctx = { params: Promise<{ id: string }> };

/** Runs one real external check on demand and records the result. No background loop. */
export async function POST(request: Request, { params }: Ctx) {
  if (!sameOrigin(request)) return Response.json({ error: "Origem não permitida." }, { status: 403 });
  const session = await guard("write");
  if (isResponse(session)) return session;
  const { id } = await params;
  try {
    const store = await getStore();
    const monitor = await store.get("monitors", id);
    if (!monitor) return Response.json({ error: "Monitor não encontrado." }, { status: 404 });
    const result = await checkUrl(monitor.url);
    const updated = await store.update("monitors", id, {
      last_status: result.status,
      last_http_status: result.httpStatus,
      last_latency_ms: result.latencyMs,
      tls_expires_at: result.tlsExpiresAt,
      last_checked_at: result.checkedAt,
      last_error: result.error,
    });
    const signal = incidentFrom(result, monitor.last_status);
    const open = (await store.list("incidents", { where: { monitor_id: id, status: "open" } }))[0];
    if (signal && !open) {
      await store.insert("incidents", { monitor_id: id, ...signal, status: "open", opened_at: result.checkedAt, resolved_at: null });
      await logActivity("monitors", id, "incident", `Sinal em ${monitor.name}: ${signal.title}`, session);
    } else if (!signal && open) {
      await store.update("incidents", open.id, { status: "resolved", resolved_at: result.checkedAt });
    }
    return Response.json({ data: updated, result });
  } catch (error) {
    return errorResponse(error);
  }
}
