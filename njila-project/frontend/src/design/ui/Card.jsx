import { cn } from "../../lib/cn";

/** Superfície elevada padrão (borda + sombra suave). */
export function Card({ className, ...props }) {
  return (
    <div
      className={cn("rounded-xl border border-slate-200 bg-white shadow-card", className)}
      {...props}
    />
  );
}

/** Faixa de título de um Card. */
export function CardHeader({ className, ...props }) {
  return (
    <div
      className={cn("border-b border-slate-100 px-4 py-3 text-sm font-semibold text-ink-700", className)}
      {...props}
    />
  );
}

/** Área de conteúdo de um Card. */
export function CardBody({ className, ...props }) {
  return <div className={cn("p-4", className)} {...props} />;
}
