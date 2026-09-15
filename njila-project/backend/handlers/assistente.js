/**
 * handlers/assistente.js
 * GET /empresa/{empresaId}/assistente
 *
 * Este é o endpoint que o Portal (simulado) consulta para saber se deve
 * mostrar o card do Assistente Contextual para o fornecedor que acabou
 * de logar — e com qual mensagem/ações.
 */
const { getEmpresaComClassificacao } = require("../src/db");
const { gerarMensagemAssistente } = require("../src/assistente");
const { ok, erro, naoEncontrado } = require("./_response");

exports.handler = async (event) => {
  try {
    const empresaId = event.pathParameters && event.pathParameters.empresaId;
    if (!empresaId) return naoEncontrado("Informe o empresaId na URL");

    const dados = getEmpresaComClassificacao(empresaId);
    if (!dados) return naoEncontrado(`Empresa ${empresaId} não encontrada`);

    const assistente = gerarMensagemAssistente(dados.empresa, dados.classificacao);

    return ok({
      empresa_id: empresaId,
      deve_exibir: assistente !== null,
      assistente, // null quando a jornada já está concluída (não interromper)
    });
  } catch (err) {
    return erro(err);
  }
};
