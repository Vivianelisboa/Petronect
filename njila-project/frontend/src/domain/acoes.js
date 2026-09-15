/**
 * domain/acoes.js
 * Tipos de intervenção que o time de Marketing/Atendimento pode registrar
 * numa empresa. Centralizado para que Fila, Ficha e Assistente usem
 * exatamente os mesmos identificadores e rótulos.
 */
export const ACOES = {
  enviar_mensagem: "acao.enviar_mensagem",
  enviar_tutorial: "acao.enviar_tutorial",
  encaminhar_atendimento: "acao.encaminhar_atendimento",
  marcar_resolvido: "acao.marcar_resolvido",
};

/** Ações disponíveis na ficha da empresa, na ordem em que aparecem. */
export const ACOES_FICHA = Object.keys(ACOES);

/** Canal padrão usado nas ações rápidas do protótipo. */
export const CANAL_PADRAO = "email";
