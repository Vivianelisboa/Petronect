/**
 * services/tracking.js
 * Captura de eventos de acesso CONSENTIDOS do fornecedor no Portal Petronect.
 *
 * Nunca envie aqui senha, token, proposta, documento, CPF/CNPJ ou qualquer
 * texto digitado em campos livres — apenas metadados de navegação, sempre
 * com consentimento. A identidade real (usuário/empresa) deve vir da sessão
 * autenticada no servidor; o `empresaId` aqui é apenas contexto de demo.
 */
import { z } from "zod";
import { apiFetch } from "./apiClient";

export const EVENTOS_ACESSO = [
  "page_view",
  "opportunity_opened",
  "proposal_started",
  "contract_opened",
  "payment_opened",
];

export const eventoAcessoSchema = z.object({
  eventId: z.string().uuid(),
  anonymousId: z.string().min(1),
  empresaId: z.string().min(1).optional(),
  name: z.enum(EVENTOS_ACESSO),
  path: z.string().startsWith("/"),
  occurredAt: z.string().datetime(),
  consent: z.literal(true),
});

const CHAVE_ANONIMA = "njila_anonymous_id";

/** Recupera (ou cria) o pseudônimo técnico persistido no navegador. */
function obterAnonymousId() {
  try {
    const existente = window.localStorage.getItem(CHAVE_ANONIMA);
    if (existente) return existente;
    const novo = crypto.randomUUID();
    window.localStorage.setItem(CHAVE_ANONIMA, novo);
    return novo;
  } catch {
    return crypto.randomUUID();
  }
}

/**
 * Registra um evento de acesso consentido. Valida antes de enviar e não
 * quebra a interface se a ingestão falhar — telemetria nunca bloqueia o uso.
 */
export async function track({ name, path, empresaId }) {
  const evento = {
    eventId: crypto.randomUUID(),
    anonymousId: obterAnonymousId(),
    empresaId,
    name,
    path,
    occurredAt: new Date().toISOString(),
    consent: true,
  };

  const parsed = eventoAcessoSchema.safeParse(evento);
  if (!parsed.success) {
    console.error("[tracking] Evento inválido, descartado:", parsed.error.flatten());
    return null;
  }

  try {
    await apiFetch("/eventos", {
      method: "POST",
      body: JSON.stringify(parsed.data),
      keepalive: true,
    });
  } catch (err) {
    console.warn("[tracking] Falha ao enviar evento:", err.message);
  }

  return parsed.data;
}
