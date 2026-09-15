/**
 * services/schemas.js
 * Contratos das respostas da API, validados com Zod. Se o backend mudar o
 * formato sem querer, o erro aparece aqui (cedo, em dev) em vez de quebrar
 * a tela silenciosamente em produção.
 */
import { z } from "zod";

export const ItemFilaSchema = z.object({
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
  situacao: z.string(),
});

export const FilaHojeSchema = z.object({
  total: z.number(),
  fila: z.array(ItemFilaSchema),
});

export const EmpresaSchema = z.object({
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

export const AssistenteSchema = z.object({
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

export const ChatRespostaSchema = z.object({
  resposta: z.string(),
  contexto_empresa: z.any().nullable(),
  sugestao_proativa: z.any().nullable(),
});
