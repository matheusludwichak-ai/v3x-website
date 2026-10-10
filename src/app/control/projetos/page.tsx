import { Suspense } from "react";
import { ProjectsList } from "@/components/control/Projects";

export const metadata = { title: "Projetos · V3X Control" };

export default function ProjectsPage() {
  return (
    <Suspense>
      <ProjectsList />
    </Suspense>
  );
}
