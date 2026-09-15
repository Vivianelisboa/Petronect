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

/** Canal padrão usado nas ações rápidas do protótipo. */
export const CANAL_PADRAO = "email";
