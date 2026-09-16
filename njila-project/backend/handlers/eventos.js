/**
 * handlers/eventos.js
 * POST /eventos
 * body: { eventId, anonymousId, empresaId?, name, path, occurredAt, consent }
 *
 * Ingestão de eventos de acesso CONSENTIDOS do Portal Petronect. Guarda
 * apenas metadados de navegação. Regras de segurança/LGPD aplicadas aqui:
 *  - validação obrigatória no servidor (o cliente nunca é fonte confiável);
 *  - consentimento explícito exigido (`consent: true`);
 *  - rejeita qualquer payload com campos proibidos (senha, token, CPF, etc.);
 *  - retenção limitada (a camada de dados grava `expira_em`).
 */
const { registrarEventoAcesso } = require("../src/db");
const { ok, erro } = require("./_response");

/** Tipos de evento permitidos — o mesmo contrato do portal. */
const EVENTOS = [
  "page_view",
  "opportunity_opened",
  "proposal_started",
  "contract_opened",
  "payment_opened",
];

/**
 * Campos que NUNCA podem chegar neste endpoint. A checagem é por substring
 * no nome da chave, então `novaSenha`, `accessToken` etc. também são barrados.
 */
const CAMPOS_PROIBIDOS = [
  "senha",
  "password",
  "token",
  "segredo",
  "secret",
  "cpf",
  "cnpj",
  "proposta",
  "documento",
  "cartao",
  "cvv",
];

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function validar(body) {
  const erros = [];

  if (!body || typeof body !== "object") return ["Corpo da requisição inválido."];

  const proibidos = Object.keys(body).filter((chave) =>
    CAMPOS_PROIBIDOS.some((termo) => chave.toLowerCase().includes(termo))
  );
  if (proibidos.length) {
    erros.push(`Campos não permitidos: ${proibidos.join(", ")}.`);
  }

  if (!body.eventId || !UUID.test(body.eventId)) erros.push("eventId deve ser um UUID.");
  if (!body.anonymousId || typeof body.anonymousId !== "string") {
    erros.push("anonymousId é obrigatório.");
  }
  if (!EVENTOS.includes(body.name)) {
    erros.push(`name deve ser um de: ${EVENTOS.join(", ")}.`);
  }
  if (typeof body.path !== "string" || !body.path.startsWith("/")) {
    erros.push("path deve começar com /.");
  }
  if (typeof body.occurredAt !== "string" || Number.isNaN(Date.parse(body.occurredAt))) {
    erros.push("occurredAt deve estar em formato ISO 8601.");
  }
  if (body.consent !== true) {
    erros.push("consent deve ser true (consentimento explícito).");
  }
  if (body.empresaId != null && typeof body.empresaId !== "string") {
    erros.push("empresaId, quando informado, deve ser texto.");
  }

  return erros;
}

exports.handler = async (event) => {
  try {
    let body;
    try {
      body = event.body ? JSON.parse(event.body) : {};
    } catch {
      return ok({ erro: "Corpo da requisição inválido (JSON esperado)." }, 400);
    }

    const erros = validar(body);
    if (erros.length) {
      return ok({ erro: "Evento inválido.", detalhes: erros }, 400);
    }

    const registro = registrarEventoAcesso({
      event_id: body.eventId,
      anonymous_id: body.anonymousId,
      empresa_id: body.empresaId,
      nome: body.name,
      caminho: body.path,
      ocorrido_em: body.occurredAt,
    });

    return ok({ status: "accepted", eventId: registro.event_id }, 202);
  } catch (err) {
    return erro(err);
  }
};
