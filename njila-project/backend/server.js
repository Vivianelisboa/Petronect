/**
 * server.js - Servidor local para DEV/DEMO (roda os handlers serverless
 * atrás de HTTP comum, sem instalar nada — só módulos nativos do Node).
 * Uso: node server.js  →  http://localhost:3000
 */
const http = require("http");
const url = require("url");

const filaHoje = require("./handlers/filaHoje");
const empresa = require("./handlers/empresa");
const registrarAcao = require("./handlers/registrarAcao");
const resumo = require("./handlers/resumo");
const assistente = require("./handlers/assistente");
const chat = require("./handlers/chat");

const PORT = process.env.PORT || 3000;

function matchRota(method, pathname) {
  if (method === "GET" && pathname === "/fila-hoje") return { handler: filaHoje.handler, pathParameters: {} };
  if (method === "GET" && pathname === "/resumo") return { handler: resumo.handler, pathParameters: {} };
  if (method === "POST" && pathname === "/chat") return { handler: chat.handler, pathParameters: {} };

  let m = pathname.match(/^\/empresa\/([^/]+)$/);
  if (method === "GET" && m) return { handler: empresa.handler, pathParameters: { empresaId: m[1] } };

  m = pathname.match(/^\/empresa\/([^/]+)\/acao$/);
  if (method === "POST" && m) return { handler: registrarAcao.handler, pathParameters: { empresaId: m[1] } };

  m = pathname.match(/^\/empresa\/([^/]+)\/assistente$/);
  if (method === "GET" && m) return { handler: assistente.handler, pathParameters: { empresaId: m[1] } };

  return null;
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  const rota = matchRota(req.method, parsed.pathname);

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    });
    return res.end();
  }

  if (!rota) {
    res.writeHead(404, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ erro: "Rota não encontrada" }));
  }

  let chunks = [];
  req.on("data", (c) => chunks.push(c));
  req.on("end", async () => {
    const body = Buffer.concat(chunks).toString() || undefined;
    const event = { pathParameters: rota.pathParameters, queryStringParameters: parsed.query, body };
    try {
      const resultado = await rota.handler(event);
      res.writeHead(resultado.statusCode, resultado.headers);
      res.end(resultado.body);
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ erro: err.message }));
    }
  });
});

server.listen(PORT, () => {
  console.log(`Njila backend rodando em http://localhost:${PORT}`);
  console.log("Rotas disponíveis:");
  console.log("  GET  /fila-hoje");
  console.log("  GET  /fila-hoje?momento=oportunidade_quente&limit=10");
  console.log("  GET  /resumo");
  console.log("  GET  /empresa/:empresaId");
  console.log("  GET  /empresa/:empresaId/assistente   <- chatbot proativo");
  console.log("  POST /chat                             <- chatbot conversa livre");
  console.log("  POST /empresa/:empresaId/acao");
});
