import { useId } from "react";
import { cn } from "../../lib/cn";

/** Tooltip discreto para contexto secundário sem poluir o card. */
export function Tooltip({ label, children, className }) {
  const id = useId();

  return (
    <span className={cn("group/tooltip relative inline-flex", className)}>
      <span
        tabIndex={0}
        aria-label={label}
        aria-describedby={id}
        title={label}
        className="inline-flex min-h-8 min-w-8 cursor-help items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
      >
        {children}
      </span>
      <span
        id={id}
        role="tooltip"
        className="pointer-events-none invisible absolute left-1/2 top-full z-50 mt-2 w-64 -translate-x-1/2 rounded-lg bg-ink-900 px-3 py-2 text-left text-xs font-normal leading-relaxed text-white opacity-0 shadow-lg transition-opacity group-hover/tooltip:visible group-hover/tooltip:opacity-100 group-focus-within/tooltip:visible group-focus-within/tooltip:opacity-100"
      >
        {label}
      </span>
    </span>
  );
}
