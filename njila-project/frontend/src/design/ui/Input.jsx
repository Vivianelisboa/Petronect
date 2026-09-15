import { cn } from "../../lib/cn";

const BASE =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-ink-800 " +
  "placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500";

/** Campo de texto padrão do design system. */
export function Input({ className, ...props }) {
  return <input className={cn(BASE, className)} {...props} />;
}
