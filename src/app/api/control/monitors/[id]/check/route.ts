import { guard, isResponse, sameOrigin } from "@/lib/control/guard";
import { getStore } from "@/lib/control/store";
import { errorResponse, logActivity } from "@/lib/control/service";
import { runMonitorCheck } from "@/lib/control/monitor";

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
    const { updated, result } = await runMonitorCheck(store, monitor, (title) => logActivity("monitors", id, "incident", `Sinal em ${monitor.name}: ${title}`, session));
    return Response.json({ data: updated, result });
  } catch (error) {
    return errorResponse(error);
  }
}
