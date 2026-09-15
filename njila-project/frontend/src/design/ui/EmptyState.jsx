import { cn } from "../../lib/cn";

/**
 * Estado vazio padrão: ícone + título + descrição, com ação opcional.
 * `icon` recebe um componente de ícone (ex: do lucide-react).
 */
export function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div className={cn("flex flex-col items-center gap-2 px-6 py-10 text-center", className)}>
      {Icon && (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <Icon size={20} />
        </div>
      )}
      {title && <p className="text-sm font-medium text-ink-700">{title}</p>}
      {description && <p className="max-w-sm text-sm text-slate-500">{description}</p>}
      {action}
    </div>
  );
}
