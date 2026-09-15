import { useTranslation } from "react-i18next";
import { cn } from "../../lib/cn";

const TOM = {
  danger: "text-red-600",
  neutral: "text-ink-900",
  info: "text-sky-700",
  brand: "text-brand-700",
};

/**
 * Painel do dia: estatísticas filtráveis e meta de progresso.
 * Design refinado: fundo neutro, números em destaque, barra discreta.
 */
export function ResumoFila({ contagens, total, ativo, onSelecionar }) {
  const { t } = useTranslation();

  const itens = [
    { id: "criticos", valor: contagens.criticos, rotulo: t("fila.resumo.criticos"), tom: "danger" },
    { id: "pendente", valor: contagens.pendente, rotulo: t("fila.resumo.pendente"), tom: "neutral" },
    {
      id: "em_atendimento",
      valor: contagens.em_atendimento,
      rotulo: t("fila.resumo.em_atendimento"),
      tom: "info",
    },
    { id: "resolvido", valor: contagens.resolvido, rotulo: t("fila.resumo.resolvido"), tom: "brand" },
  ];

  const concluidas = contagens.resolvido;
  const percentual = total > 0 ? Math.round((concluidas / total) * 100) : 100;

  return (
    <div className="rounded-xl border border-ink-200 bg-surface-50 p-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {itens.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelecionar(item.id)}
            aria-pressed={ativo === item.id}
            className={cn(
              "rounded-lg px-4 py-3 text-left transition",
              ativo === item.id ? "bg-white shadow-sm ring-1 ring-ink-200" : "hover:bg-white/80"
            )}
          >
            <span className={cn("block text-3xl font-bold tabular-nums leading-none", TOM[item.tom])}>
              {item.valor}
            </span>
            <span className="mt-1.5 block text-xs leading-tight text-ink-500">{item.rotulo}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3 px-2">
        <span className="shrink-0 text-xs font-medium text-ink-500">{t("fila.meta")}</span>
        <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-200">
          <span
            className="block h-full rounded-full bg-brand-500 transition-all duration-500"
            style={{ width: `${percentual}%` }}
          />
        </span>
        <span className="shrink-0 text-xs font-semibold tabular-nums text-ink-700">
          {concluidas}/{total}
        </span>
      </div>
    </div>
  );
}
