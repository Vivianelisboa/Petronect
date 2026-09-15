import { useTranslation } from "react-i18next";
import { Badge } from "./Badge";

const FAIXAS = [
  { min: 80, variante: "danger", i18nKey: "prioridade.critico" },
  { min: 60, variante: "warning", i18nKey: "prioridade.atencao" },
  { min: 40, variante: "info", i18nKey: "prioridade.acompanhar" },
  { min: 0, variante: "neutral", i18nKey: "prioridade.estavel" },
];

/** Banda de prioridade associada a um score (0–100). */
export function getFaixaPrioridade(score) {
  return FAIXAS.find((faixa) => score >= faixa.min);
}

/**
 * Prioridade do caso: o número colorido pela banda, com a banda acessível em
 * `title`/`aria-label`. O termo "score" fica reservado à explicação.
 */
export function PriorityBadge({ score, className }) {
  const { t } = useTranslation();
  const faixa = getFaixaPrioridade(score);
  const rotulo = t(faixa.i18nKey);
  const descricao = `${t("prioridade.rotulo")}: ${rotulo}, ${score}/100`;

  return (
    <Badge variant={faixa.variante} className={className} title={descricao} aria-label={descricao}>
      {score}/100
    </Badge>
  );
}
