/**
 * domain/acoes.js
 * Tipos de intervenção que o time de Marketing/Atendimento pode registrar
 * numa empresa. Centralizado para que Fila, Ficha e Assistente usem
 * exatamente os mesmos identificadores e rótulos.
 *
 * `adiar` não é uma resolução — tira o caso da fila e o traz de volta
 * depois. Por isso a Situação derivada o trata como um estado à parte.
 */
export const ACOES = {
  enviar_mensagem: "acao.enviar_mensagem",
  enviar_tutorial: "acao.enviar_tutorial",
  encaminhar_atendimento: "acao.encaminhar_atendimento",
  marcar_resolvido: "acao.marcar_resolvido",
  adiar: "acao.adiar",
};

/** Ações disponíveis na ficha da empresa, na ordem em que aparecem. */
export const ACOES_FICHA = [
  "enviar_mensagem",
  "enviar_tutorial",
  "encaminhar_atendimento",
  "marcar_resolvido",
];

/** Ações disponíveis no menu do card da Fila, na ordem em que aparecem. */
export const ACOES_FILA = [
  "enviar_mensagem",
  "enviar_tutorial",
  "encaminhar_atendimento",
  "marcar_resolvido",
  "adiar",
];

/**
 * Ação primária (o botão de destaque do card) por momento da jornada.
 * É a recomendação que o motor de regras já descreve em `acao_recomendada`.
 */
const ACAO_PRIMARIA_POR_MOMENTO = {
  chegou_perdeu: "enviar_tutorial",
  parou_cadastro: "enviar_tutorial",
  quis_participar_travou: "encaminhar_atendimento",
  era_ativa_sumiu: "enviar_mensagem",
  oportunidade_quente: "enviar_mensagem",
};

export function acaoPrimaria(momento) {
  return ACAO_PRIMARIA_POR_MOMENTO[momento] || null;
}

/** Situação resultante de cada ação — usada para atualizar o card de imediato. */
export const SITUACAO_POR_ACAO = {
  enviar_mensagem: "em_atendimento",
  enviar_tutorial: "em_atendimento",
  encaminhar_atendimento: "em_atendimento",
  marcar_resolvido: "resolvido",
  adiar: "adiado",
};

/** Canal padrão usado nas ações rápidas do protótipo. */
export const CANAL_PADRAO = "email";
