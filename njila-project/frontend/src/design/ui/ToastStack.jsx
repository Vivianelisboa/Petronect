import { CheckCircle2 } from "lucide-react";

/**
 * Pilha de toasts (canto inferior direito). Confirmações discretas de ação —
 * o feedback "sutil" escolhido para o painel.
 */
export function ToastStack({ toasts }) {
  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex items-center gap-2 rounded-lg bg-ink-900 px-4 py-2.5 text-sm text-white shadow-lg"
        >
          <CheckCircle2 size={15} className="shrink-0 text-leaf-400" />
          {toast.texto}
        </div>
      ))}
    </div>
  );
}
