import { cn } from "@/lib/utils";

/** Supplied V3X wordmark, vectorized from the official artwork — scales losslessly at any size. */
export function Logo({ className, tagline = false }: { className?: string; tagline?: boolean }) {
  return (
    <span className={cn("inline-flex w-[3em] flex-col leading-none", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/wordmark.svg"
        alt="V3X"
        className="block h-auto w-full min-w-0"
        width={1013}
        height={263}
      />
      {tagline && <span className="label-mono mt-1 text-[0.5rem]">Digital Product Studio</span>}
    </span>
  );
}
