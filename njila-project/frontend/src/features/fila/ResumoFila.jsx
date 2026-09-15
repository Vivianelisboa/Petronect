import { useTranslation } from "react-i18next";
import { cn } from "../../lib/cn";

const TOM = {
  danger: "text-red-600",
  neutral: "text-ink-900",
  info: "text-sky-700",
  brand: "text-brand-600",
};

/**
 * Estatísticas em linha horizontal — sem caixas, sem bordas.
 * Design de dashboard: números grandes, rótulos pequenos, barra integrada.
 */
export function ResumoFila({ contagens, total, ativo, onSelecionar }) {
  const { t } = useTranslation();

  const itens = [
    { id: "criticos", valor: contagens.criticos, rotulo: t("fila.resumo.criticos"), tom: "danger" },
    { id: "pendente", valor: contagens.pendente, rotulo: t("fila.resumo.pendente"), tom: "neutral" },
    { id: "em_atendimento", valor: contagens.em_atendimento, rotulo: t("fila.resumo.em_atendimento"), tom: "info" },
    { id: "resolvido", valor: contagens.resolvido, rotulo: t("fila.resumo.resolvido"), tom: "brand" },
  ];

  const concluidas = contagens.resolvido;
  const percentual = total > 0 ? Math.round((concluidas / total) * 100) : 100;

  return (
    <div className="space-y-3">
      <div className="flex items-end gap-8">
        {itens.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelecionar(item.id)}
            aria-pressed={ativo === item.id}
            className={cn(
              "group text-left transition-all",
              ativo === item.id ? "opacity-100" : "opacity-60 hover:opacity-100"
            )}
          >
            <span className={cn("block text-4xl font-bold tabular-nums leading-none tracking-tight", TOM[item.tom])}>
              {item.valor}
            </span>
            <span className="mt-1.5 block text-[11px] font-semibold uppercase tracking-wider text-ink-500">
              {item.rotulo}
            </span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-100">
          <div
            className="h-full rounded-full bg-brand-500 transition-all duration-700 ease-out"
            style={{ width: `${percentual}%` }}
          />
        </div>
        <span className="text-xs font-medium tabular-nums text-ink-500">
          {concluidas}/{total}
        </span>
      </div>
    </div>
  );
}
