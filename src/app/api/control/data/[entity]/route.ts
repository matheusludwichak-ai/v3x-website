import { isEntityKey, WRITABLE, type EntityKey } from "@/lib/control/schema";
import { guard, isResponse, sameOrigin } from "@/lib/control/guard";
import { createEntity, errorResponse } from "@/lib/control/service";
import { getStore } from "@/lib/control/store";
import { enforceEntityRules } from "@/lib/control/rules";

type Ctx = { params: Promise<{ entity: string }> };

export async function GET(request: Request, { params }: Ctx) {
  const { entity } = await params;
  if (!isEntityKey(entity)) return Response.json({ error: "Coleção inexistente." }, { status: 404 });
  const session = await guard("read");
  if (isResponse(session)) return session;
  try {
    const url = new URL(request.url);
    const limit = Math.min(Number(url.searchParams.get("limit") ?? 500) || 500, 1000);
    const where: Record<string, string> = {};
    for (const [k, v] of url.searchParams) if (k.startsWith("where.")) where[k.slice(6)] = v;
    const store = await getStore();
    const rows = await store.list(entity as EntityKey, { limit, where });
    return Response.json({ data: rows, mode: session.mode, readonly: store.readonly || !session.canWrite });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request, { params }: Ctx) {
  const { entity } = await params;
  if (!isEntityKey(entity) || !WRITABLE.includes(entity)) return Response.json({ error: "Coleção inexistente ou somente leitura." }, { status: 404 });
  if (!sameOrigin(request)) return Response.json({ error: "Origem não permitida." }, { status: 403 });
  const session = await guard("write");
  if (isResponse(session)) return session;
  try {
    const body = await request.json().catch(() => ({}));
    const rejected = enforceEntityRules(entity, body, "create");
    if (rejected) return rejected;
    const row = await createEntity(entity, body, session);
    return Response.json({ data: row }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
