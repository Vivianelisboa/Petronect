import { AlertTriangle, CheckCircle2, Clock, Headset, Layers3, PauseCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "../../lib/cn";

const VISOES = [
  { id: "todos", label: "Todos", icon: Layers3, tone: "neutral" },
  { id: "criticos", label: "Críticas", icon: AlertTriangle, tone: "danger" },
  { id: "pendente", label: "1ª ação", icon: Clock, tone: "warning" },
  { id: "em_atendimento", label: "Atendimento", icon: Headset, tone: "info" },
  { id: "adiado", label: "Adiado", icon: PauseCircle, tone: "neutral" },
  { id: "resolvido", label: "Concluídas", icon: CheckCircle2, tone: "success" },
];

const TONS = {
  neutral: "text-ink-500",
  danger: "text-red-600",
  warning: "text-amber-600",
  info: "text-sky-600",
  success: "text-brand-600",
};

/**
 * Uma única régua de visões da Central. Os números filtram a lista;
 * a barra abaixo comunica somente o progresso geral da operação.
 */
export function ResumoFila({ contagens, total, ativo, onSelecionar }) {
  const { t } = useTranslation();
  const concluidas = contagens.resolvido;
  const percentual = total > 0 ? Math.round((concluidas / total) * 100) : 100;

  function valorDaVisao(id) {
    if (id === "todos") return total;
    if (id === "criticos") return contagens.criticos;
    return contagens[id] || 0;
  }

  return (
    <section className="rounded-2xl bg-white p-2 shadow-sm ring-1 ring-ink-100">
      <div className="grid grid-cols-2 gap-1 sm:flex sm:gap-1 sm:overflow-x-auto">
        {VISOES.map((visao) => {
          const Icone = visao.icon;
          const selecionada = ativo === visao.id;
          const tom = TONS[visao.tone];

          return (
            <button
              key={visao.id}
              onClick={() => onSelecionar(visao.id)}
              aria-pressed={selecionada}
              className={cn(
                "flex min-w-0 items-center justify-center gap-2 rounded-xl px-2 py-3 text-center transition-all sm:min-w-[104px] sm:flex-1 sm:justify-start sm:px-3 sm:text-left",
                selecionada ? "bg-brand-50 text-brand-900 ring-1 ring-brand-200" : "hover:bg-surface-50"
              )}
            >
              <Icone size={17} className={selecionada ? "text-brand-700" : tom} strokeWidth={2.2} />
              <span className="min-w-0">
                <span className={cn("font-display block text-xl font-normal tabular-nums leading-none", selecionada ? "text-brand-800" : tom)}>
                  {valorDaVisao(visao.id)}
                </span>
                <span className={cn("mt-1 block truncate text-[10px] font-bold uppercase tracking-wider", selecionada ? "text-brand-700" : "text-ink-400")}>
                  {visao.label}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-2 flex items-center gap-3 border-t border-ink-100 px-3 pt-3">
        <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-ink-400">
          {t("fila.meta")}
        </span>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-100">
          <div
            className="h-full rounded-full bg-brand-500 transition-all duration-700 ease-out"
            style={{ width: `${percentual}%` }}
          />
        </div>
        <span className="font-display shrink-0 text-sm font-normal tabular-nums text-ink-700">
          {concluidas}/{total}
        </span>
      </div>
    </section>
  );
}
