"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Entity, EntityKey } from "@/lib/control/schema";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public fields?: Record<string, string>,
    public extra?: Record<string, unknown>,
  ) {
    super(message);
  }
}

export async function api<T = unknown>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, { ...init, headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) } });
  } catch {
    throw new ApiError("Sem conexão com o servidor. Verifique sua internet.", 0, "network");
  }
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) throw new ApiError(String(json.error ?? "Algo deu errado."), res.status, json.code as string | undefined, json.fields as Record<string, string> | undefined, json);
  return json as T;
}

export type SessionInfo = {
  mode: "supabase" | "local" | "demo";
  user: { email: string | null; role: string } | null;
  canWrite: boolean;
  canUseAI: boolean;
  reason: string | null;
  ai: { configured: boolean };
  whatsapp: { configured: boolean };
};

let sessionCache: Promise<SessionInfo> | null = null;
export function useSession() {
  const [session, setSession] = useState<SessionInfo | null>(null);
  useEffect(() => {
    sessionCache ??= api<SessionInfo>("/api/control/session").catch((e) => {
      sessionCache = null;
      throw e;
    });
    sessionCache.then(setSession).catch(() => setSession(null));
  }, []);
  return session;
}

/** Loads a collection and exposes create/update/remove with optimistic updates. */
export function useCollection<K extends EntityKey>(entity: K, where?: Record<string, string>) {
  const [rows, setRows] = useState<Entity<K>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [readonly, setReadonly] = useState(false);
  const key = JSON.stringify(where ?? {});
  const alive = useRef(true);

  const fetchRows = useCallback(() => {
    const qs = new URLSearchParams(Object.entries(JSON.parse(key) as Record<string, string>).map(([k, v]) => [`where.${k}`, v]));
    return api<{ data: Entity<K>[]; readonly: boolean }>(`/api/control/data/${entity}${qs.size ? `?${qs}` : ""}`);
  }, [entity, key]);

  const apply = useCallback((res: { data: Entity<K>[]; readonly: boolean } | null, err: unknown) => {
    if (!alive.current) return;
    if (res) {
      setRows(res.data);
      setReadonly(res.readonly);
      setError(null);
    } else setError((err as Error).message);
    setLoading(false);
  }, []);

  /** Manual refresh (also used after errors). */
  const load = useCallback(() => fetchRows().then((r) => apply(r, null), (e) => apply(null, e)), [fetchRows, apply]);

  useEffect(() => {
    alive.current = true;
    fetchRows().then((r) => apply(r, null), (e) => apply(null, e));
    return () => {
      alive.current = false;
    };
  }, [fetchRows, apply]);

  const create = useCallback(
    async (data: Record<string, unknown>) => {
      const res = await api<{ data: Entity<K> }>(`/api/control/data/${entity}`, { method: "POST", body: JSON.stringify(data) });
      setRows((r) => [res.data, ...r]);
      return res.data;
    },
    [entity],
  );

  const update = useCallback(
    async (id: string, patch: Record<string, unknown>) => {
      let previous: Entity<K>[] = [];
      setRows((r) => {
        previous = r;
        return r.map((row) => (row.id === id ? ({ ...row, ...patch } as Entity<K>) : row));
      });
      try {
        const res = await api<{ data: Entity<K> }>(`/api/control/data/${entity}/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
        setRows((r) => r.map((row) => (row.id === id ? res.data : row)));
        return res.data;
      } catch (e) {
        setRows(previous);
        throw e;
      }
    },
    [entity],
  );

  const remove = useCallback(
    async (id: string) => {
      let previous: Entity<K>[] = [];
      setRows((r) => {
        previous = r;
        return r.filter((row) => row.id !== id);
      });
      try {
        await api(`/api/control/data/${entity}/${id}`, { method: "DELETE" });
      } catch (e) {
        setRows(previous);
        throw e;
      }
    },
    [entity],
  );

  const replace = useCallback((row: Entity<K>) => setRows((r) => r.map((x) => (x.id === row.id ? row : x))), []);

  return { rows, loading, error, readonly, reload: load, create, update, remove, replace, setRows };
}

export function useRecord<K extends EntityKey>(entity: K, id: string) {
  const [row, setRow] = useState<Entity<K> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchRow = useCallback(() => api<{ data: Entity<K> }>(`/api/control/data/${entity}/${id}`), [entity, id]);
  const onLoaded = useCallback((res: { data: Entity<K> } | null, err: unknown) => {
    if (res) {
      setRow(res.data);
      setError(null);
    } else setError((err as Error).message);
    setLoading(false);
  }, []);
  const load = useCallback(() => fetchRow().then((r) => onLoaded(r, null), (e) => onLoaded(null, e)), [fetchRow, onLoaded]);
  useEffect(() => {
    let alive = true;
    fetchRow().then((r) => alive && onLoaded(r, null), (e) => alive && onLoaded(null, e));
    return () => {
      alive = false;
    };
  }, [fetchRow, onLoaded]);
  return { row, setRow, loading, error, reload: load };
}

/** Calls an AI action. Errors carry a code: not_configured, quota, timeout, readonly_demo... */
export function ai<T = Record<string, unknown>>(payload: Record<string, unknown>) {
  return api<T>("/api/control/ai", { method: "POST", body: JSON.stringify(payload) });
}

/** Local calendar date (YYYY-MM-DD); UTC would flip to tomorrow in the Brazilian evening. */
export const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
export const fmtDate = (iso?: string | null) => (iso ? new Date(iso.length === 10 ? `${iso}T12:00:00` : iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }) : "Sem data");
export const fmtDateTime = (iso?: string | null) => (iso ? new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "Nunca");
export const relative = (iso?: string | null) => {
  if (!iso) return "Nunca";
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "agora";
  if (diff < 3600) return `há ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `há ${Math.floor(diff / 3600)} h`;
  if (diff < 86400 * 30) return `há ${Math.floor(diff / 86400)} d`;
  return fmtDate(iso);
};

const MEDIA_TYPES = { image: ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"], video: ["video/mp4", "video/webm", "video/quicktime"] } as const;

/**
 * Uploads a file to the Supabase Storage bucket "control-media" with the signed-in
 * user's session (storage policies only allow Control members) and returns its public URL.
 */
export async function uploadMedia(file: File, kind: "image" | "video", folder: string) {
  if (!(MEDIA_TYPES[kind] as readonly string[]).includes(file.type)) throw new Error(kind === "image" ? "Use JPG, PNG, WebP, AVIF ou GIF." : "Use MP4, WebM ou MOV.");
  if (file.size > 50 * 1024 * 1024) throw new Error("O arquivo passa de 50 MB.");
  const { supabaseBrowser } = await import("@/lib/control/browser");
  const sb = supabaseBrowser();
  if (!sb) throw new Error("Envio de arquivos disponível quando o Supabase estiver conectado.");
  const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
  const path = `${folder}/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${ext}`;
  const { error } = await sb.storage.from("control-media").upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw new Error("Não foi possível enviar o arquivo. Verifique se a migration de mídia foi aplicada.");
  return sb.storage.from("control-media").getPublicUrl(path).data.publicUrl;
}
