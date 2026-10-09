import type { ProjectStatus } from "@/data/projects";

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span className="inline-flex items-center gap-2.5 border border-white/15 bg-background/70 px-3.5 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] backdrop-blur">
      <i className="size-2 rounded-full bg-gradient-x" />
      {status}
    </span>
  );
}
