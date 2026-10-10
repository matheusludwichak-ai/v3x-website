import { BlogEditor } from "@/components/control/BlogEditor";

export const metadata = { title: "Editar artigo · V3X Control" };

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BlogEditor id={id} />;
}
