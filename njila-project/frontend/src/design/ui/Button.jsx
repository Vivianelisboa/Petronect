import { cn } from "../../lib/cn";

const VARIANTES = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 focus-visible:ring-brand-500",
  secondary: "border border-ink-200 bg-white text-ink-700 hover:bg-ink-50 focus-visible:ring-ink-400",
  ghost: "text-ink-600 hover:bg-ink-50 focus-visible:ring-ink-300",
  danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
};

const TAMANHOS = {
  sm: "px-2.5 py-1 text-xs",
  md: "px-3.5 py-2 text-sm",
  lg: "px-4 py-2.5 text-base",
};

const BASE =
  "inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 " +
  "disabled:pointer-events-none disabled:opacity-50";

/**
 * Botão padrão do design system. Use `variant` para a intenção e `size`
 * para a escala. Aceita `as` para renderizar como outro elemento (ex: link).
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
