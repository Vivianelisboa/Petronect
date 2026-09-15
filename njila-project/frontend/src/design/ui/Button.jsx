import { cn } from "../../lib/cn";

const VARIANTES = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 focus-visible:ring-brand-500",
  secondary: "border border-ink-200 bg-white text-ink-700 hover:bg-surface-50 focus-visible:ring-ink-400",
  ghost: "text-ink-600 hover:bg-surface-50 focus-visible:ring-ink-300",
  danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
};

const TAMANHOS = {
  sm: "px-3 py-1.5 text-[13px]",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
};

const BASE =
  "inline-flex items-center justify-center gap-1.5 rounded-lg font-display font-normal tracking-[-0.01em] transition-colors " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 " +
  "disabled:pointer-events-none disabled:opacity-50";

/**
 * Botão padrão do design system. Use `variant` para a intenção e `size`
 * para a escala.
 */
export function Button({
  variant = "primary",
  size = "md",
  className,
  as: Component = "button",
  ...props
}) {
  return (
    <Component
      className={cn(BASE, VARIANTES[variant], TAMANHOS[size], className)}
      {...props}
    />
  );
}
