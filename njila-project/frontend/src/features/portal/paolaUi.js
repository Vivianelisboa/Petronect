/**
 * features/portal/paolaUi.js
 * Lógica pura da Paola no Portal do fornecedor — saudação contextual por
 * perfil e respostas de contingência (fallback offline). Funções sem estado
 * e sem React: fáceis de testar e de manter.
 */

const ACOES_FORNECEDOR = [
  "Continuar cotação",
  "Ver pendências",
  "Falar com Atendimento",
  "Agora não",
];

export function saudacaoPorPerfil(perfil) {
  if (perfil === "fornecedor") {
    return {
      texto:
        "Olá! Eu sou a Paola. Vi que a cotação “Válvulas industriais” ficou em andamento há 2 dias. Quer retomar agora?",
      acoes: ACOES_FORNECEDOR,
    };
  }

  if (perfil === "cliente") {
    return {
      texto:
        "Olá! Eu sou a Paola. Posso acompanhar seus pedidos e tirar dúvidas sobre contratos e pagamentos.",
      acoes: [],
    };
  }

  if (perfil === "novo") {
    return {
      texto:
        "Olá! Eu sou a Paola. Posso orientar seu cadastro no portal e mostrar como começar sua jornada.",
      acoes: [],
    };
  }

  return {
    texto: "Olá! Eu sou a Paola, assistente virtual do Portal Petronect. Como posso ajudar?",
    acoes: [],
  };
}

const FALLBACKS = [
  {
    palavras: ["cadast"],
    resposta: "Posso mostrar o cadastro e indicar quais informações ainda faltam.",
  },
  {
    palavras: ["oportun", "cota", "propost"],
    resposta:
      "Você pode consultar oportunidades abertas, ver os prazos e retomar uma cotação em andamento.",
  },
  {
    palavras: ["pag", "taxa"],
    resposta: "A etapa de pagamento fica dentro da oportunidade. Posso levar você até ela.",
  },
  {
    palavras: ["atendimento", "pessoa"],
    resposta: "Posso encaminhar você ao Atendimento com o contexto da sua jornada.",
  },
];

const RESPOSTA_GENERICA =
  "Posso ajudar com cadastro, oportunidades, propostas, pagamentos ou Atendimento.";

export function responderOffline(pergunta) {
  const normalizada = pergunta.toLowerCase();
  const encontrada = FALLBACKS.find(({ palavras }) =>
    palavras.some((palavra) => normalizada.includes(palavra))
  );
  return encontrada ? encontrada.resposta : RESPOSTA_GENERICA;
}
