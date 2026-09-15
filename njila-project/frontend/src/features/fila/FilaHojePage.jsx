import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Filter, ServerCrash, Trophy } from "lucide-react";
import { useFilaHoje } from "../../hooks/useFilaHoje";
import { registrarAcao } from "../../services/endpoints";
import { ACOES, CANAL_PADRAO, SITUACAO_POR_ACAO } from "../../domain/acoes";
import { ACOES_COM_MENSAGEM, modeloDeMensagem } from "../../domain/mensagens";
import { MOMENTOS_FILTRAVEIS, getMomento } from "../../domain/momentos";
import { Button } from "../../design/ui/Button";
import { EmptyState } from "../../design/ui/EmptyState";
import { Select } from "../../design/ui/Select";
import { SearchField } from "../../design/ui/SearchField";
import { Skeleton } from "../../design/ui/Skeleton";
import { ToastStack } from "../../design/ui/ToastStack";
import { ComposerMensagem } from "../../components/ComposerMensagem";
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
  const [acaoEmAndamento, setAcaoEmAndamento] = useState("");
  const [composer, setComposer] = useState(null);

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
      t(getMomento(item.momento).i18nKey),
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

  async function executarAcao(empresaId, tipoAcao, nomeEmpresa, mensagem, canal) {
    if (acaoEmAndamento) return;

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

    setAcaoEmAndamento(empresaId);

    try {
      await registrarAcao(empresaId, {
        tipo_acao: tipoAcao,
        canal: canal || CANAL_PADRAO,
        mensagem_enviada: mensagem || t(ACOES[tipoAcao]),
      });
      setComposer(null);
      await recarregar({ silencioso: true });
    } catch {
      dispararToast(t("fila.toast_erro"));
      setSaindo((atual) => atual.filter((id) => id !== empresaId));
      setOverrides((atual) => {
        const proximo = { ...atual };
        delete proximo[empresaId];
        return proximo;
      });
    } finally {
      setAcaoEmAndamento("");
      setOverrides((atual) => {
        const proximo = { ...atual };
        delete proximo[empresaId];
        return proximo;
      });
    }
  }

  function abrirAcao(empresaId, tipoAcao, nomeEmpresa) {
    if (ACOES_COM_MENSAGEM.includes(tipoAcao)) {
      const item = comOverride.find((registro) => registro.empresa_id === empresaId);
      const chave = modeloDeMensagem(tipoAcao, item?.momento);
      setComposer({ empresaId, tipoAcao, nomeEmpresa, texto: chave ? t(chave) : "" });
      return;
    }
    executarAcao(empresaId, tipoAcao, nomeEmpresa);
  }

  const recorteVazio = busca.trim() || momento || segmento !== "todos";
  const dataSemSnapshot = dataReferencia !== dataHoje() && fila.length === 0;

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
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <SearchField
              value={busca}
              onChange={setBusca}
              placeholder={t("central.buscar")}
              className="w-full sm:w-72"
            />
            <div className="relative w-full sm:w-60">
              <Filter size={15} className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-ink-400" />
              <Select
                aria-label={t("fila.filtrar_por_momento")}
                value={momento}
                onChange={(e) => setMomento(e.target.value)}
                className="w-full pl-9"
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
        <p className="text-xs text-ink-400">
          {busca.trim()
            ? t("central.resultados", { count: filtrada.length })
            : t("central.empresas", { count: comOverride.length })}
        </p>
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
            title={
              dataSemSnapshot
                ? t("fila.sem_data_titulo")
                : recorteVazio
                  ? t("fila.sem_resultado_titulo")
                  : t("fila.vazia_titulo")
            }
            description={
              dataSemSnapshot
                ? t("fila.sem_data_descricao")
                : recorteVazio
                  ? t("fila.sem_resultado_descricao")
                  : t("fila.vazia_descricao")
            }
          />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtrada.map((item) => (
            <CardCaso
              key={item.empresa_id}
              item={item}
              saindo={saindo.includes(item.empresa_id)}
              acaoEmAndamento={acaoEmAndamento === item.empresa_id}
              onVerFicha={(empresaId) => navigate(`/empresa/${empresaId}`)}
              onAcao={abrirAcao}
            />
          ))}
        </div>
      )}

      {composer && (
        <ComposerMensagem
          empresa={composer.nomeEmpresa}
          tipoAcao={composer.tipoAcao}
          textoInicial={composer.texto}
          processando={acaoEmAndamento === composer.empresaId}
          onCancelar={() => setComposer(null)}
          onEnviar={(texto, canal) => executarAcao(composer.empresaId, composer.tipoAcao, composer.nomeEmpresa, texto, canal)}
        />
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
    <div className="min-h-[252px] rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink-100">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Skeleton className="h-14 w-14 rounded-2xl" />
          <div className="space-y-2 pt-1">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-5 w-32 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
      <Skeleton className="mt-5 h-20 w-full rounded-xl" />
      <div className="mt-4 flex justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-28 rounded-lg" />
      </div>
    </div>
  );
}
