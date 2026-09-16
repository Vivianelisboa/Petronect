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
  situacao: z.string().optional(),
  classificacao: z
    .object({
      momento: z.string(),
      score: z.number(),
      score_explicacao: z.string(),
      dias_parado: z.number().nullable().optional(),
      ultimo_acesso: z.string().nullable().optional(),
      oportunidade_relacionada: z.string().nullable().optional(),
      n_repeticoes_oportunidade: z.number().nullable().optional(),
      acao_recomendada: z.string().nullable().optional(),
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
  historico_acoes: z.array(
    z.object({
      acao_id: z.number(),
      tipo_acao: z.string(),
      canal: z.string().nullable().optional(),
      mensagem_enviada: z.string().nullable().optional(),
      registrado_em: z.string(),
      momento_no_momento: z.string().nullable().optional(),
    })
  ),
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

export const IndicadoresSchema = z.object({
  periodo: z.number(),
  inicio: z.string(),
  referencia: z.string(),
  kpis: z.object({
    empresas: z.number(),
    eventos: z.number(),
    criticos: z.number(),
    intervencoes: z.number(),
  }),
  serie: z.array(z.object({ dia: z.string(), total: z.number() })),
  areas: z.array(z.object({ area: z.string(), total: z.number() })),
  momentos: z.array(z.object({ momento: z.string(), total: z.number() })),
  recentes: z.array(
    z.object({
      timestamp: z.string(),
      acao: z.string(),
      pagina: z.string(),
      nome_empresa: z.string(),
    })
  ),
});
