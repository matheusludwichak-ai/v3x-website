import type { ProjectStatus } from "@/data/projects";

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span className="eyebrow inline-flex items-center rounded-full border border-ink/0 bg-ink px-3 py-1 text-on-ink">
      {status}
    </span>
  );
}
