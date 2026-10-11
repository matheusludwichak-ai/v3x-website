import { z } from "zod";
import { guard, isResponse, sameOrigin } from "@/lib/control/guard";
import { evolutionConfig, SITE_URL } from "@/lib/control/env";
import { connectInstance, connectionState, EvolutionError, logoutInstance, setWebhook } from "@/lib/control/evolution";
import { logActivity } from "@/lib/control/service";

const body = z.object({ action: z.enum(["connect", "logout", "webhook"]) });

const fail = (e: unknown) =>
  e instanceof EvolutionError ? Response.json({ error: e.message, code: e.code }, { status: e.status }) : Response.json({ error: "Falha ao falar com a Evolution." }, { status: 502 });

/** Current connection state of the WhatsApp instance (any Control member). */
export async function GET() {
  const session = await guard("read");
  if (isResponse(session)) return session;
  if (!evolutionConfig().configured) return Response.json({ configured: false, state: null });
  try {
    const st = await connectionState();
    return Response.json({ configured: true, state: st.state });
  } catch (e) {
    return fail(e);
  }
}

/** Admin actions: connect (QR / pairing code), logout, configure webhook. */
export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Origem não permitida." }, { status: 403 });
  const session = await guard("write");
  if (isResponse(session)) return session;
  if (session.mode === "supabase" && session.user?.role !== "admin") return Response.json({ error: "Apenas administradores podem conectar o WhatsApp." }, { status: 403 });
  const ev = evolutionConfig();
  if (!ev.configured) return Response.json({ error: "Integração não configurada.", code: "not_configured" }, { status: 503 });
  const parsed = body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Ação inválida." }, { status: 400 });

  try {
    if (parsed.data.action === "connect") {
      const result = await connectInstance();
      return Response.json(result);
    }
    if (parsed.data.action === "logout") {
      await logoutInstance();
      await logActivity("conversations", null, "updated", "WhatsApp desconectado da instância", session);
      return Response.json({ ok: true });
    }
    if (!ev.webhookSecret) return Response.json({ error: "Defina EVOLUTION_WEBHOOK_SECRET na Vercel antes de cadastrar o webhook.", code: "no_secret" }, { status: 400 });
    await setWebhook(`${SITE_URL}/api/control/whatsapp/webhook`, ev.webhookSecret);
    await logActivity("conversations", null, "updated", "Webhook do WhatsApp cadastrado na Evolution", session);
    return Response.json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}
