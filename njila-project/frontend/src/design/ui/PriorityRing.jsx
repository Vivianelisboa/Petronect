import { useTranslation } from "react-i18next";
import { getFaixaPrioridade } from "./priority";

const CORES = {
  danger: "#ef4444",
  warning: "#f59e0b",
  info: "#0ea5e9",
  neutral: "#94a3b8",
};

/**
 * Prioridade como anel: um único elemento visual carrega número, progresso e
 * banda — em vez de número + barra + rótulo. A banda fica acessível em
 * `aria-label`.
 */
export function PriorityRing({ score, size = 44, className }) {
  const { t } = useTranslation();
  const faixa = getFaixaPrioridade(score);
  const raio = (size - 6) / 2;
  const circunferencia = 2 * Math.PI * raio;
  const preenchido = (Math.min(score, 100) / 100) * circunferencia;
  const descricao = `${t("prioridade.rotulo")}: ${t(faixa.i18nKey)}, ${score}/100`;

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center ${className || ""}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={descricao}
      title={descricao}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={raio}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="4"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={raio}
          fill="none"
          stroke={CORES[faixa.variante]}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${preenchido} ${circunferencia}`}
        />
      </svg>
      <span className="absolute text-xs font-bold tabular-nums text-ink-900">{score}</span>
    </span>
  );
}
