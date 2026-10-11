import { after } from "next/server";
import { getSystemStore } from "@/lib/control/store";
import { autoReply } from "@/lib/control/assistant";
import { parseWebhook, verifyWebhook } from "@/lib/control/evolution";
import { StoreError } from "@/lib/control/store/types";

/**
 * Receives Evolution API events. Authenticated by EVOLUTION_WEBHOOK_SECRET
 * (header x-webhook-secret only), idempotent by message id. Inbound messages land in
 * the inbox; when the WhatsApp assistant is enabled (Atendimento), it answers after the
 * response is sent (see lib/control/assistant.ts). Logs carry counts, never content or numbers.
 */
export const maxDuration = 60;
export async function POST(request: Request) {
  if (!verifyWebhook(request)) return Response.json({ error: "Não autorizado." }, { status: 401 });
  const store = getSystemStore();
  if (!store) return Response.json({ error: "Banco de dados não configurado para receber eventos." }, { status: 503 });

  const payload = await request.json().catch(() => null);
  if (!payload) return Response.json({ error: "Payload inválido." }, { status: 400 });
  const events = parseWebhook(payload);
  const summary = { stored: 0, duplicates: 0, statuses: 0, ignored: 0 };
  const toAnswer = new Map<string, string>(); // conversation id -> latest inbound message id

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
    if (event.fromMe) {
      // Echo of a message the Control itself just sent (stored before the external id arrived).
      const recent = await store.list("messages", { where: { conversation_id: conversation.id, direction: "out" }, limit: 20 });
      const echo = recent.find((m) => !m.external_id && m.body === event.body && Date.now() - Date.parse(m.created_at) < 120_000);
      if (echo) {
        await store.update("messages", echo.id, { external_id: event.externalId });
        summary.duplicates++;
        continue;
      }
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
    if (!event.fromMe) toAnswer.set(conversation.id, event.externalId);
  }

  for (const [conversationId, externalId] of toAnswer) {
    after(async () => {
      const outcome = await autoReply(store, conversationId, externalId).catch(() => "failed");
      if (outcome !== "disabled") console.info("[assistant]", outcome);
    });
  }

  console.info("[whatsapp] webhook", summary);
  return Response.json({ ok: true, ...summary });
}
