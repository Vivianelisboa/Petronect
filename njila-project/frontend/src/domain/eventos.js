/**
 * domain/eventos.js
 * Tradução dos eventos de navegação e das páginas do Portal, além dos canais
 * de intervenção. Mantém a Ficha legível: nenhum valor técnico do banco deve
 * chegar cru à tela.
 */

/** Ação observada na jornada do fornecedor. */
export const EVENTOS = {
  acessou_pagina_inicial: "evento.acessou_pagina_inicial",
  buscou_oportunidades: "evento.buscou_oportunidades",
  iniciou_cadastro: "evento.iniciou_cadastro",
  abriu_oportunidade: "evento.abriu_oportunidade",
  demonstrou_interesse: "evento.demonstrou_interesse",
  iniciou_pagamento_taxa: "evento.iniciou_pagamento_taxa",
  retornou_portal: "evento.retornou_portal",
  concluiu_acao: "evento.concluiu_acao",
};

/** Página do Portal em que o evento ocorreu. */
export const PAGINAS = {
  pagina_inicial: "pagina.pagina_inicial",
  oportunidades: "pagina.oportunidades",
  detalhe_oportunidade: "pagina.detalhe_oportunidade",
  cadastro_fornecedor: "pagina.cadastro_fornecedor",
  pagamento_taxa: "pagina.pagamento_taxa",
  meus_processos: "pagina.meus_processos",
  tutorial: "pagina.tutorial",
  suporte: "pagina.suporte",
};

/** Canal por onde a intervenção foi feita. */
export const CANAIS = {
  assistente_portal: "canal.assistente_portal",
  email: "canal.email",
  telefone: "canal.telefone",
};

/** Canais oferecidos no compositor, na ordem em que aparecem. */
export const CANAIS_ENVIO = ["assistente_portal", "email", "telefone"];

/** Canal sugerido por padrão — a tese do produto é a Paola, no Portal. */
export const CANAL_PADRAO_ENVIO = "assistente_portal";

export function getEvento(acao) {
  return EVENTOS[acao] || null;
}

export function getPagina(pagina) {
  return PAGINAS[pagina] || null;
}

export function getCanal(canal) {
  return CANAIS[canal] || null;
}

/**
 * Marcos da jornada: eventos que mudam a leitura da situação e por isso
 * ganham destaque na linha do tempo.
 */
export const EVENTOS_MARCO = new Set([
  "iniciou_cadastro",
  "demonstrou_interesse",
  "iniciou_pagamento_taxa",
  "concluiu_acao",
]);
