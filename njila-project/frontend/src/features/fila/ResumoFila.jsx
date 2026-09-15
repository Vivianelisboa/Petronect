import { useTranslation } from "react-i18next";
import { cn } from "../../lib/cn";

const TOM = {
  danger: "text-red-600",
  neutral: "text-ink-900",
  info: "text-sky-700",
  leaf: "text-leaf-700",
};

/**
 * Resumo da Fila: os números que dão o panorama do dia. Cada número é um
 * filtro — clicar leva a lista para aquele recorte (todo número leva a ação).
 */
export function ResumoFila({ contagens, ativo, onSelecionar }) {
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
    { id: "resolvido", valor: contagens.resolvido, rotulo: t("fila.resumo.resolvido"), tom: "leaf" },
  ];

  return (
    <div className="rounded-2xl bg-cream-400 p-3 sm:p-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {itens.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelecionar(item.id)}
            aria-pressed={ativo === item.id}
            className={cn(
              "rounded-xl px-4 py-3 text-left transition",
              ativo === item.id ? "bg-white shadow-card" : "hover:bg-white/60"
            )}
          >
            <span className={cn("block text-3xl font-bold tabular-nums leading-none", TOM[item.tom])}>
              {item.valor}
            </span>
            <span className="mt-1 block text-xs leading-tight text-ink-600">{item.rotulo}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
