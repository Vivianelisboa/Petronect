/**
 * services/endpoints.js
 * Cada função corresponde a uma rota do backend e devolve dados já
 * validados pelos schemas. É a única camada que conhece URLs.
 */
import { apiFetch } from "./apiClient";
import {
  FilaHojeSchema,
  EmpresaSchema,
  AssistenteSchema,
  ChatRespostaSchema,
  IndicadoresSchema,
} from "./schemas";

export async function buscarFilaHoje({ momento, limit, data } = {}) {
  const params = new URLSearchParams();
  if (momento) params.set("momento", momento);
  if (limit) params.set("limit", limit);
  if (data) params.set("data", data);
  const resposta = await apiFetch(`/fila-hoje?${params.toString()}`);
  return FilaHojeSchema.parse(resposta);
}

export async function buscarEmpresa(empresaId) {
  const data = await apiFetch(`/empresa/${empresaId}`);
  if (data.erro) return null;
  return EmpresaSchema.parse(data);
}

export async function buscarAssistente(empresaId) {
  const data = await apiFetch(`/empresa/${empresaId}/assistente`);
  if (data.erro) return null;
  return AssistenteSchema.parse(data);
}

export async function registrarAcao(empresaId, { tipo_acao, canal, mensagem_enviada }) {
  return apiFetch(`/empresa/${empresaId}/acao`, {
    method: "POST",
    body: JSON.stringify({ tipo_acao, canal, mensagem_enviada }),
  });
}

export async function enviarMensagemChat({ empresaId, mensagem }) {
  const data = await apiFetch(`/chat`, {
    method: "POST",
    body: JSON.stringify({ empresa_id: empresaId, mensagem }),
  });
  return ChatRespostaSchema.parse(data);
}

export async function buscarResumo() {
  return apiFetch(`/resumo`);
}

export async function buscarIndicadores({ periodo } = {}) {
  const params = new URLSearchParams();
  if (periodo) params.set("periodo", periodo);
  const resposta = await apiFetch(`/indicadores?${params.toString()}`);
  return IndicadoresSchema.parse(resposta);
}
