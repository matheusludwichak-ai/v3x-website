import { z } from "zod";
import { guard, isResponse, sameOrigin } from "@/lib/control/guard";
import { aiErrorResponse } from "@/lib/control/ai/gemini";
import { enforceAIQuota } from "@/lib/control/ai/usage";
import { assistConversation, checklistFor, generateArticle, projectBrief, rewriteSection, runTextAction, suggestTasks, suggestTopics, TEXT_ACTIONS, type TextAction } from "@/lib/control/ai/actions";
import { errorResponse } from "@/lib/control/service";

export const maxDuration = 120;

const request = z.discriminatedUnion("action", [
  z.object({ action: z.literal("text"), op: z.enum(Object.keys(TEXT_ACTIONS) as [TextAction, ...TextAction[]]), text: z.string().min(1).max(12000), context: z.string().max(500).optional() }),
  z.object({ action: z.literal("blog.topics"), theme: z.string().max(300).optional(), service: z.string().max(120).optional(), audience: z.string().max(300).optional(), count: z.number().int().min(1).max(10).optional(), existingTitles: z.array(z.string()).max(80).optional() }),
  z.object({
    action: z.literal("blog.article"),
    title: z.string().min(3).max(200),
    primary_keyword: z.string().max(120).optional(),
    secondary_keywords: z.array(z.string().max(120)).max(10).optional(),
    search_intent: z.string().max(40).optional(),
    audience: z.string().max(300).optional(),
    awareness_stage: z.string().max(40).optional(),
    related_service: z.string().max(120).optional(),
    angle: z.string().max(500).optional(),
    questions: z.array(z.string().max(300)).max(10).optional(),
    length: z.enum(["short", "standard", "long"]).optional(),
  }),
  z.object({ action: z.literal("blog.section"), articleTitle: z.string().max(200), section: z.string().min(1).max(10000), instruction: z.string().min(2).max(500), keyword: z.string().max(120).optional() }),
  z.object({ action: z.literal("tasks.checklist"), title: z.string().min(2).max(200), description: z.string().max(5000).optional().nullable(), project: z.string().max(200).optional().nullable() }),
  z.object({ action: z.literal("tasks.suggest"), context: z.string().min(10).max(12000) }),
  z.object({ action: z.literal("projects.brief"), context: z.string().min(10).max(14000) }),
  z.object({ action: z.literal("conversation"), mode: z.enum(["reply", "summary", "classify"]), transcript: z.array(z.object({ direction: z.enum(["in", "out"]), body: z.string().max(4000) })).min(1).max(60) }),
]);

export async function POST(req: Request) {
  if (!sameOrigin(req)) return Response.json({ error: "Origem não permitida." }, { status: 403 });
  const session = await guard("ai");
  if (isResponse(session)) return session;
  const parsed = request.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Pedido inválido para a IA." }, { status: 400 });
  const input = parsed.data;
  try {
    await enforceAIQuota(session, input.action);
    switch (input.action) {
      case "text":
        return Response.json(await runTextAction(input.op, input.text, input.context));
      case "blog.topics":
        return Response.json(await suggestTopics(input));
      case "blog.article":
        return Response.json(await generateArticle(input));
      case "blog.section":
        return Response.json(await rewriteSection(input));
      case "tasks.checklist":
        return Response.json(await checklistFor(input));
      case "tasks.suggest":
        return Response.json(await suggestTasks(input.context));
      case "projects.brief":
        return Response.json(await projectBrief(input.context));
      case "conversation":
        return Response.json(await assistConversation(input.mode, input.transcript));
    }
  } catch (error) {
    return aiErrorResponse(error) ?? errorResponse(error);
  }
}
