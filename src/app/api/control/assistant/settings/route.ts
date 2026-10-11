import { guard, isResponse, sameOrigin } from "@/lib/control/guard";
import { getStore } from "@/lib/control/store";
import { errorResponse, logActivity } from "@/lib/control/service";
import { assistantSettingsSchema, loadAssistantSettings, SETTINGS_KEY } from "@/lib/control/assistant";
import { evolutionConfig, geminiConfig } from "@/lib/control/env";

/** Assistant settings and whether it can actually run (members can read). */
export async function GET() {
  const session = await guard("read");
  if (isResponse(session)) return session;
  try {
    const store = await getStore();
    const settings = await loadAssistantSettings(store);
    return Response.json({ settings, ready: { whatsapp: evolutionConfig().configured, ai: geminiConfig().configured }, canEdit: session.mode === "local" || session.user?.role === "admin" });
  } catch (error) {
    return errorResponse(error);
  }
}

/** Only administrators turn the automatic replies on or change limits. */
export async function PUT(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Origem não permitida." }, { status: 403 });
  const session = await guard("write");
  if (isResponse(session)) return session;
  if (session.mode === "supabase" && session.user?.role !== "admin") return Response.json({ error: "Apenas administradores alteram as respostas automáticas." }, { status: 403 });
  const parsed = assistantSettingsSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Configuração inválida." }, { status: 400 });
  try {
    const store = await getStore();
    const existing = (await store.list("automation_settings", { where: { key: SETTINGS_KEY }, limit: 1 }))[0];
    const by = session.user?.email ?? "Desenvolvimento local";
    if (existing) await store.update("automation_settings", existing.id, { value: parsed.data, updated_by: by });
    else await store.insert("automation_settings", { key: SETTINGS_KEY, value: parsed.data, updated_by: by });
    await logActivity("conversations", null, "updated", `Respostas automáticas do WhatsApp ${parsed.data.enabled ? "ativadas" : "desativadas"}`, session);
    return Response.json({ settings: parsed.data });
  } catch (error) {
    return errorResponse(error);
  }
}
