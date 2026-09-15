import { cn } from "../../lib/cn";

/** Indicador de carregamento (spinner) com rótulo opcional. */
export function Spinner({ label, className }) {
  return (
    <div className={cn("flex items-center gap-2 text-sm text-slate-500", className)} role="status">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-brand-600" />
      {label && <span>{label}</span>}
    </div>
  );
}
