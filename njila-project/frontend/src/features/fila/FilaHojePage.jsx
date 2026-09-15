import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ServerCrash, Trophy } from "lucide-react";
import { useFilaHoje } from "../../hooks/useFilaHoje";
import { registrarAcao } from "../../services/endpoints";
import { ACOES, CANAL_PADRAO, SITUACAO_POR_ACAO } from "../../domain/acoes";
import { MOMENTOS_FILTRAVEIS, getMomento } from "../../domain/momentos";
import { Button } from "../../design/ui/Button";
import { EmptyState } from "../../design/ui/EmptyState";
import { Select } from "../../design/ui/Select";
import { Skeleton } from "../../design/ui/Skeleton";
import { ToastStack } from "../../design/ui/ToastStack";
import { CardCaso } from "./CardCaso";
import { ResumoFila } from "./ResumoFila";

const TOAST_POR_ACAO = {
  marcar_resolvido: "fila.toast_resolvido",
  adiar: "fila.toast_adiado",
};

/** 
 * Central de Operações: filtros gamificados e cards corporativos.
 */
export function FilaHojePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [momento, setMomento] = useState("");
  const [segmento, setSegmento] = useState("todos");
  const [overrides, setOverrides] = useState({});
  const [saindo, setSaindo] = useState([]);
  const [toasts, setToasts] = useState([]);

  const { fila, carregando, erro, recarregar } = useFilaHoje({ momento: momento || undefined });

  const comOverride = fila.map((item) =>
    overrides[item.empresa_id] ? { ...item, situacao: overrides[item.empresa_id] } : item
  );

  const contagens = {
    criticos: comOverride.filter((item) => item.score >= 80).length,
    pendente: comOverride.filter((item) => item.situacao === "pendente").length,
    em_atendimento: comOverride.filter((item) => item.situacao === "em_atendimento").length,
    adiado: comOverride.filter((item) => item.situacao === "adiado").length,
    resolvido: comOverride.filter((item) => item.situacao === "resolvido").length,
  };

  const filtrada = comOverride.filter((item) => {
    if (segmento === "todos") return true;
    if (segmento === "criticos") return item.score >= 80;
    return item.situacao === segmento;
  });

  function dispararToast(texto) {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((atual) => [...atual, { id, texto }]);
    setTimeout(() => setToasts((atual) => atual.filter((toast) => toast.id !== id)), 3200);
  }

  async function handleAcao(empresaId, tipoAcao, nomeEmpresa) {
    const novaSituacao = SITUACAO_POR_ACAO[tipoAcao];
    const chaveToast = TOAST_POR_ACAO[tipoAcao] || "fila.toast_acao";
    dispararToast(t(chaveToast, { empresa: nomeEmpresa }));

    const mudaDeSegmento =
      segmento !== "todos" && segmento !== "criticos" && novaSituacao !== segmento;

    if (mudaDeSegmento) {
      setSaindo((atual) => [...atual, empresaId]);
      setTimeout(() => {
        setOverrides((atual) => ({ ...atual, [empresaId]: novaSituacao }));
        setSaindo((atual) => atual.filter((id) => id !== empresaId));
      }, 300);
    } else {
      setOverrides((atual) => ({ ...atual, [empresaId]: novaSituacao }));
    }

    try {
      await registrarAcao(empresaId, {
        tipo_acao: tipoAcao,
        canal: CANAL_PADRAO,
        mensagem_enviada: t(ACOES[tipoAcao]),
      });
      await recarregar({ silencioso: true });
    } finally {
      setOverrides((atual) => {
        const proximo = { ...atual };
        delete proximo[empresaId];
        return proximo;
      });
    }
  }

  return (
    <section className="space-y-6">
      {/* Stats hero + filtros */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <ResumoFila
          contagens={contagens}
          total={comOverride.length}
          ativo={segmento}
          onSelecionar={setSegmento}
        />
        <Select
          aria-label={t("fila.filtrar_por_momento")}
          value={momento}
          onChange={(e) => setMomento(e.target.value)}
          className="w-56"
        >
          <option value="">{t("fila.todos_momentos")}</option>
          {MOMENTOS_FILTRAVEIS.map((momentoId) => (
            <option key={momentoId} value={momentoId}>
              {t(getMomento(momentoId).i18nKey)}
            </option>
          ))}
        </Select>
      </div>

      {/* Cards de operação */}
      {carregando ? (
        <div className="space-y-0 divide-y divide-ink-100">
          {[0, 1, 2].map((indice) => (
            <RowSkeleton key={indice} />
          ))}
        </div>
      ) : erro ? (
        <div className="rounded-2xl bg-white shadow-sm">
          <EmptyState
            icon={ServerCrash}
            title={t("fila.erro_titulo")}
            description={t("fila.erro_descricao")}
            action={
              <Button variant="secondary" size="sm" onClick={() => recarregar()}>
                {t("comum.tentar_de_novo")}
              </Button>
            }
          />
        </div>
      ) : filtrada.length === 0 ? (
        <div className="rounded-2xl bg-white shadow-sm">
          <EmptyState
            icon={Trophy}
            title={t("fila.vazia_titulo")}
            description={t("fila.vazia_descricao")}
          />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtrada.map((item) => (
            <CardCaso
              key={item.empresa_id}
              item={item}
              saindo={saindo.includes(item.empresa_id)}
              onVerFicha={(empresaId) => navigate(`/empresa/${empresaId}`)}
              onAcao={handleAcao}
            />
          ))}
        </div>
      )}

      <ToastStack toasts={toasts} />
    </section>
  );
}

function RowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-5 py-4">
      <Skeleton className="h-10 w-10 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-28" />
      </div>
      <Skeleton className="h-8 w-24 rounded-md" />
    </div>
  );
}
