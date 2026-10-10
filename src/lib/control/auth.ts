import "server-only";
import { headers } from "next/headers";
import { controlMode, type ControlMode } from "./env";
import { supabaseForRequest } from "./supabase";

export type ControlRole = "admin" | "member" | "client_viewer";

export type ControlSession = {
  mode: ControlMode;
  /** Present only in Supabase mode, after sign-in and allowlist check. */
  user: { id: string; email: string | null; role: ControlRole; clientId: string | null } | null;
  canWrite: boolean;
  canUseAI: boolean;
  reason?: string;
};

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]", "::1"]);

async function isLocalRequest() {
  const h = await headers();
  const host = (h.get("x-forwarded-host") ?? h.get("host") ?? "").split(":")[0]!.toLowerCase();
  return LOCAL_HOSTS.has(host) || host.endsWith(".localhost");
}

/**
 * Resolves who is using the Control and what they may do.
 * - supabase: signed-in user that also exists in control_users (allowlist). Role comes from the database.
 * - local:    development on localhost only, single developer, no sign-in.
 * - demo:     production without database: read-only, no AI.
 */
export async function getControlSession(): Promise<ControlSession> {
  const mode = controlMode();

  if (mode === "local") {
    const local = await isLocalRequest();
    return local
      ? { mode, user: null, canWrite: true, canUseAI: true }
      : { mode, user: null, canWrite: false, canUseAI: false, reason: "O modo local só aceita acesso pelo próprio computador." };
  }

  if (mode === "demo") {
    return { mode, user: null, canWrite: false, canUseAI: false, reason: "Modo demonstração: configure o Supabase para salvar dados e usar a IA." };
  }

  const db = await supabaseForRequest();
  const { data } = (await db?.auth.getUser()) ?? { data: { user: null } };
  const user = data.user;
  if (!db || !user) return { mode, user: null, canWrite: false, canUseAI: false, reason: "Entre com sua conta para usar o Control." };

  const { data: member } = await db.from("control_users").select("role, client_id, active").eq("user_id", user.id).maybeSingle();
  if (!member || member.active === false) {
    return { mode, user: null, canWrite: false, canUseAI: false, reason: "Sua conta não tem acesso ao Control. Peça a um administrador para liberar." };
  }
  const role = (member.role as ControlRole) ?? "member";
  const internal = role === "admin" || role === "member";
  return {
    mode,
    user: { id: user.id, email: user.email ?? null, role, clientId: (member.client_id as string | null) ?? null },
    canWrite: internal,
    canUseAI: internal,
  };
}
