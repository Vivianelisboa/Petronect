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
import { SearchField } from "../../design/ui/SearchField";
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
  const [dataReferencia, setDataReferencia] = useState(dataHoje());
  const [busca, setBusca] = useState("");
  const [segmento, setSegmento] = useState("todos");
  const [overrides, setOverrides] = useState({});
  const [saindo, setSaindo] = useState([]);
  const [toasts, setToasts] = useState([]);

  const { fila, carregando, erro, recarregar } = useFilaHoje({
    momento: momento || undefined,
    data: dataReferencia,
  });

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
    const termo = busca.trim().toLocaleLowerCase();
    const correspondeBusca = !termo || [
      item.nome_empresa,
      item.segmento,
      item.momento,
      item.acao_recomendada,
    ].some((valor) => String(valor || "").toLocaleLowerCase().includes(termo));

    if (!correspondeBusca) return false;
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
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-brand-700">Central de Operações</p>
          <h1 className="font-display mt-2 text-3xl font-normal tracking-[-0.035em] text-ink-900">
            {t("central.saudacao", { nome: t("perfil.nome").split(" ")[0] })}
          </h1>
          <p className="mt-1 text-sm text-ink-500">{t("central.descricao")}</p>
        </div>
        <label className="flex items-center gap-3 text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-400">{t("central.data")}</span>
            <input
              type="date"
              value={dataReferencia}
              onChange={(e) => setDataReferencia(e.target.value)}
              className="h-10 rounded-lg border border-ink-200 bg-white px-3 text-sm font-medium text-ink-700 shadow-sm outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
        </label>
      </header>

      {/* Stats hero + filtros */}
      <div className="space-y-4">
        <ResumoFila
          contagens={contagens}
          total={comOverride.length}
          ativo={segmento}
          onSelecionar={setSegmento}
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-400">
            {t("fila.filtrar_por_momento")}
          </span>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <SearchField
              value={busca}
              onChange={setBusca}
              placeholder={t("central.buscar")}
              className="w-full sm:w-64"
            />
            <Select
              aria-label={t("fila.filtrar_por_momento")}
              value={momento}
              onChange={(e) => setMomento(e.target.value)}
              className="w-full sm:w-64"
            >
              <option value="">{t("fila.todos_momentos")}</option>
              {MOMENTOS_FILTRAVEIS.map((momentoId) => (
                <option key={momentoId} value={momentoId}>
                  {t(getMomento(momentoId).i18nKey)}
                </option>
              ))}
            </Select>
          </div>
        </div>
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

function dataHoje() {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
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
