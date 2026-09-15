/**
 * domain/jornada.js
 * As etapas do caminho do fornecedor no Portal (o significado de "njila").
 * A MiniJornada usa isso para desenhar a trilha e marcar onde a empresa parou.
 *
 * A Fila ainda não recebe a etapa exata (ela viria dos eventos), então por ora
 * derivamos do `momento`. Quando o backend expuser a etapa real, só esta função
 * muda — o resto da UI continua igual.
 */
export const ETAPAS = [
  { id: "acessou", i18nKey: "jornada.acessou" },
  { id: "buscou", i18nKey: "jornada.buscou" },
  { id: "abriu", i18nKey: "jornada.abriu" },
  { id: "cadastro", i18nKey: "jornada.cadastro" },
  { id: "taxa", i18nKey: "jornada.taxa" },
  { id: "concluiu", i18nKey: "jornada.concluiu" },
];

const ETAPA_POR_MOMENTO = {
  chegou_perdeu: "acessou",
  oportunidade_quente: "abriu",
  parou_cadastro: "cadastro",
  quis_participar_travou: "taxa",
  // A empresa já demonstrou engajamento; o último ponto observável é a abertura.
  era_ativa_sumiu: "abriu",
  jornada_concluida: "concluiu",
};

export function etapaAtual(momento) {
  return ETAPA_POR_MOMENTO[momento] || null;
}

export function indiceEtapa(etapaId) {
  return ETAPAS.findIndex((etapa) => etapa.id === etapaId);
}
