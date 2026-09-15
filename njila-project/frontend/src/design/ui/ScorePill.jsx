import { Badge } from "./Badge";

/**
 * Score de prioridade (0–100). Quanto maior, mais urgente a atenção.
 * A cor comunica a faixa sem depender de leitura do número.
 */
export function ScorePill({ score, className }) {
  const variant = score >= 80 ? "danger" : score >= 60 ? "warning" : score >= 40 ? "info" : "neutral";
  return (
    <Badge variant={variant} className={className}>
      {score}/100
    </Badge>
  );
}
