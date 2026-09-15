/**
 * src/db.js - Plataforma Njila
 * Camada de acesso ao banco de dados (SQLite localmente / RDS-Postgres em produção AWS).
 * Ver AWS_DEPLOY.md para como trocar o SQLite por um banco gerenciado na AWS
 * mantendo essas mesmas funções como interface — o resto do backend não muda.
 */
const { DatabaseSync } = require("node:sqlite");
const path = require("path");

const DB_PATH = process.env.NJILA_DB_PATH || path.join(__dirname, "..", "njila.db");

let db;
function getDb() {
  if (!db) {
    db = new DatabaseSync(DB_PATH);
    db.exec(`
      CREATE TABLE IF NOT EXISTS classificacao_historico (
        empresa_id TEXT NOT NULL,
        data_operacao TEXT NOT NULL,
        momento TEXT NOT NULL,
        score INTEGER,
        score_explicacao TEXT,
        dias_parado INTEGER,
        oportunidade_relacionada TEXT,
        n_repeticoes_oportunidade INTEGER,
        acao_recomendada TEXT,
        ultimo_acesso TEXT,
        atualizado_em TEXT,
        PRIMARY KEY (empresa_id, data_operacao)
      );
      INSERT OR IGNORE INTO classificacao_historico
        (empresa_id, data_operacao, momento, score, score_explicacao, dias_parado,
         oportunidade_relacionada, n_repeticoes_oportunidade, acao_recomendada,
         ultimo_acesso, atualizado_em)
      SELECT empresa_id, substr(atualizado_em, 1, 10), momento, score, score_explicacao,
             dias_parado, oportunidade_relacionada, n_repeticoes_oportunidade,
             acao_recomendada, ultimo_acesso, atualizado_em
      FROM classificacao;
      INSERT OR IGNORE INTO classificacao_historico
        (empresa_id, data_operacao, momento, score, score_explicacao, dias_parado,
         oportunidade_relacionada, n_repeticoes_oportunidade, acao_recomendada,
         ultimo_acesso, atualizado_em)
      SELECT empresa_id, date('now'), momento, score, score_explicacao, dias_parado,
             oportunidade_relacionada, n_repeticoes_oportunidade, acao_recomendada,
             ultimo_acesso, atualizado_em
      FROM classificacao;
    `);
  }
  return db;
}

/**
 * Deriva a "situação" operacional do caso a partir do histórico de ações.
 * Não há coluna de status no banco — o estado é consequência do que já foi
 * registrado, então nenhuma migração é necessária.
 */
function derivarSituacao({ ultima_acao, ultima_concluiu }) {
  if (!ultima_acao) return "pendente";
  if (ultima_concluiu === 1 || ultima_acao === "marcar_resolvido") return "resolvido";
  if (ultima_acao === "adiar") return "adiado";
  return "em_atendimento";
}

/** Fila de Hoje: empresas que precisam de atenção, ordenadas por score. */
function getFilaHoje({ momento, limit, data } = {}) {
  const conn = getDb();
  const fonte = data ? "classificacao_historico" : "classificacao";
  let sql = `
    SELECT c.empresa_id, e.nome_empresa, e.segmento, c.momento, c.score,
           c.score_explicacao, c.dias_parado, c.ultimo_acesso,
           c.acao_recomendada, c.oportunidade_relacionada,
           (SELECT a.tipo_acao FROM acoes_registradas a
             WHERE a.empresa_id = c.empresa_id
             ORDER BY a.registrado_em DESC, a.acao_id DESC LIMIT 1) AS ultima_acao,
           (SELECT a.empresa_concluiu FROM acoes_registradas a
             WHERE a.empresa_id = c.empresa_id
             ORDER BY a.registrado_em DESC, a.acao_id DESC LIMIT 1) AS ultima_concluiu
     FROM ${fonte} c
    JOIN empresas e ON e.empresa_id = c.empresa_id
    WHERE c.momento != 'jornada_concluida'
  `;
  const params = [];
  if (data) {
    sql += " AND c.data_operacao = ?";
    params.push(data);
  }
  if (momento) {
    sql += " AND c.momento = ?";
    params.push(momento);
  }
  sql += " ORDER BY c.score DESC";
  if (limit) {
    sql += " LIMIT ?";
    params.push(Number(limit));
  }
  return conn
    .prepare(sql)
    .all(...params)
    .map((linha) => ({ ...linha, situacao: derivarSituacao(linha) }));
}

/** Ficha da empresa: dados + momento atual + linha do tempo completa + histórico de ações. */
function getEmpresa(empresaId) {
  const conn = getDb();

  const empresa = conn.prepare("SELECT * FROM empresas WHERE empresa_id = ?").get(empresaId);
  if (!empresa) return null;

  const classificacao = conn
    .prepare("SELECT * FROM classificacao WHERE empresa_id = ?")
    .get(empresaId);

  const timeline = conn
    .prepare(
      `SELECT timestamp, pagina, acao, oportunidade_id, status_etapa
       FROM eventos WHERE empresa_id = ? ORDER BY timestamp`
    )
    .all(empresaId);

  const historico_acoes = conn
    .prepare("SELECT * FROM acoes_registradas WHERE empresa_id = ? ORDER BY registrado_em DESC")
    .all(empresaId);

  const paginas_acessadas = [...new Set(timeline.map((t) => t.pagina))];
  const oportunidades_visualizadas = [
    ...new Set(timeline.map((t) => t.oportunidade_id).filter(Boolean)),
  ];

  return {
    ...empresa,
    classificacao,
    timeline,
    historico_acoes,
    paginas_acessadas,
    oportunidades_visualizadas,
  };
}

/** Registra a intervenção feita (passo "Registro" do MVP). */
function registrarAcao(empresaId, { tipo_acao, canal, mensagem_enviada }) {
  const conn = getDb();

  const classificacao = conn
    .prepare("SELECT momento FROM classificacao WHERE empresa_id = ?")
    .get(empresaId);
  if (!classificacao) return null;

  const agora = new Date().toISOString().slice(0, 19).replace("T", " ");

  const result = conn
    .prepare(
      `INSERT INTO acoes_registradas
         (empresa_id, momento_no_momento, tipo_acao, canal, mensagem_enviada, registrado_em, empresa_retornou, empresa_concluiu)
       VALUES (?, ?, ?, ?, ?, ?, 0, 0)`
    )
    .run(empresaId, classificacao.momento, tipo_acao, canal || "email", mensagem_enviada || "", agora);

  return {
    acao_id: Number(result.lastInsertRowid),
    empresa_id: empresaId,
    momento_no_momento: classificacao.momento,
    tipo_acao,
    canal: canal || "email",
    mensagem_enviada: mensagem_enviada || "",
    registrado_em: agora,
  };
}

/** Resumo para o topo do painel operacional. */
function getResumo() {
  const conn = getDb();
  const porMomento = conn
    .prepare("SELECT momento, COUNT(*) as total FROM classificacao GROUP BY momento")
    .all();
  const totalEmpresas = conn.prepare("SELECT COUNT(*) as n FROM empresas").get().n;
  const totalAcoes = conn.prepare("SELECT COUNT(*) as n FROM acoes_registradas").get().n;

  return { total_empresas: totalEmpresas, total_acoes_registradas: totalAcoes, por_momento: porMomento };
}

/** Usado pelo Assistente: pega empresa + classificação juntos. */
function getEmpresaComClassificacao(empresaId) {
  const conn = getDb();
  const empresa = conn.prepare("SELECT * FROM empresas WHERE empresa_id = ?").get(empresaId);
  if (!empresa) return null;
  const classificacao = conn
    .prepare("SELECT * FROM classificacao WHERE empresa_id = ?")
    .get(empresaId);
  return { empresa, classificacao };
}

module.exports = {
  getFilaHoje,
  getEmpresa,
  registrarAcao,
  getResumo,
  getEmpresaComClassificacao,
};
