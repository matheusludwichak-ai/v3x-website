import { cn } from "@/lib/utils";

/** Official V3X wordmark (2040x540 artwork, transparent background, for dark surfaces). */
export function Logo({ className, tagline = false }: { className?: string; tagline?: boolean }) {
  return (
    <span className={cn("inline-flex w-[3em] flex-col leading-none", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/v3x-logo.png"
        alt="V3X"
        className="block h-auto w-full min-w-0"
        width={2040}
        height={540}
        decoding="async"
      />
      {tagline && (
        <span className="mt-[0.9em] whitespace-nowrap font-display text-[0.62em] font-semibold uppercase tracking-[0.42em] text-foreground/90">
          Digital Product Studio
        </span>
      )}
    </span>
  );
}
