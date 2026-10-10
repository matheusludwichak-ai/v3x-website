import { z } from "zod";
import { guard, isResponse, sameOrigin } from "@/lib/control/guard";
import { getStore } from "@/lib/control/store";
import { errorResponse, logActivity } from "@/lib/control/service";

type Ctx = { params: Promise<{ id: string }> };

const body = z.object({ public: z.boolean(), confirm: z.literal(true) });

/**
 * Approves (or withdraws) a portfolio item for the public site. Requires an explicit
 * confirmation and minimum confirmed information: a concluded project with a description
 * and a cover image. Internal notes are never part of the public data.
 */
export async function POST(request: Request, { params }: Ctx) {
  if (!sameOrigin(request)) return Response.json({ error: "Origem não permitida." }, { status: 403 });
  const session = await guard("write");
  if (isResponse(session)) return session;
  const parsed = body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Confirme a alteração de visibilidade.", code: "confirmation_required" }, { status: 428 });
  const { id } = await params;
  try {
    const store = await getStore();
    const item = await store.get("portfolio_items", id);
    if (!item) return Response.json({ error: "Item não encontrado." }, { status: 404 });
    if (parsed.data.public) {
      const missing = [item.status !== "done" && "status Concluído", !item.description && "descrição", !item.cover_url && "imagem de capa"].filter(Boolean);
      if (missing.length) return Response.json({ error: `Para aprovar a exibição pública, confirme antes: ${missing.join(", ")}.` }, { status: 422 });
    }
    const updated = await store.update("portfolio_items", id, { public_approved: parsed.data.public });
    await logActivity("portfolio_items", id, parsed.data.public ? "public" : "private", `${item.name} ${parsed.data.public ? "aprovado para o portfólio público" : "retirado do portfólio público"}`, session);
    return Response.json({ data: updated });
  } catch (error) {
    return errorResponse(error);
  }
}
