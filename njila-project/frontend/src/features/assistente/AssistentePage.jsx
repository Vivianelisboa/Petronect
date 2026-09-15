import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Bot, MonitorPlay } from "lucide-react";
import { useFilaHoje } from "../../hooks/useFilaHoje";
import { useAssistente } from "../../hooks/useAssistente";
import { registrarAcao } from "../../services/endpoints";
import { Select } from "../../design/ui/Select";
import { EmptyState } from "../../design/ui/EmptyState";
import { Spinner } from "../../design/ui/Spinner";
import { PaolaWidget } from "./PaolaWidget";

const CANAL_ASSISTENTE = "assistente_portal";
const ACAO_IGNORAR = "Agora não";

/**
 * Simulação da visão do FORNECEDOR: a Paola integrada ao Njila. O Njila
 * fornece o gatilho (momento da jornada); a Paola é a voz. Ações clicadas
 * são registradas para alimentar o painel operacional.
 */
export function AssistentePage() {
  const { t } = useTranslation();
  const [empresaId, setEmpresaId] = useState("");
  const { fila } = useFilaHoje({ limit: 60 });
  const { assistente, carregando } = useAssistente(empresaId);

  const empresaSelecionada = fila.find((item) => item.empresa_id === empresaId);

  async function handleAcao(acao) {
    if (acao === ACAO_IGNORAR) return;
    await registrarAcao(empresaId, {
      tipo_acao: "enviar_mensagem",
      canal: CANAL_ASSISTENTE,
      mensagem_enviada: `Fornecedor clicou: "${acao}"`,
    });
  }

  return (
    <section className="mx-auto max-w-xl p-6">
      <div className="mb-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
        <MonitorPlay size={14} />
        {t("assistente.banner_demonstracao")}
      </div>

      <label className="mb-1 block text-sm font-medium text-slate-600">
        {t("assistente.selecionar_empresa")}
      </label>
      <Select value={empresaId} onChange={(e) => setEmpresaId(e.target.value)} className="mb-4">
        <option value="">{t("assistente.selecione")}</option>
        {fila.map((empresa) => (
          <option key={empresa.empresa_id} value={empresa.empresa_id}>
            {empresa.nome_empresa}
          </option>
        ))}
      </Select>

      {!empresaId ? (
        <EmptyState
          icon={Bot}
          title={t("assistente.selecione_titulo")}
          description={t("assistente.selecione_descricao")}
        />
      ) : carregando ? (
        <Spinner label={t("comum.carregando")} />
      ) : (
        <PaolaWidget
          key={empresaId}
          empresaId={empresaId}
          momento={empresaSelecionada?.momento}
          assistente={assistente}
          onAcao={handleAcao}
        />
      )}
    </section>
  );
}
