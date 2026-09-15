/**
 * src/api.js
 * Cliente de API do backend Njila, com validação Zod nas respostas.
 * Se o backend mudar formato sem querer, isso quebra em dev (rápido de
 * pegar o erro) em vez de quebrar silenciosamente na tela de produção.
 */
import { z } from "zod";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const ItemFilaSchema = z.object({
  empresa_id: z.string(),
  nome_empresa: z.string(),
  segmento: z.string(),
  momento: z.string(),
  score: z.number(),
  score_explicacao: z.string(),
  dias_parado: z.number(),
  ultimo_acesso: z.string(),
  acao_recomendada: z.string(),
  oportunidade_relacionada: z.string().nullable().optional(),
});
const FilaHojeSchema = z.object({
  total: z.number(),
  fila: z.array(ItemFilaSchema),
});

const EmpresaSchema = z.object({
  empresa_id: z.string(),
  nome_empresa: z.string(),
  cnpj_mascarado: z.string(),
  segmento: z.string(),
  data_cadastro_portal: z.string(),
  classificacao: z
    .object({
      momento: z.string(),
      score: z.number(),
      score_explicacao: z.string(),
    })
    .nullable(),
  timeline: z.array(
    z.object({
      timestamp: z.string(),
      pagina: z.string(),
      acao: z.string(),
      oportunidade_id: z.string().nullable().optional(),
      status_etapa: z.string().nullable().optional(),
    })
  ),
  historico_acoes: z.array(z.any()),
  paginas_acessadas: z.array(z.string()),
  oportunidades_visualizadas: z.array(z.string()),
});

const AssistenteSchema = z.object({
  empresa_id: z.string(),
  deve_exibir: z.boolean(),
  assistente: z
    .object({
      titulo: z.string(),
      mensagem: z.string(),
      acoes: z.array(z.string()),
    })
    .nullable(),
});

const ChatRespostaSchema = z.object({
  resposta: z.string(),
  contexto_empresa: z.any().nullable(),
  sugestao_proativa: z.any().nullable(),
});

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok && res.status !== 400 && res.status !== 404) {
    throw new Error(`Erro na API: ${res.status}`);
  }
  return res.json();
}

export async function buscarFilaHoje({ momento, limit } = {}) {
  const params = new URLSearchParams();
  if (momento) params.set("momento", momento);
  if (limit) params.set("limit", limit);
  const data = await apiFetch(`/fila-hoje?${params.toString()}`);
  return FilaHojeSchema.parse(data);
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
