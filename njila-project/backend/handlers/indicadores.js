/**
 * handlers/indicadores.js
 * GET /indicadores?periodo=7|30|90
 *
 * Agrega os dados reais do Njila para a Visão analítica: KPIs, série de
 * eventos por dia, uso por área do portal, distribuição por momento e a
 * atividade mais recente.
 */
const { getIndicadores } = require("../src/db");
const { ok, erro } = require("./_response");

exports.handler = async (event) => {
  try {
    const qs = event.queryStringParameters || {};
    return ok(getIndicadores({ periodo: qs.periodo }));
  } catch (err) {
    return erro(err);
  }
};
