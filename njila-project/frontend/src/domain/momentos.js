/**
 * domain/momentos.js
 * Os 6 estados oficiais da jornada do fornecedor (MVP). Fonte única de
 * verdade: cada momento sabe sua chave de tradução e a cor semântica que
 * o representa. Nenhum componente deve duplicar esse mapa.
 *
 * `i18nKey` aponta para `src/locales/pt-BR.json`; `variante` é uma das
 * variantes semânticas do componente `Badge` (design/ui/Badge.jsx).
 */
export const MOMENTOS = {
  chegou_perdeu: { i18nKey: "momento.chegou_perdeu", variante: "neutral" },
  parou_cadastro: { i18nKey: "momento.parou_cadastro", variante: "warning" },
  quis_participar_travou: { i18nKey: "momento.quis_participar_travou", variante: "warning" },
  era_ativa_sumiu: { i18nKey: "momento.era_ativa_sumiu", variante: "danger" },
  oportunidade_quente: { i18nKey: "momento.oportunidade_quente", variante: "accent" },
  jornada_concluida: { i18nKey: "momento.jornada_concluida", variante: "success" },
};

/** Momentos que fazem sentido filtrar (jornada concluída não é pendência). */
export const MOMENTOS_FILTRAVEIS = Object.keys(MOMENTOS).filter(
  (momento) => momento !== "jornada_concluida"
);

/** Busca tolerante: momentos desconhecidos não quebram a tela. */
export function getMomento(momento) {
  return MOMENTOS[momento] || { i18nKey: null, variante: "neutral" };
}
