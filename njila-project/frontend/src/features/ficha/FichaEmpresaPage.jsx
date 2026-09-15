import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AlertTriangle, ArrowLeft, Info, MoreHorizontal, UserX } from "lucide-react";
import { useEmpresa } from "../../hooks/useEmpresa";
import { registrarAcao } from "../../services/endpoints";
import { ACOES, ACOES_FICHA, CANAL_PADRAO, acaoPrimaria } from "../../domain/acoes";
import { ACOES_COM_MENSAGEM, modeloDeMensagem } from "../../domain/mensagens";
import { getMomento } from "../../domain/momentos";
import { getSituacao } from "../../domain/situacao";
import { Badge } from "../../design/ui/Badge";
import { Button } from "../../design/ui/Button";
import { Card, CardBody, CardHeader } from "../../design/ui/Card";
import { EmptyState } from "../../design/ui/EmptyState";
import { PriorityRing } from "../../design/ui/PriorityRing";
import { Skeleton } from "../../design/ui/Skeleton";
import { ToastStack } from "../../design/ui/ToastStack";
import { Timeline } from "./Timeline";
import { HistoricoAcoes } from "./HistoricoAcoes";
import { JornadaFicha } from "./JornadaFicha";
import { ComposerMensagem } from "../../components/ComposerMensagem";

export function FichaEmpresaPage() {
  const { empresaId } = useParams();
  const { t } = useTranslation();
  const { empresa, carregando, erro, recarregar } = useEmpresa(empresaId);

  const [menuAberto, setMenuAberto] = useState(false);
  const [emAndamento, setEmAndamento] = useState("");
  const [toasts, setToasts] = useState([]);
  const [confirmandoResolucao, setConfirmandoResolucao] = useState(false);
  const [composer, setComposer] = useState(null);

  function dispararToast(texto) {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((atual) => [...atual, { id, texto }]);
    setTimeout(() => setToasts((atual) => atual.filter((toast) => toast.id !== id)), 3200);
  }

  async function executarAcao(tipoAcao, mensagem, canal) {
    if (emAndamento) return;
    setMenuAberto(false);
    setConfirmandoResolucao(false);
    setEmAndamento(tipoAcao);
    try {
      await registrarAcao(empresaId, {
        tipo_acao: tipoAcao,
        canal: canal || CANAL_PADRAO,
        mensagem_enviada: mensagem || t(ACOES[tipoAcao]),
      });
      setComposer(null);
      dispararToast(t("ficha.toast_acao", { acao: t(ACOES[tipoAcao]) }));
      recarregar();
    } catch {
      dispararToast(t("ficha.toast_erro"));
    } finally {
      setEmAndamento("");
    }
  }

  function aoEscolherAcao(tipoAcao) {
    if (tipoAcao === "marcar_resolvido") {
      setMenuAberto(false);
      setConfirmandoResolucao(true);
      return;
    }
    if (ACOES_COM_MENSAGEM.includes(tipoAcao)) {
      const chave = modeloDeMensagem(tipoAcao, classificacao?.momento);
      setMenuAberto(false);
      setComposer({ tipoAcao, texto: chave ? t(chave) : "" });
      return;
    }
    executarAcao(tipoAcao);
  }

  if (erro) {
    return (
      <section className="mx-auto max-w-3xl py-6">
        <EmptyState
          icon={AlertTriangle}
          title={t("ficha.erro_titulo")}
          description={t("ficha.erro_descricao")}
          action={
            <Button variant="secondary" size="sm" onClick={() => recarregar()}>
              {t("comum.tentar_de_novo")}
            </Button>
          }
        />
      </section>
    );
  }

  if (carregando) {
    return <FichaSkeleton />;
  }

  if (!empresa) {
    return (
      <section className="mx-auto max-w-3xl py-6">
        <EmptyState icon={UserX} title={t("ficha.nao_encontrada")} />
      </section>
    );
  }

  const { classificacao } = empresa;
  const momento = classificacao ? getMomento(classificacao.momento) : null;
  const situacao = getSituacao(empresa.situacao);
  const primaria = classificacao ? acaoPrimaria(classificacao.momento) : null;

  return (
    <section className="mx-auto max-w-4xl">
      <Link
        to="/"
        className="font-display mb-6 inline-flex items-center gap-1.5 text-sm font-normal text-ink-500 hover:text-ink-800"
      >
        <ArrowLeft size={14} />
        {t("ficha.voltar")}
      </Link>

      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-display truncate text-3xl font-normal tracking-[-0.035em] text-ink-900">
            {empresa.nome_empresa}
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            {empresa.cnpj_mascarado} · {empresa.segmento}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Badge variant={situacao.variante}>
              {situacao.i18nKey ? t(situacao.i18nKey) : empresa.situacao || "—"}
            </Badge>
            {momento?.i18nKey && <Badge variant={momento.variante}>{t(momento.i18nKey)}</Badge>}
          </div>
          {classificacao?.score_explicacao && (
            <p className="mt-3 flex items-start gap-1.5 text-xs leading-relaxed text-ink-500">
              <Info size={13} className="mt-0.5 shrink-0 text-ink-400" />
              <span>{classificacao.score_explicacao}</span>
            </p>
          )}
        </div>
        {classificacao && <PriorityRing score={classificacao.score} size={64} />}
      </header>

      {/* Jornada */}
      {classificacao && (
        <Card className="mt-6">
          <CardHeader>{t("ficha.jornada")}</CardHeader>
          <CardBody className="overflow-x-auto">
            <JornadaFicha momento={classificacao.momento} />
          </CardBody>
        </Card>
      )}

      {/* Faixa de fatos */}
      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Fato rotulo={t("ficha.fatos.ultimo_acesso")} valor={classificacao?.ultimo_acesso || "—"} />
        <Fato
          rotulo={t("ficha.fatos.dias_parado")}
          valor={t("ficha.dias_parado", { count: classificacao?.dias_parado ?? 0 })}
        />
        <Fato
          rotulo={t("ficha.fatos.oportunidades")}
          valor={String(empresa.oportunidades_visualizadas?.length ?? 0)}
        />
        <Fato rotulo={t("ficha.fatos.cadastro")} valor={empresa.data_cadastro_portal} />
      </div>

      {/* Próximo passo */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-brand-50 p-4 ring-1 ring-brand-100">
        <div className="min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700">
            {t("ficha.proximo_passo")}
          </span>
          <p className="mt-1 text-sm font-semibold text-brand-900">
            {classificacao?.acao_recomendada || t("ficha.nao_informado")}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {primaria && (
            <Button disabled={Boolean(emAndamento)} size="sm" onClick={() => aoEscolherAcao(primaria)}>
              {emAndamento === primaria ? t("comum.registrando") : t(ACOES[primaria])}
            </Button>
          )}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              disabled={Boolean(emAndamento)}
              aria-label={t("ficha.acoes")}
              aria-expanded={menuAberto}
              onClick={() => setMenuAberto((aberto) => !aberto)}
            >
              <MoreHorizontal size={16} />
            </Button>
            {menuAberto && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuAberto(false)} />
                <div className="absolute right-0 top-full z-20 mt-1 w-60 overflow-hidden rounded-xl border border-ink-100 bg-white py-1 shadow-lg">
                  {ACOES_FICHA.map((tipo) => (
                    <button
                      key={tipo}
                      onClick={() => aoEscolherAcao(tipo)}
                      className="block w-full px-3 py-2 text-left text-sm text-ink-700 transition-colors hover:bg-surface-50"
                    >
                      {t(ACOES[tipo])}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader>{t("ficha.linha_do_tempo")}</CardHeader>
        <CardBody>
          <Timeline eventos={empresa.timeline} />
        </CardBody>
      </Card>

      <Card className="mt-6">
        <CardHeader>{t("ficha.registro_acoes")}</CardHeader>
        <CardBody>
          <HistoricoAcoes acoes={empresa.historico_acoes} />
        </CardBody>
      </Card>

      {confirmandoResolucao && (
        <ConfirmarResolucao
          onCancelar={() => setConfirmandoResolucao(false)}
          onConfirmar={() => executarAcao("marcar_resolvido")}
          processando={emAndamento === "marcar_resolvido"}
        />
      )}

      {composer && (
        <ComposerMensagem
          empresa={empresa.nome_empresa}
          tipoAcao={composer.tipoAcao}
          textoInicial={composer.texto}
          processando={emAndamento === composer.tipoAcao}
          onCancelar={() => setComposer(null)}
          onEnviar={(texto, canal) => executarAcao(composer.tipoAcao, texto, canal)}
        />
      )}

      <ToastStack toasts={toasts} />
    </section>
  );
}

function Fato({ rotulo, valor }) {
  return (
    <div className="rounded-xl bg-white p-3.5 shadow-sm ring-1 ring-ink-100">
      <span className="block text-[10px] font-bold uppercase tracking-wider text-ink-400">
        {rotulo}
      </span>
      <span className="mt-1 block truncate text-sm font-semibold text-ink-800">{valor}</span>
    </div>
  );
}

function ConfirmarResolucao({ onCancelar, onConfirmar, processando }) {
  const { t } = useTranslation();

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-ink-950/35 p-4 backdrop-blur-[2px]"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && onCancelar()}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirmar-resolucao"
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
      >
        <h2 id="confirmar-resolucao" className="text-base font-bold text-ink-900">
          {t("ficha.confirmar_titulo")}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-500">{t("ficha.confirmar_texto")}</p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onCancelar}>
            {t("ficha.cancelar")}
          </Button>
          <Button size="sm" disabled={processando} onClick={onConfirmar}>
            {processando ? t("comum.registrando") : t("ficha.confirmar")}
          </Button>
        </div>
      </div>
    </div>
  );
}

function FichaSkeleton() {
  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <Skeleton className="h-4 w-40" />
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-5 w-52 rounded-full" />
        </div>
        <Skeleton className="h-16 w-16 rounded-full" />
      </div>
      <Skeleton className="h-40 w-full rounded-2xl" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[0, 1, 2, 3].map((indice) => (
          <Skeleton key={indice} className="h-20 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-24 w-full rounded-2xl" />
      <Skeleton className="h-64 w-full rounded-2xl" />
    </section>
  );
}
