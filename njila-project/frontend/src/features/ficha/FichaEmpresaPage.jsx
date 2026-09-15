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
import { PriorityRing } from "../../design/ui/PriorityRing";
import { Spinner } from "../../design/ui/Spinner";
import { Timeline } from "./Timeline";
import { HistoricoAcoes } from "./HistoricoAcoes";

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
      <div className="py-6">
        <Spinner label={t("comum.carregando")} />
      </div>
    );
  }

  if (!empresa) {
    return (
      <div className="py-6">
        <EmptyState icon={UserX} title={t("ficha.nao_encontrada")} />
      </div>
    );
  }

  const { classificacao } = empresa;
  const momento = classificacao ? getMomento(classificacao.momento) : null;

  return (
    <section className="mx-auto max-w-3xl">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-800"
      >
        <ArrowLeft size={14} />
        {t("ficha.voltar")}
      </Link>

      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">{empresa.nome_empresa}</h1>
          <p className="mt-1 text-sm text-ink-500">
            {empresa.cnpj_mascarado} · {empresa.segmento}
          </p>
        </div>
        {classificacao && (
          <div className="flex flex-col items-end gap-2">
            <PriorityRing score={classificacao.score} size={56} />
            {momento && <Badge variant={momento.variante}>{t(momento.i18nKey)}</Badge>}
          </div>
        )}
      </header>

      {classificacao && (
        <p className="mt-6 rounded-xl bg-surface-50 p-5 text-sm text-ink-800 leading-relaxed">
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

      <div className="mt-6 flex flex-wrap gap-2">
        {ACOES_FICHA.map((tipoAcao) => (
          <Button key={tipoAcao} variant="secondary" onClick={() => handleAcao(tipoAcao)}>
            {t(ACOES[tipoAcao])}
          </Button>
        ))}
      </div>
    </section>
  );
}
