import { useTranslation } from "react-i18next";
import { cn } from "../../lib/cn";
import { getFaixaPrioridade } from "./PriorityBadge";

const BARRA = {
  danger: "bg-red-500",
  warning: "bg-amber-500",
  info: "bg-sky-500",
  neutral: "bg-slate-300",
};

const TEXTO = {
  danger: "text-red-600",
  warning: "text-amber-600",
  info: "text-sky-700",
  neutral: "text-slate-500",
};

/**
 * Prioridade como medida: o número, uma barra 0–100 e a banda.
 * Explica a prioridade melhor do que um selo isolado.
 */
export function PriorityMeter({ score, className }) {
  const { t } = useTranslation();
  const faixa = getFaixaPrioridade(score);
  const descricao = `${t("prioridade.rotulo")}: ${t(faixa.i18nKey)}, ${score}/100`;

  return (
    <div className={cn("flex items-center gap-3", className)} aria-label={descricao}>
      <span className="text-xl font-bold tabular-nums text-ink-900">{score}</span>
      <span className="h-1.5 w-28 overflow-hidden rounded-full bg-ink-100 sm:w-40">
        <span
          className={cn("block h-full rounded-full", BARRA[faixa.variante])}
          style={{ width: `${Math.min(score, 100)}%` }}
        />
      </span>
      <span className={cn("text-xs font-medium", TEXTO[faixa.variante])}>{t(faixa.i18nKey)}</span>
    </div>
  );
}
