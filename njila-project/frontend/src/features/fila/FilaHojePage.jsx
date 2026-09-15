import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Inbox } from "lucide-react";
import { useFilaHoje } from "../../hooks/useFilaHoje";
import { registrarAcao } from "../../services/endpoints";
import { CANAL_PADRAO } from "../../domain/acoes";
import { MOMENTOS_FILTRAVEIS, getMomento } from "../../domain/momentos";
import { Select } from "../../design/ui/Select";
import { Spinner } from "../../design/ui/Spinner";
import { EmptyState } from "../../design/ui/EmptyState";
import { FilaTable } from "./FilaTable";

/** Página principal: empresas que precisam de atenção, ordenadas por score. */
export function FilaHojePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState("");
  const { fila, carregando, recarregar } = useFilaHoje({ momento: filtro || undefined });

  async function handleAcaoRapida(empresaId) {
    await registrarAcao(empresaId, {
      tipo_acao: "enviar_tutorial",
      canal: CANAL_PADRAO,
      mensagem_enviada: t("fila.mensagem_tutorial_automatico"),
    });
    recarregar();
  }

  return (
    <section className="p-6">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-ink-800">{t("fila.titulo")}</h2>
        <Select
          aria-label={t("fila.filtrar_por_momento")}
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="w-56"
        >
          <option value="">{t("fila.todos_momentos")}</option>
          {MOMENTOS_FILTRAVEIS.map((momento) => (
            <option key={momento} value={momento}>
              {t(getMomento(momento).i18nKey)}
            </option>
          ))}
        </Select>
      </header>

      {carregando ? (
        <Spinner label={t("comum.carregando")} />
      ) : fila.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title={t("fila.vazia_titulo")}
          description={t("fila.vazia_descricao")}
        />
      ) : (
        <FilaTable
          fila={fila}
          onVerFicha={(empresaId) => navigate(`/empresa/${empresaId}`)}
          onAcaoRapida={handleAcaoRapida}
        />
      )}
    </section>
  );
}
