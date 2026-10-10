import "server-only";
import { getControlSession, type ControlSession } from "./auth";

type Need = "read" | "write" | "ai";

/**
 * API guard. Returns the session, or a Response to send back when access is denied.
 * Reads are allowed in demo mode (demo data only); writes and AI need a real session.
 */
export async function guard(need: Need): Promise<ControlSession | Response> {
  const session = await getControlSession();
  if (session.mode === "supabase" && !session.user) {
    return Response.json({ error: session.reason ?? "Não autenticado." }, { status: 401 });
  }
  if (session.mode === "local" && !session.canWrite) {
    return Response.json({ error: session.reason }, { status: 403 });
  }
  if (need === "write" && !session.canWrite) {
    return Response.json({ error: session.reason ?? "Sem permissão para alterar dados.", code: session.mode === "demo" ? "readonly_demo" : "forbidden" }, { status: session.mode === "demo" ? 503 : 403 });
  }
  if (need === "ai" && !session.canUseAI) {
    return Response.json({ error: session.reason ?? "Sem permissão para usar a IA.", code: session.mode === "demo" ? "readonly_demo" : "forbidden" }, { status: session.mode === "demo" ? 503 : 403 });
  }
  return session;
}

export const isResponse = (value: unknown): value is Response => value instanceof Response;

/** Rejects cross-site browser writes (CSRF) by checking the Origin header against the host. */
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true; // non-browser clients (tests, curl) send no Origin
  try {
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
