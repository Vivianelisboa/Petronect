/**
 * handlers/relatorioReengajamento.js
 * GET /relatorio-reengajamento
 *  - JSON (padrão): resumo + lista priorizada para o time de Marketing.
 *  - ?formato=csv: download do relatório em CSV (mesmo formato do Pulso).
 */
const { getRelatorioReengajamento } = require("../src/db");
const { ok, erro } = require("./_response");

function paraCsv(relatorio) {
  const cabecalho = [
    "prioridade",
    "perfil",
    "empresa",
    "segmento",
    "dias_sem_acesso",
    "frequencia_semanal",
    "mensagem_reengajamento",
  ];

  const linhas = relatorio.map((item) =>
    cabecalho
      .map((campo) => `"${String(item[campo] ?? "").replace(/"/g, '""')}"`)
      .join(",")
  );

  return [cabecalho.join(","), ...linhas].join("\n");
}

exports.handler = async (event) => {
  try {
    const qs = event.queryStringParameters || {};
    const dados = getRelatorioReengajamento();

    if (qs.formato === "csv") {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": 'attachment; filename="relatorio_reengajamento.csv"',
          "Access-Control-Allow-Origin": "*",
        },
        body: paraCsv(dados.relatorio),
      };
    }

    return ok(dados);
  } catch (err) {
    return erro(err);
  }
};