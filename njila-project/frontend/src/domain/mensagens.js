/**
 * domain/mensagens.js
 * Modelos de mensagem por ação e momento da jornada. Dão contexto ao envio:
 * em vez de registrar o rótulo da ação, o time parte de uma comunicação
 * pronta e ajusta antes de enviar.
 */

const MENSAGEM_POR_MOMENTO = {
  chegou_perdeu: "mensagem.chegou_perdeu",
  parou_cadastro: "mensagem.parou_cadastro",
  quis_participar_travou: "mensagem.quis_participar_travou",
  era_ativa_sumiu: "mensagem.era_ativa_sumiu",
  oportunidade_quente: "mensagem.oportunidade_quente",
  jornada_concluida: "mensagem.jornada_concluida",
};

const TUTORIAL_POR_MOMENTO = {
  chegou_perdeu: "tutorial.chegou_perdeu",
  parou_cadastro: "tutorial.parou_cadastro",
  quis_participar_travou: "tutorial.quis_participar_travou",
  era_ativa_sumiu: "tutorial.era_ativa_sumiu",
  oportunidade_quente: "tutorial.oportunidade_quente",
  jornada_concluida: "tutorial.jornada_concluida",
};

/** Ações que enviam conteúdo e por isso passam pelo compositor. */
export const ACOES_COM_MENSAGEM = ["enviar_mensagem", "enviar_tutorial"];

/**
 * Chave i18n do modelo de mensagem para a ação e o momento. Devolve `null`
 * quando a ação não envia texto (aí a ficha registra a ação direto).
 */
export function modeloDeMensagem(tipoAcao, momento) {
  if (tipoAcao === "enviar_mensagem") return MENSAGEM_POR_MOMENTO[momento] || null;
  if (tipoAcao === "enviar_tutorial") return TUTORIAL_POR_MOMENTO[momento] || null;
  return null;
}
