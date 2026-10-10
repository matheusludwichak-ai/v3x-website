import { z } from "zod";
import { guard, isResponse, sameOrigin } from "@/lib/control/guard";
import { getStore } from "@/lib/control/store";
import { errorResponse } from "@/lib/control/service";
import { EvolutionError, sendText } from "@/lib/control/evolution";
import { evolutionConfig } from "@/lib/control/env";

const body = z.object({ conversation_id: z.string().min(1), text: z.string().trim().min(1, "Escreva a mensagem.").max(4000) });

/** Sends one message typed (or approved) by a person. Duplicate sends within 15 s are refused. */
export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Origem não permitida." }, { status: 403 });
  const session = await guard("write");
  if (isResponse(session)) return session;
  if (!evolutionConfig().configured) return Response.json({ error: "Integração não configurada.", code: "not_configured" }, { status: 503 });
  const parsed = body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: parsed.error.issues[0]?.message ?? "Mensagem inválida." }, { status: 400 });

  try {
    const store = await getStore();
    const conversation = await store.get("conversations", parsed.data.conversation_id);
    if (!conversation) return Response.json({ error: "Conversa não encontrada." }, { status: 404 });

    const recent = await store.list("messages", { where: { conversation_id: conversation.id, direction: "out" }, limit: 5 });
    const duplicate = recent.find((m) => m.body === parsed.data.text && Date.now() - new Date(m.created_at).getTime() < 15000);
    if (duplicate) return Response.json({ error: "Esta mensagem acabou de ser enviada.", code: "duplicate" }, { status: 409 });

    const pending = await store.insert("messages", { conversation_id: conversation.id, direction: "out", body: parsed.data.text, status: "pending", sent_by: session.user?.email ?? "Control" });
    try {
      const { externalId } = await sendText(conversation.phone ?? conversation.remote_jid, parsed.data.text);
      const sent = await store.update("messages", pending.id, { status: "sent", external_id: externalId });
      await store.update("conversations", conversation.id, { last_message_at: sent.created_at, last_message_preview: parsed.data.text.slice(0, 140), unread_count: 0 });
      return Response.json({ data: sent });
    } catch (error) {
      const message = error instanceof EvolutionError ? error.message : "Falha no envio.";
      await store.update("messages", pending.id, { status: "failed", error: message });
      return Response.json({ error: message, code: "send_failed", messageId: pending.id }, { status: 502 });
    }
  } catch (error) {
    return errorResponse(error);
  }
}
