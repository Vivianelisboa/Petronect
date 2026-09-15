import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Bot } from "lucide-react";
import { useFilaHoje } from "../../hooks/useFilaHoje";
import { useAssistente } from "../../hooks/useAssistente";
import { registrarAcao } from "../../services/endpoints";
import { Select } from "../../design/ui/Select";
import { EmptyState } from "../../design/ui/EmptyState";
import { Spinner } from "../../design/ui/Spinner";
import { AssistenteCard } from "./AssistenteCard";
import { ChatPanel } from "./ChatPanel";

const CANAL_ASSISTENTE = "assistente_portal";
const ACAO_IGNORAR = "Agora não";

/** Simula a visão do FORNECEDOR: card proativo + chat de dúvidas. */
export function AssistentePage() {
  const { t } = useTranslation();
  const [empresaId, setEmpresaId] = useState("");
  const { fila } = useFilaHoje({ limit: 60 });
  const { assistente, carregando } = useAssistente(empresaId);

  async function handleAcao(acao) {
    // No protótipo qualquer ação clicada já é registrada (no Portal real,
    // "Continuar pagamento" levaria o fornecedor para a tela certa).
    if (acao === ACAO_IGNORAR) return;
    await registrarAcao(empresaId, {
      tipo_acao: "enviar_mensagem",
      canal: CANAL_ASSISTENTE,
      mensagem_enviada: `Fornecedor clicou: "${acao}"`,
    });
  }

  return (
    <section className="mx-auto max-w-xl p-6">
      <label className="mb-1 block text-sm font-medium text-slate-600">
        {t("assistente.selecionar_empresa")}
      </label>
      <Select
        value={empresaId}
        onChange={(e) => setEmpresaId(e.target.value)}
        className="mb-4"
      >
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
        <div className="space-y-4">
          <AssistenteCard assistente={assistente} onAcao={handleAcao} />
          <ChatPanel key={empresaId} empresaId={empresaId} />
        </div>
      )}
    </section>
  );
}
