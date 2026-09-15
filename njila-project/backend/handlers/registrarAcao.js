/**
 * handlers/registrarAcao.js
 * POST /empresa/{empresaId}/acao
 * body: { "tipo_acao": "enviar_tutorial", "canal": "email", "mensagem_enviada": "..." }
 * tipo_acao esperado: enviar_mensagem | enviar_tutorial | encaminhar_atendimento | marcar_resolvido | adiar
 */
const { registrarAcao } = require("../src/db");
const { ok, erro, naoEncontrado } = require("./_response");

exports.handler = async (event) => {
  try {
    const empresaId = event.pathParameters && event.pathParameters.empresaId;
    if (!empresaId) return naoEncontrado("Informe o empresaId na URL");

    let body = {};
    try {
      body = event.body ? JSON.parse(event.body) : {};
    } catch {
      return ok({ erro: "Corpo da requisição inválido (JSON esperado)" }, 400);
    }
    if (!body.tipo_acao) return ok({ erro: "Campo 'tipo_acao' é obrigatório" }, 400);

    const registro = registrarAcao(empresaId, body);
    if (!registro) return naoEncontrado(`Empresa ${empresaId} não encontrada`);
    return ok(registro, 201);
  } catch (err) {
    return erro(err);
  }
};
