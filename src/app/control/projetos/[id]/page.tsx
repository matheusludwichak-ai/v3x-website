import { ProjectDetail } from "@/components/control/Projects";

export const metadata = { title: "Projeto · V3X Control" };

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProjectDetail id={id} />;
}
