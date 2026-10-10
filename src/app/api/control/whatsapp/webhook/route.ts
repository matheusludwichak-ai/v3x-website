import { getSystemStore } from "@/lib/control/store";
import { parseWebhook, verifyWebhook } from "@/lib/control/evolution";
import { StoreError } from "@/lib/control/store/types";

/**
 * Receives Evolution API events. Authenticated by EVOLUTION_WEBHOOK_SECRET
 * (header x-webhook-secret or ?token=), idempotent by message id, and it never
 * replies automatically: inbound messages only land in the inbox for a person.
 * Logs carry event types and counts, never message content or phone numbers.
 */
export async function POST(request: Request) {
  if (!verifyWebhook(request)) return Response.json({ error: "Não autorizado." }, { status: 401 });
  const store = getSystemStore();
  if (!store) return Response.json({ error: "Banco de dados não configurado para receber eventos." }, { status: 503 });

  const payload = await request.json().catch(() => null);
  if (!payload) return Response.json({ error: "Payload inválido." }, { status: 400 });
  const events = parseWebhook(payload);
  const summary = { stored: 0, duplicates: 0, statuses: 0, ignored: 0 };

  for (const event of events) {
    if (event.kind === "ignored") {
      summary.ignored++;
      continue;
    }
    if (event.kind === "status") {
      const msg = (await store.list("messages", { where: { external_id: event.externalId }, limit: 1 }))[0];
      if (msg && msg.status !== event.status) {
        await store.update("messages", msg.id, { status: event.status });
        summary.statuses++;
      }
      continue;
    }
    const existing = await store.list("messages", { where: { external_id: event.externalId }, limit: 1 });
    if (existing.length) {
      summary.duplicates++;
      continue;
    }
    let conversation = (await store.list("conversations", { where: { remote_jid: event.remoteJid }, limit: 1 }))[0];
    if (!conversation) {
      conversation = await store.insert("conversations", {
        remote_jid: event.remoteJid,
        contact_name: event.name,
        phone: event.remoteJid.replace(/@.*/, ""),
        status: "pending",
        unread_count: 0,
        last_message_at: event.at,
      });
    }
    try {
      await store.insert("messages", { conversation_id: conversation.id, external_id: event.externalId, direction: event.fromMe ? "out" : "in", body: event.body, status: event.fromMe ? "sent" : "received", sent_by: event.fromMe ? "WhatsApp" : null });
    } catch (error) {
      if (error instanceof StoreError && error.status === 409) {
        summary.duplicates++;
        continue;
      }
      throw error;
    }
    await store.update("conversations", conversation.id, {
      last_message_at: event.at,
      last_message_preview: event.body.slice(0, 140),
      unread_count: event.fromMe ? conversation.unread_count : (conversation.unread_count ?? 0) + 1,
      status: event.fromMe ? conversation.status : "pending",
      ...(event.name && !conversation.contact_name ? { contact_name: event.name } : {}),
    });
    summary.stored++;
  }

  console.info("[whatsapp] webhook", summary);
  return Response.json({ ok: true, ...summary });
}
