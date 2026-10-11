import "server-only";
import { geminiConfig } from "../env";
import { supabaseAdmin, supabaseForRequest } from "../supabase";
import type { ControlSession } from "../auth";
import { AIError } from "./gemini";

/**
 * Workspace-wide daily AI limit. In Supabase mode the count lives in the
 * ai_usage table (shared by every server instance); otherwise the in-memory
 * counter inside gemini.ts is the only limit.
 */
export async function enforceAIQuota(session: ControlSession, action: string) {
  if (session.mode !== "supabase" || !session.user) return;
  const db = await supabaseForRequest();
  if (!db) return;
  const { data: used, error } = await db.rpc("ai_usage_today");
  if (error) {
    // Table missing (second migration not applied yet): fall back to the in-memory limit.
    console.error("[control/ai] usage count unavailable", error.code);
    return;
  }
  if (typeof used === "number" && used >= geminiConfig().dailyLimit) {
    throw new AIError("daily_limit", "Limite diário de uso da IA no Control atingido. Ajuste CONTROL_AI_DAILY_LIMIT se necessário.", 429);
  }
  await db.from("ai_usage").insert({ action: action.slice(0, 60) });
}

/**
 * Same workspace-wide daily limit for work without a signed-in person (WhatsApp assistant).
 * Uses the service role on the server; the row is recorded without a user.
 */
export async function enforceSystemAIQuota(action: string) {
  const db = supabaseAdmin();
  if (!db) return;
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  const { count, error } = await db.from("ai_usage").select("id", { count: "exact", head: true }).gte("created_at", start.toISOString());
  if (error) {
    console.error("[control/ai] usage count unavailable", error.code);
    return;
  }
  if ((count ?? 0) >= geminiConfig().dailyLimit) throw new AIError("daily_limit", "Limite diário de uso da IA no Control atingido.", 429);
  await db.from("ai_usage").insert({ action: action.slice(0, 60), user_id: null });
}
