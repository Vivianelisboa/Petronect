import { cn } from "../../lib/cn";

const BASE =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-ink-800 " +
  "focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500";

/** Campo de seleção nativo, com a aparência padronizada do design system. */
export function Select({ className, children, ...props }) {
  return (
    <select className={cn(BASE, className)} {...props}>
      {children}
    </select>
  );
}
