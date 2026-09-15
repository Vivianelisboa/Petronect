import { cn } from "../../lib/cn";

const VARIANTES = {
  neutral: "bg-slate-100 text-slate-600",
  info: "bg-sky-100 text-sky-700",
  success: "bg-leaf-100 text-leaf-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-red-100 text-red-600",
  accent: "bg-pink-100 text-pink-700",
};

/**
 * Bloco de ícone com a cor semântica — a linguagem de "card de ícone" do
 * Portal Petronect. `icon` recebe um componente de ícone (lucide-react).
 */
export function IconTile({ icon: Icon, variant = "neutral", size = 18, className }) {
  return (
    <span
      className={cn(
        "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
        VARIANTES[variant],
        className
      )}
    >
      {Icon ? <Icon size={size} /> : null}
    </span>
  );
}
