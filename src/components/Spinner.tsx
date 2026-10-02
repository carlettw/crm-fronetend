export function Spinner({ label = "Yuklanmoqda" }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 text-muted" role="status" aria-live="polite">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-primary" />
      <span className="text-sm">{label}...</span>
    </div>
  );
}
