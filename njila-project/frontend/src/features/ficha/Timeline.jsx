import { useTranslation } from "react-i18next";
import { Clock } from "lucide-react";
import { EmptyState } from "../../design/ui/EmptyState";

/** Linha do tempo da jornada: cada evento de navegação da empresa no Portal. */
export function Timeline({ eventos }) {
  const { t } = useTranslation();

  if (!eventos?.length) {
    return <EmptyState icon={Clock} title={t("ficha.sem_eventos")} />;
  }

  return (
    <ol className="relative space-y-4 border-l-2 border-brand-200 pl-5">
      {eventos.map((evento, indice) => (
        <li key={indice} className="relative">
          <span className="absolute -left-[26px] top-1 h-2.5 w-2.5 rounded-full bg-brand-500 ring-4 ring-white" />
          <time className="text-xs text-slate-400">{evento.timestamp}</time>
          <p className="text-sm text-ink-800">
            <span className="font-medium">{evento.acao}</span>
            {evento.pagina && <span className="text-slate-500"> — {evento.pagina}</span>}
            {evento.oportunidade_id && (
              <span className="text-slate-400"> (oportunidade {evento.oportunidade_id})</span>
            )}
          </p>
        </li>
      ))}
    </ol>
  );
}
