import { isEntityKey, WRITABLE } from "@/lib/control/schema";
import { guard, isResponse, sameOrigin } from "@/lib/control/guard";
import { deleteEntity, errorResponse, updateEntity } from "@/lib/control/service";
import { getStore } from "@/lib/control/store";
import { enforceEntityRules } from "@/lib/control/rules";

type Ctx = { params: Promise<{ entity: string; id: string }> };

export async function GET(_request: Request, { params }: Ctx) {
  const { entity, id } = await params;
  if (!isEntityKey(entity)) return Response.json({ error: "Coleção inexistente." }, { status: 404 });
  const session = await guard("read");
  if (isResponse(session)) return session;
  try {
    const row = await (await getStore()).get(entity, id);
    if (!row) return Response.json({ error: "Registro não encontrado." }, { status: 404 });
    return Response.json({ data: row });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: Request, { params }: Ctx) {
  const { entity, id } = await params;
  if (!isEntityKey(entity) || !WRITABLE.includes(entity)) return Response.json({ error: "Coleção inexistente ou somente leitura." }, { status: 404 });
  if (!sameOrigin(request)) return Response.json({ error: "Origem não permitida." }, { status: 403 });
  const session = await guard("write");
  if (isResponse(session)) return session;
  try {
    const body = await request.json().catch(() => ({}));
    const rejected = enforceEntityRules(entity, body, "update");
    if (rejected) return rejected;
    return Response.json({ data: await updateEntity(entity, id, body, session) });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: Request, { params }: Ctx) {
  const { entity, id } = await params;
  if (!isEntityKey(entity) || !WRITABLE.includes(entity)) return Response.json({ error: "Coleção inexistente ou somente leitura." }, { status: 404 });
  if (!sameOrigin(request)) return Response.json({ error: "Origem não permitida." }, { status: 403 });
  const session = await guard("write");
  if (isResponse(session)) return session;
  if (entity === "org_members") return Response.json({ error: "Pessoas do organograma não são apagadas: marque como inativa." }, { status: 400 });
  try {
    await deleteEntity(entity, id, session);
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
