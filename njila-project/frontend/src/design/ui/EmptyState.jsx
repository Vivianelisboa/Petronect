import { cn } from "../../lib/cn";

/**
 * Estado vazio padrão: ícone + título + descrição, com ação opcional.
 */
export function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div className={cn("flex flex-col items-center gap-3 px-6 py-12 text-center", className)}>
      {Icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-100 text-ink-400">
          <Icon size={22} />
        </div>
      )}
      {title && <p className="text-sm font-semibold text-ink-800">{title}</p>}
      {description && <p className="max-w-sm text-sm text-ink-500 leading-relaxed">{description}</p>}
      {action}
    </div>
  );
}
