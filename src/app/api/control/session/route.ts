import { getControlSession } from "@/lib/control/auth";
import { evolutionConfig, geminiConfig } from "@/lib/control/env";

/** What the Control UI needs to know about the current visitor. No secrets. */
export async function GET() {
  const s = await getControlSession();
  return Response.json({
    mode: s.mode,
    user: s.user ? { email: s.user.email, role: s.user.role } : null,
    canWrite: s.canWrite,
    canUseAI: s.canUseAI,
    reason: s.reason ?? null,
    ai: { configured: geminiConfig().configured },
    whatsapp: { configured: evolutionConfig().configured },
  });
}
