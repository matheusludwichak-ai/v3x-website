import { z } from "zod";
import { guard, isResponse, sameOrigin } from "@/lib/control/guard";
import { getStore } from "@/lib/control/store";
import { aiErrorResponse } from "@/lib/control/ai/gemini";
import { enforceAIQuota } from "@/lib/control/ai/usage";
import { errorResponse } from "@/lib/control/service";
import { draftAssistantReply, operationKnowledge } from "@/lib/control/assistant";
import type { KnowledgeItem } from "@/lib/control/schema";

const body = z.object({
  message: z.string().trim().min(1, "Escreva uma mensagem de cliente.").max(1500),
  history: z.array(z.object({ direction: z.enum(["in", "out"]), body: z.string().max(1500) })).max(20).default([]),
});

/** Simulates the assistant's reply to a customer message. Nothing is sent to WhatsApp. */
export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Origem não permitida." }, { status: 403 });
  const session = await guard("ai");
  if (isResponse(session)) return session;
  const parsed = body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: parsed.error.issues[0]?.message ?? "Mensagem inválida." }, { status: 400 });
  try {
    await enforceAIQuota(session, "assistant_test");
    const store = await getStore();
    const items = (await store.list("knowledge_items", { limit: 200 })) as KnowledgeItem[];
    const draft = await draftAssistantReply({ transcript: [...parsed.data.history, { direction: "in", body: parsed.data.message }], contactName: "Cliente de teste", knowledge: operationKnowledge(items) });
    return Response.json({ draft });
  } catch (error) {
    return aiErrorResponse(error) ?? errorResponse(error);
  }
}
