import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, UserX } from "lucide-react";
import { useEmpresa } from "../../hooks/useEmpresa";
import { registrarAcao } from "../../services/endpoints";
import { ACOES, ACOES_FICHA, CANAL_PADRAO } from "../../domain/acoes";
import { getMomento } from "../../domain/momentos";
import { Badge } from "../../design/ui/Badge";
import { Button } from "../../design/ui/Button";
import { Card, CardBody, CardHeader } from "../../design/ui/Card";
import { EmptyState } from "../../design/ui/EmptyState";
import { ScorePill } from "../../design/ui/ScorePill";
import { Spinner } from "../../design/ui/Spinner";
import { Timeline } from "./Timeline";
import { HistoricoAcoes } from "./HistoricoAcoes";

/** Ficha completa de uma empresa: classificação, jornada e ações. */
export function FichaEmpresaPage() {
  const { empresaId } = useParams();
  const { t } = useTranslation();
  const { empresa, carregando, recarregar } = useEmpresa(empresaId);

  async function handleAcao(tipoAcao) {
    await registrarAcao(empresaId, {
      tipo_acao: tipoAcao,
      canal: CANAL_PADRAO,
      mensagem_enviada: t(ACOES[tipoAcao]),
    });
    recarregar();
  }

  if (carregando) {
    return (
      <div className="p-6">
        <Spinner label={t("comum.carregando")} />
      </div>
    );
  }

  if (!empresa) {
    return (
      <div className="p-6">
        <EmptyState icon={UserX} title={t("ficha.nao_encontrada")} />
      </div>
    );
  }

  const { classificacao } = empresa;
  const momento = classificacao ? getMomento(classificacao.momento) : null;

  return (
    <section className="mx-auto max-w-3xl p-6">
      <Link
        to="/"
        className="mb-4 inline-flex items-center gap-1 text-sm text-ink-600 hover:text-ink-800"
      >
        <ArrowLeft size={14} />
        {t("ficha.voltar")}
      </Link>

      <header className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-ink-800">{empresa.nome_empresa}</h2>
          <p className="text-sm text-slate-500">
            {empresa.cnpj_mascarado} · {empresa.segmento}
          </p>
        </div>
        {classificacao && (
          <div className="flex flex-col items-end gap-2">
            <ScorePill score={classificacao.score} />
            {momento && <Badge variant={momento.variante}>{t(momento.i18nKey)}</Badge>}
          </div>
        )}
      </header>

      {classificacao && (
        <p className="mt-4 rounded-lg bg-ink-50 p-4 text-sm text-ink-800">
          {classificacao.score_explicacao}
        </p>
      )}

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

      <div className="mt-4 flex flex-wrap gap-2">
        {ACOES_FICHA.map((tipoAcao) => (
          <Button key={tipoAcao} variant="secondary" onClick={() => handleAcao(tipoAcao)}>
            {t(ACOES[tipoAcao])}
          </Button>
        ))}
      </div>
    </section>
  );
}
