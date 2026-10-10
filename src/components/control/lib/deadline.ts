import type { Task } from "@/lib/control/schema";

/** Deadline buckets, relative to today (YYYY-MM-DD strings compare correctly). */
export function deadlineBuckets<T extends Pick<Task, "status" | "due_date">>(list: T[], now: string) {
  const end = new Date(`${now}T12:00:00`);
  end.setDate(end.getDate() + 7);
  const weekEnd = `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, "0")}-${String(end.getDate()).padStart(2, "0")}`;
  const open = list.filter((t) => t.status !== "done").sort((a, b) => (a.due_date ?? "9999").localeCompare(b.due_date ?? "9999"));
  return [
    { key: "late", label: "Atrasadas", tone: "text-[#f6a3af]", items: open.filter((t) => t.due_date && t.due_date < now) },
    { key: "today", label: "Hoje", tone: "text-[#9cc2ff]", items: open.filter((t) => t.due_date === now) },
    { key: "week", label: "Próximos 7 dias", tone: "text-white", items: open.filter((t) => t.due_date && t.due_date > now && t.due_date <= weekEnd) },
    { key: "later", label: "Depois", tone: "text-white", items: open.filter((t) => t.due_date && t.due_date > weekEnd) },
    { key: "none", label: "Sem prazo", tone: "text-[#a0a0a0]", items: open.filter((t) => !t.due_date) },
  ];
}
