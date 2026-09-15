import { useTranslation } from "react-i18next";
import { History } from "lucide-react";
import { EmptyState } from "../../design/ui/EmptyState";

/** Histórico das intervenções já registradas pelo time nessa empresa. */
export function HistoricoAcoes({ acoes }) {
  const { t } = useTranslation();

  if (!acoes?.length) {
    return <EmptyState icon={History} title={t("ficha.sem_acoes")} />;
  }

  return (
    <ul className="space-y-2">
      {acoes.map((acao) => (
        <li key={acao.acao_id} className="rounded-md border border-slate-200 p-3 text-sm">
          <span className="font-medium text-ink-800">{acao.tipo_acao}</span>
          <span className="text-slate-500">
            {" "}
            · {acao.canal} · {acao.registrado_em}
          </span>
          {acao.mensagem_enviada && (
            <p className="mt-1 italic text-slate-500">"{acao.mensagem_enviada}"</p>
          )}
        </li>
      ))}
    </ul>
  );
}
