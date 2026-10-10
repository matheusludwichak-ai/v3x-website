import { guard, isResponse } from "@/lib/control/guard";
import { getAllPosts } from "@/lib/posts";

/** Articles already live on the public site (MDX files + published Control articles), read-only. */
export async function GET() {
  const session = await guard("read");
  if (isResponse(session)) return session;
  const posts = await getAllPosts();
  return Response.json({ data: posts.map((p) => ({ slug: p.slug, title: p.title, date: p.date, category: p.category, source: p.source })) });
}
