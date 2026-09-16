/**
 * design/ui/priority.js
 * Bandas de prioridade (0–100). Quanto maior, mais urgente a atenção.
 * Compartilhado entre os componentes que exibem prioridade.
 */
export const FAIXAS = [
  { min: 80, variante: "danger", i18nKey: "prioridade.critico" },
  { min: 60, variante: "warning", i18nKey: "prioridade.atencao" },
  { min: 40, variante: "info", i18nKey: "prioridade.acompanhar" },
  { min: 0, variante: "neutral", i18nKey: "prioridade.estavel" },
];

export function getFaixaPrioridade(score) {
  return FAIXAS.find((faixa) => score >= faixa.min);
}
