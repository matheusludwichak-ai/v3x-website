import { guard, isResponse } from "@/lib/control/guard";
import { getSystemStore } from "@/lib/control/store";
import { exportControlData } from "@/lib/control/backup";
import { logActivity } from "@/lib/control/service";

/** Fresh JSON copy of the Control data, for administrators to keep outside Supabase. */
export async function GET() {
  const session = await guard("write");
  if (isResponse(session)) return session;
  if (session.mode === "supabase" && session.user?.role !== "admin") return Response.json({ error: "Apenas administradores baixam o backup." }, { status: 403 });
  const store = getSystemStore();
  if (!store) return Response.json({ error: "Banco de dados não configurado." }, { status: 503 });
  const data = await exportControlData(store);
  await logActivity("monitors", null, "updated", "Backup dos dados do Control baixado", session);
  const day = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(new Date());
  return new Response(JSON.stringify(data, null, 2), {
    headers: { "Content-Type": "application/json; charset=utf-8", "Content-Disposition": `attachment; filename="v3x-control-backup-${day}.json"`, "Cache-Control": "no-store" },
  });
}
