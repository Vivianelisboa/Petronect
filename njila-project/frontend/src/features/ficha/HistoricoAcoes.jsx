import { useTranslation } from "react-i18next";
import { History } from "lucide-react";
import { EmptyState } from "../../design/ui/EmptyState";
import { ACOES } from "../../domain/acoes";
import { getMomento } from "../../domain/momentos";
import { getCanal } from "../../domain/eventos";

/** Histórico das intervenções já registradas pelo time nessa empresa. */
export function HistoricoAcoes({ acoes }) {
  const { t } = useTranslation();

  if (!acoes?.length) {
    return <EmptyState icon={History} title={t("ficha.sem_acoes")} />;
  }

  return (
    <ul className="space-y-2">
      {acoes.map((acao) => {
        const rotuloAcao = ACOES[acao.tipo_acao];
        const rotuloCanal = getCanal(acao.canal);
        const rotuloMomento = getMomento(acao.momento_no_momento);

        return (
          <li key={acao.acao_id} className="rounded-xl bg-surface-50 p-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-semibold text-ink-800">
                {rotuloAcao ? t(rotuloAcao) : acao.tipo_acao}
              </span>
              <time className="text-xs tabular-nums text-ink-400">{acao.registrado_em}</time>
            </div>

            <p className="mt-1 text-xs text-ink-500">
              {rotuloCanal ? t(rotuloCanal) : acao.canal}
              {rotuloMomento?.i18nKey && <> · {t(rotuloMomento.i18nKey)}</>}
            </p>

            {acao.mensagem_enviada && (
              <p className="mt-2 border-l-2 border-ink-200 pl-2.5 text-xs italic text-ink-500">
                {acao.mensagem_enviada}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
