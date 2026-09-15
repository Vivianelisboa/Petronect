import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { buscarFilaHoje, registrarAcao } from "../api";

const CORES_MOMENTO = {
  chegou_perdeu: "bg-gray-100 text-gray-700",
  parou_cadastro: "bg-yellow-100 text-yellow-800",
  quis_participar_travou: "bg-orange-100 text-orange-800",
  era_ativa_sumiu: "bg-red-100 text-red-800",
  oportunidade_quente: "bg-pink-100 text-pink-800",
};

const ROTULO_MOMENTO = {
  chegou_perdeu: "Chegou e se perdeu",
  parou_cadastro: "Parou no cadastro",
  quis_participar_travou: "Quis participar e travou",
  era_ativa_sumiu: "Era ativa e sumiu",
  oportunidade_quente: "Oportunidade quente",
};

export default function FilaHoje({ onSelecionarEmpresa }) {
  const { t } = useTranslation();
  const [fila, setFila] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState("");

  async function carregar() {
    setCarregando(true);
    const data = await buscarFilaHoje({ momento: filtro || undefined });
    setFila(data.fila);
    setCarregando(false);
  }

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtro]);

  async function handleAcaoRapida(empresaId, tipo_acao, mensagem_enviada) {
    await registrarAcao(empresaId, { tipo_acao, canal: "email", mensagem_enviada });
    carregar(); // recarrega pra refletir que a ação foi tomada
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-njila-blue">{t("fila_titulo")}</h2>
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="border rounded-md px-3 py-1.5 text-sm"
        >
          <option value="">Todos os momentos</option>
          {Object.entries(ROTULO_MOMENTO).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {carregando ? (
        <p className="text-gray-500">{t("carregando")}</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-600">
              <tr>
                <th className="p-3">{t("coluna_empresa")}</th>
                <th className="p-3">{t("coluna_momento")}</th>
                <th className="p-3">{t("coluna_score")}</th>
                <th className="p-3">{t("coluna_acao")}</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {fila.map((item) => (
                <tr key={item.empresa_id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <div className="font-medium">{item.nome_empresa}</div>
                    <div className="text-xs text-gray-500">{item.segmento}</div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${CORES_MOMENTO[item.momento] || ""}`}>
                      {ROTULO_MOMENTO[item.momento] || item.momento}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="font-semibold">{item.score}/100</div>
                    <div className="text-xs text-gray-500 max-w-xs">{item.score_explicacao}</div>
                  </td>
                  <td className="p-3 text-gray-700">{item.acao_recomendada}</td>
                  <td className="p-3 space-x-1 whitespace-nowrap">
                    <button
                      onClick={() => onSelecionarEmpresa(item.empresa_id)}
                      className="text-xs px-2 py-1 rounded border hover:bg-gray-100"
                    >
                      {t("acao_ver_ficha")}
                    </button>
                    <button
                      onClick={() => handleAcaoRapida(item.empresa_id, "enviar_tutorial", "Tutorial enviado automaticamente.")}
                      className="text-xs px-2 py-1 rounded bg-njila-green text-white hover:opacity-90"
                    >
                      {t("acao_enviar_tutorial")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
