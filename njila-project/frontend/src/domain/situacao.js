/**
 * domain/situacao.js
 * Eixo OPERACIONAL: o que a equipe já fez com o caso. É distinto do
 * "momento" (domain/momentos.js), que é o diagnóstico da empresa.
 *
 * A situação é derivada do histórico de ações pelo backend — não existe
 * como coluna no banco. Aqui só mapeamos cada valor para rótulo e cor.
 */
export const SITUACOES = {
  pendente: { i18nKey: "situacao.pendente", variante: "warning" },
  em_atendimento: { i18nKey: "situacao.em_atendimento", variante: "info" },
  adiado: { i18nKey: "situacao.adiado", variante: "neutral" },
  resolvido: { i18nKey: "situacao.resolvido", variante: "success" },
};

/** Situações usadas como segmentos de triagem, na ordem em que aparecem. */
export const SITUACOES_TRIAGEM = Object.keys(SITUACOES);

export function getSituacao(situacao) {
  return SITUACOES[situacao] || { i18nKey: null, variante: "neutral" };
}
