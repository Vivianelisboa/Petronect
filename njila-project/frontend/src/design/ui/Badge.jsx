import { cn } from "../../lib/cn";

const VARIANTES = {
  neutral: "bg-surface-100 text-ink-700",
  info: "bg-sky-100 text-sky-800",
  success: "bg-brand-100 text-brand-800",
  warning: "bg-amber-100 text-amber-800",
  danger: "bg-red-100 text-red-800",
  accent: "bg-pink-100 text-pink-800",
};

/**
 * Etiqueta compacta de estado. As variantes são semânticas — o domínio
 * escolhe `info`/`warning`/etc. e nunca escreve classes do Tailwind.
 */
export function Badge({ variant = "neutral", className, children, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        VARIANTES[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
