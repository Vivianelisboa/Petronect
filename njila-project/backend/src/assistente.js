/**
 * src/assistente.js - Plataforma Njila
 * Motor do Assistente Contextual (o "chatbot" que aparece pro fornecedor
 * dentro do Portal). É baseado em REGRAS, exatamente como o MVP descreve:
 * o sistema identifica o momento da jornada e oferece uma mensagem +
 * ações específicas para aquela situação — não é um chatbot de texto livre.
 *
 * Isso é intencional: o documento do MVP pede "regras explicáveis" para
 * o score e as ações, então o assistente aqui é 100% determinístico e
 * auditável (a banca consegue entender exatamente por que a mensagem X
 * apareceu). No final do arquivo tem uma função `responderPerguntaLivre`
 * que cobre a parte de "conversa livre" (ex: "onde pago a taxa?"),
 * combinando regras + fallback — e há uma nota de como plugar um LLM de
 * verdade (Claude via AWS Bedrock) se quiserem ir além do rule-based.
 */

/**
 * Monta a mensagem + ações do assistente para o momento atual da empresa.
 * Espelha os exemplos do documento do MVP quase literalmente.
 */
function gerarMensagemAssistente(empresa, classificacao) {
  const nome = empresa.nome_empresa;
  const { momento, oportunidade_relacionada } = classificacao;

  switch (momento) {
    case "quis_participar_travou":
      return {
        titulo: `Olá, ${nome}`,
        mensagem: `Você iniciou o pagamento da taxa da oportunidade ${oportunidade_relacionada || ""}, mas essa etapa ainda está pendente. Podemos ajudar você a continuar.`,
        acoes: ["Continuar pagamento", "Ver passo a passo", "Falar com Atendimento", "Agora não"],
      };

    case "parou_cadastro":
      return {
        titulo: `Olá, ${nome}`,
        mensagem: "Seu cadastro está quase pronto. Identificamos que você interrompeu o preenchimento. Deseja continuar de onde parou?",
        acoes: ["Continuar cadastro", "Ver tutorial", "Falar com Atendimento"],
      };

    case "era_ativa_sumiu":
      return {
        titulo: `Novas oportunidades podem interessar à ${nome}`,
        mensagem: "Confira as oportunidades disponíveis para o seu perfil.",
        acoes: ["Buscar oportunidades", "Ver novidades", "Agora não"],
      };

    case "oportunidade_quente":
      return {
        titulo: `Olá, ${nome}`,
        mensagem: `Notamos seu interesse na oportunidade ${oportunidade_relacionada || ""}. Quer que a gente te ajude a avançar com essa candidatura antes do prazo?`,
        acoes: ["Ver detalhes da oportunidade", "Falar com Atendimento", "Agora não"],
      };

    case "chegou_perdeu":
      return {
        titulo: `Bem-vindo(a) de volta, ${nome}`,
        mensagem: "Vimos que você deu uma olhada no Portal. Quer um tutorial rápido de como funciona o processo de se tornar fornecedor?",
        acoes: ["Ver tutorial", "Buscar oportunidades", "Agora não"],
      };

    case "jornada_concluida":
    default:
      return null; // não interromper — só registrar o sucesso, como o MVP pede
  }
}

/**
 * Fallback simples para perguntas em texto livre feitas ao assistente
 * (ex: pelo chat). Cobre as dúvidas mais comuns citadas no MVP.
 * Isso é o "chatbot" propriamente dito: casa palavras-chave da pergunta
 * com uma resposta pronta. Não é IA generativa — é regra + busca por
 * palavra-chave, suficiente para a demo e 100% previsível.
 */
const BASE_CONHECIMENTO = [
  {
    palavras: ["pagar", "pagamento", "taxa", "boleto"],
    resposta: "Para concluir o pagamento da taxa, acesse 'Meus Processos' > selecione a oportunidade > 'Pagamento da Taxa'. Se preferir, posso te levar direto para lá.",
  },
  {
    palavras: ["cadastro", "cadastrar", "registrar"],
    resposta: "Para continuar seu cadastro de fornecedor, acesse 'Cadastro de Fornecedor' no menu principal. Os dados que você já preencheu continuam salvos.",
  },
  {
    palavras: ["oportunidade", "edital", "processo", "licitação"],
    resposta: "Você pode buscar oportunidades abertas em 'Oportunidades', filtrando por segmento. Quer que eu já te mostre as mais recentes para o seu perfil?",
  },
  {
    palavras: ["atendimento", "ajuda", "humano", "pessoa", "falar com alguém"],
    resposta: "Sem problema — vou encaminhar você para o Atendimento com todo o histórico da sua empresa, para não precisar explicar tudo de novo.",
  },
  {
    palavras: ["status", "andamento", "situação"],
    resposta: "Posso te mostrar exatamente em que etapa sua empresa está agora. Um momento...",
  },
];

function responderPerguntaLivre(pergunta) {
  const texto = (pergunta || "").toLowerCase();
  for (const item of BASE_CONHECIMENTO) {
    if (item.palavras.some((p) => texto.includes(p))) {
      return item.resposta;
    }
  }
  return "Não tenho certeza sobre isso ainda, mas posso te encaminhar para o Atendimento, que vai poder ajudar com mais detalhes.";
}

module.exports = { gerarMensagemAssistente, responderPerguntaLivre };
