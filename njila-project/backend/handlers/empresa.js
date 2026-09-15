/**
 * handlers/empresa.js
 * GET /empresa/{empresaId} - Ficha completa da empresa
 */
const { getEmpresa } = require("../src/db");
const { ok, erro, naoEncontrado } = require("./_response");

exports.handler = async (event) => {
  try {
    const empresaId = event.pathParameters && event.pathParameters.empresaId;
    if (!empresaId) return naoEncontrado("Informe o empresaId na URL");
    const empresa = getEmpresa(empresaId);
    if (!empresa) return naoEncontrado(`Empresa ${empresaId} não encontrada`);
    return ok(empresa);
  } catch (err) {
    return erro(err);
  }
};
