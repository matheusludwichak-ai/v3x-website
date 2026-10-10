import { revalidatePath } from "next/cache";
import { z } from "zod";
import { guard, isResponse, sameOrigin } from "@/lib/control/guard";
import { getStore } from "@/lib/control/store";
import { errorResponse, logActivity } from "@/lib/control/service";
import { blockingIssues, seoChecklist } from "@/lib/control/seo";
import { mdxSlugs } from "@/lib/posts";

type Ctx = { params: Promise<{ id: string }> };

const body = z.object({
  action: z.enum(["review", "approve", "publish", "unpublish", "archive", "restore"]),
  /** Publishing and unpublishing require an explicit confirmation from the person. */
  confirm: z.boolean().optional(),
});

const NEXT_STATUS = { review: "review", approve: "approved", publish: "published", unpublish: "approved", archive: "archived", restore: "draft" } as const;

function refreshPublicBlog(slug: string) {
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/sitemap.xml");
}

export async function POST(request: Request, { params }: Ctx) {
  if (!sameOrigin(request)) return Response.json({ error: "Origem não permitida." }, { status: 403 });
  const session = await guard("write");
  if (isResponse(session)) return session;
  const parsed = body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Ação inválida." }, { status: 400 });
  const { action, confirm } = parsed.data;
  const { id } = await params;

  try {
    const store = await getStore();
    const article = await store.get("articles", id);
    if (!article) return Response.json({ error: "Artigo não encontrado." }, { status: 404 });

    if ((action === "publish" || action === "unpublish") && confirm !== true) {
      return Response.json({ error: "Confirme a ação para continuar.", code: "confirmation_required" }, { status: 428 });
    }

    if (action === "publish") {
      if (article.status !== "approved" && article.status !== "published") {
        return Response.json({ error: "Aprove o artigo antes de publicar. A publicação passa sempre por revisão humana." }, { status: 409 });
      }
      const others = (await store.list("articles", { where: { status: "published" } })).filter((a) => a.id !== id).map((a) => a.slug);
      const issues = blockingIssues(seoChecklist(article, [...mdxSlugs(), ...others]));
      if (issues.length) return Response.json({ error: "Corrija os itens obrigatórios antes de publicar.", issues: issues.map((i) => i.label) }, { status: 422 });
    }
    if (action === "approve" && article.status !== "review") {
      return Response.json({ error: "Só artigos em revisão podem ser aprovados." }, { status: 409 });
    }

    const patch: Record<string, unknown> = { status: NEXT_STATUS[action] };
    if (action === "publish") patch.published_at = article.published_at ?? new Date().toISOString();
    const updated = await store.update("articles", id, patch);

    const wasPublic = article.status === "published";
    if (action === "publish" || wasPublic) refreshPublicBlog(article.slug);

    const label = { review: "enviado para revisão", approve: "aprovado", publish: wasPublic ? "atualizado no site" : "publicado no site", unpublish: "retirado do site", archive: "arquivado", restore: "restaurado como rascunho" }[action];
    await logActivity("articles", id, action, `Artigo "${article.title}" ${label}`, session);
    return Response.json({ data: updated, publicUrl: action === "publish" ? `/blog/${article.slug}` : null });
  } catch (error) {
    return errorResponse(error);
  }
}
