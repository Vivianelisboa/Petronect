/**
 * handlers/chat.js
 * POST /chat
 * body: { "empresa_id": "E001" (opcional), "mensagem": "como eu pago a taxa?" }
 *
 * Endpoint de conversa livre do Assistente. Combina:
 *  1) contexto da empresa (se empresa_id for enviado) — personaliza a resposta
 *  2) base de conhecimento por palavra-chave (src/assistente.js)
 *
 * Nota: isso é um chatbot baseado em regras (rápido, previsível, sem custo
 * de API externa) — ideal para a demo do hackathon. Se quiserem evoluir para
 * um chatbot com IA generativa de verdade, veja AWS_DEPLOY.md → seção
 * "Alimentando o chatbot com IA real (AWS Bedrock / Claude)" — é só trocar
 * a chamada a `responderPerguntaLivre` por uma chamada ao Bedrock, mandando
 * a ficha da empresa como contexto no prompt.
 */
const { getEmpresaComClassificacao } = require("../src/db");
const { responderPerguntaLivre, gerarMensagemAssistente } = require("../src/assistente");
const { ok, erro } = require("./_response");

exports.handler = async (event) => {
  try {
    let body = {};
    try {
      body = event.body ? JSON.parse(event.body) : {};
    } catch {
      return ok({ erro: "Corpo da requisição inválido (JSON esperado)" }, 400);
    }

    const { empresa_id, mensagem } = body;
    if (!mensagem) return ok({ erro: "Campo 'mensagem' é obrigatório" }, 400);

    let contextoEmpresa = null;
    let sugestaoProativa = null;

    if (empresa_id) {
      const dados = getEmpresaComClassificacao(empresa_id);
      if (dados) {
        contextoEmpresa = { nome: dados.empresa.nome_empresa, momento: dados.classificacao?.momento };
        // Se a pergunta for bem genérica (tipo "oi"), aproveita pra já
        // puxar a mensagem proativa relevante daquele momento da jornada
        if (/^(oi|ol[aá]|ajuda|preciso de ajuda)\b/i.test(mensagem.trim())) {
          sugestaoProativa = gerarMensagemAssistente(dados.empresa, dados.classificacao);
        }
      }
    }

    const resposta = responderPerguntaLivre(mensagem);

    return ok({
      resposta,
      contexto_empresa: contextoEmpresa,
      sugestao_proativa: sugestaoProativa,
    });
  } catch (err) {
    return erro(err);
  }
};
