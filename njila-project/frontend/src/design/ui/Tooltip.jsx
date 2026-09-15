import { useId } from "react";
import { cn } from "../../lib/cn";

/** Tooltip discreto para contexto secundário sem poluir o card. */
export function Tooltip({ label, children, className }) {
  const id = useId();

  return (
    <span className={cn("group relative inline-flex", className)}>
      <span
        tabIndex={0}
        aria-describedby={id}
        className="inline-flex cursor-help rounded-full outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
      >
        {children}
      </span>
      <span
        id={id}
        role="tooltip"
        className="pointer-events-none invisible absolute bottom-full left-1/2 z-30 mb-2 w-64 -translate-x-1/2 rounded-lg bg-ink-900 px-3 py-2 text-left text-xs font-normal leading-relaxed text-white opacity-0 shadow-lg transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
      >
        {label}
      </span>
    </span>
  );
}
