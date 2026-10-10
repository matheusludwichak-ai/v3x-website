import { Suspense } from "react";
import { Tasks } from "@/components/control/Tasks";

export const metadata = { title: "Tarefas · V3X Control" };

export default function TasksPage() {
  return (
    <Suspense>
      <Tasks />
    </Suspense>
  );
}
