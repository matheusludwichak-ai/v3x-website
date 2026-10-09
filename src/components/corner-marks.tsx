export function CornerMarks({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-6 md:inset-10 ${className}`} aria-hidden="true">
      <span className="corner-mark absolute left-0 top-0" />
      <span className="corner-mark absolute right-0 top-0" />
      <span className="corner-mark absolute bottom-0 left-0" />
      <span className="corner-mark absolute bottom-0 right-0" />
    </div>
  );
}
