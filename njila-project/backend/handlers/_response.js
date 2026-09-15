/**
 * handlers/_response.js
 * Padroniza as respostas HTTP (com CORS liberado para o frontend React/Vite).
 */
const HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
};

function ok(body, statusCode = 200) {
  return { statusCode, headers: HEADERS, body: JSON.stringify(body) };
}
function erro(err, statusCode = 500) {
  console.error(err);
  return ok({ erro: err.message || "Erro interno" }, statusCode);
}
function naoEncontrado(mensagem = "Não encontrado") {
  return ok({ erro: mensagem }, 404);
}

module.exports = { ok, erro, naoEncontrado };
