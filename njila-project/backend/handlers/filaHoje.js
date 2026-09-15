/**
 * handlers/filaHoje.js
 * GET /fila-hoje?momento=oportunidade_quente&limit=20
 */
const { getFilaHoje } = require("../src/db");
const { ok, erro } = require("./_response");

exports.handler = async (event) => {
  try {
    const qs = event.queryStringParameters || {};
    const fila = getFilaHoje({ momento: qs.momento, limit: qs.limit });
    return ok({ total: fila.length, fila });
  } catch (err) {
    return erro(err);
  }
};
