/**
 * src/db.js - Plataforma Njila
 * Camada de acesso ao banco de dados (SQLite localmente / RDS-Postgres em produção AWS).
 * Ver AWS_DEPLOY.md para como trocar o SQLite por um banco gerenciado na AWS
 * mantendo essas mesmas funções como interface — o resto do backend não muda.
 */
const { DatabaseSync } = require("node:sqlite");
const path = require("path");
const { PRIORIDADES, classificarPerfil, gerarMensagemReengajamento } = require("./relatorio");

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

      CREATE TABLE IF NOT EXISTS eventos_acesso (
        event_id TEXT PRIMARY KEY,
        anonymous_id TEXT NOT NULL,
        empresa_id TEXT,
        nome TEXT NOT NULL,
        caminho TEXT NOT NULL,
        ocorrido_em TEXT NOT NULL,
        consentimento INTEGER NOT NULL DEFAULT 1,
        recebido_em TEXT NOT NULL,
        expira_em TEXT
      );
    `);
  }
  return db;
}

/**
 * Eventos de acesso consentidos (ingestão). Guarda apenas metadados de
 * navegação — nunca senha, token, proposta, documento ou dado pessoal.
 * `expira_em` materializa a retenção limitada (LGPD, 90 dias).
 */
function registrarEventoAcesso({ event_id, anonymous_id, empresa_id, nome, caminho, ocorrido_em }) {
  const conn = getDb();
  const recebidoEm = new Date().toISOString().slice(0, 19).replace("T", " ");
  const expiraEm = new Date(new Date(ocorrido_em).getTime() + 90 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  conn
    .prepare(
      `INSERT OR IGNORE INTO eventos_acesso
         (event_id, anonymous_id, empresa_id, nome, caminho, ocorrido_em, consentimento, recebido_em, expira_em)
       VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)`
    )
    .run(event_id, anonymous_id, empresa_id || null, nome, caminho, ocorrido_em, recebidoEm, expiraEm);

  return { event_id, nome, caminho, ocorrido_em, recebido_em: recebidoEm, expira_em: expiraEm };
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

  // A situação operacional também vale para a ficha — derivada da última ação.
  const ultima = historico_acoes[0];
  const situacao = derivarSituacao({
    ultima_acao: ultima?.tipo_acao,
    ultima_concluiu: ultima?.empresa_concluiu,
  });

  return {
    ...empresa,
    classificacao,
    situacao,
    timeline,
    historico_acoes,
    paginas_acessadas,
    oportunidades_visualizadas,
    engajamento: getEngajamento(conn, empresaId, classificacao),
  };
}

/**
 * Perfil de engajamento do fornecedor (radar Pulso) calculado para a ficha:
 * recência e frequência de acesso + mensagem personalizada de reengajamento.
 * A janela de referência segue o padrão do restante do backend (ancorada no
 * último dia com evento do banco).
 */
function getEngajamento(conn, empresaId, classificacao) {
  const referencia = conn
    .prepare("SELECT COALESCE(MAX(date(timestamp)), date('now')) AS d FROM eventos")
    .get().d;
  const inicio7d = conn.prepare("SELECT date(?, '-7 days') AS d").get(referencia).d;
  const refMs = Date.parse(`${referencia}T00:00:00`);

  const frequenciaSemanal = conn
    .prepare(
      `SELECT COUNT(*) AS n FROM eventos
        WHERE empresa_id = ? AND date(timestamp) >= ?`
    )
    .get(empresaId, inicio7d).n;

  const ultimoMs = classificacao?.ultimo_acesso
    ? Date.parse(classificacao.ultimo_acesso.replace(" ", "T"))
    : null;
  const diasSemAcesso = ultimoMs
    ? Math.max(0, Math.round((refMs - ultimoMs) / (24 * 60 * 60 * 1000)))
    : Number(classificacao?.dias_parado) || 0;

  const perfil = classificarPerfil({ diasSemAcesso, frequenciaSemanal });
  const nomeEmpresa = conn
    .prepare("SELECT nome_empresa FROM empresas WHERE empresa_id = ?")
    .get(empresaId).nome_empresa;

  return {
    perfil,
    dias_sem_acesso: diasSemAcesso,
    frequencia_semanal: frequenciaSemanal,
    mensagem: gerarMensagemReengajamento({ nome: nomeEmpresa, perfil, diasSemAcesso }),
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

/**
 * Indicadores do painel analítico. Para o gráfico não ficar vazio caso o seed
 * tenha datas antigas, a janela do período é ancorada no último dia com
 * evento (referência), e não em "hoje".
 */
function getIndicadores({ periodo } = {}) {
  const conn = getDb();
  const dias = [7, 30, 90].includes(Number(periodo)) ? Number(periodo) : 30;

  const referencia = conn
    .prepare("SELECT COALESCE(MAX(date(timestamp)), date('now')) AS d FROM eventos")
    .get().d;
  const inicio = conn.prepare("SELECT date(?, ?) AS d").get(referencia, `-${dias} days`).d;

  const kpis = {
    empresas: conn.prepare("SELECT COUNT(*) AS n FROM empresas").get().n,
    eventos: conn
      .prepare("SELECT COUNT(*) AS n FROM eventos WHERE date(timestamp) >= ?")
      .get(inicio).n,
    criticos: conn.prepare("SELECT COUNT(*) AS n FROM classificacao WHERE score >= 80").get().n,
    intervencoes: conn
      .prepare("SELECT COUNT(*) AS n FROM acoes_registradas WHERE date(registrado_em) >= ?")
      .get(inicio).n,
  };

  const serie = conn
    .prepare(
      `SELECT date(timestamp) AS dia, COUNT(*) AS total
       FROM eventos
       WHERE date(timestamp) >= ?
       GROUP BY dia
       ORDER BY dia`
    )
    .all(inicio);

  const areas = conn
    .prepare(
      `SELECT pagina AS area, COUNT(*) AS total
       FROM eventos
       WHERE date(timestamp) >= ?
       GROUP BY pagina
       ORDER BY total DESC`
    )
    .all(inicio);

  const momentos = conn
    .prepare(
      `SELECT momento, COUNT(*) AS total
       FROM classificacao
       WHERE momento != 'jornada_concluida'
       GROUP BY momento
       ORDER BY total DESC`
    )
    .all();

  const recentes = conn
    .prepare(
      `SELECT e.timestamp, e.acao, e.pagina, em.nome_empresa
       FROM eventos e
       JOIN empresas em ON em.empresa_id = e.empresa_id
       ORDER BY e.timestamp DESC
       LIMIT 6`
    )
    .all();

  return { periodo: dias, inicio, referencia, kpis, serie, areas, momentos, recentes };
}

/**
 * Relatório de reengajamento (radar Pulso). Classifica cada fornecedor por
 * perfil de engajamento a partir da recência e da frequência de acesso,
 * gera a mensagem personalizada e devolve a lista priorizada para o time
 * de Marketing. A janela de "hoje" é ancorada no último dia com evento do
 * banco (mesmo padrão do getIndicadores), para o demo não zerar por causa
 * de datas antigas no seed.
 */
function getRelatorioReengajamento() {
  const conn = getDb();

  const referencia = conn
    .prepare("SELECT COALESCE(MAX(date(timestamp)), date('now')) AS d FROM eventos")
    .get().d;
  const inicio7d = conn.prepare("SELECT date(?, '-7 days') AS d").get(referencia).d;
  const refMs = Date.parse(`${referencia}T00:00:00`);

  const empresas = conn
    .prepare(
      `SELECT e.empresa_id, e.nome_empresa, e.segmento, c.ultimo_acesso, c.dias_parado,
              (SELECT COUNT(*) FROM eventos ev
                WHERE ev.empresa_id = e.empresa_id AND date(ev.timestamp) >= ?) AS acessos_7d
       FROM empresas e
       LEFT JOIN classificacao c ON c.empresa_id = e.empresa_id
       ORDER BY e.nome_empresa`
    )
    .all(inicio7d);

  const relatorio = empresas.map((linha) => {
    const ultimoMs = linha.ultimo_acesso ? Date.parse(linha.ultimo_acesso.replace(" ", "T")) : null;
    const diasSemAcesso = ultimoMs
      ? Math.max(0, Math.round((refMs - ultimoMs) / (24 * 60 * 60 * 1000)))
      : Number(linha.dias_parado) || 0;

    const perfil = classificarPerfil({
      diasSemAcesso,
      frequenciaSemanal: Number(linha.acessos_7d) || 0,
    });

    return {
      empresa_id: linha.empresa_id,
      empresa: linha.nome_empresa,
      segmento: linha.segmento,
      perfil,
      prioridade: PRIORIDADES[perfil],
      dias_sem_acesso: diasSemAcesso,
      frequencia_semanal: Number(linha.acessos_7d) || 0,
      mensagem_reengajamento: gerarMensagemReengajamento({
        nome: linha.nome_empresa,
        perfil,
        diasSemAcesso,
      }),
    };
  });

  relatorio.sort((a, b) => a.prioridade - b.prioridade || a.empresa.localeCompare(b.empresa));

  const distribuicao = { Ativo: 0, Novo: 0, "Em Risco": 0, Inativo: 0 };
  for (const item of relatorio) distribuicao[item.perfil] += 1;

  return {
    gerado_em: referencia,
    total: relatorio.length,
    distribuicao,
    relatorio,
  };
}

module.exports = {
  getFilaHoje,
  getEmpresa,
  registrarAcao,
  getResumo,
  getEmpresaComClassificacao,
  registrarEventoAcesso,
  getIndicadores,
  getRelatorioReengajamento,
};
