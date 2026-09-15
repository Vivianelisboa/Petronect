/**
 * handlers/resumo.js
 * GET /resumo
 */
const { getResumo } = require("../src/db");
const { ok, erro } = require("./_response");

exports.handler = async () => {
  try {
    return ok(getResumo());
  } catch (err) {
    return erro(err);
  }
};
