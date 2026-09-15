import { useTranslation } from "react-i18next";
import { cn } from "../../lib/cn";
import { ETAPAS, etapaAtual, indiceEtapa } from "../../domain/jornada";

/**
 * Trilha das etapas da jornada, com a etapa atual marcada. Derivada do
 * `momento`; se o momento não tiver etapa associada (ex.: era_ativa_sumiu),
 * não renderiza nada.
 */
export function MiniJornada({ momento, className }) {
  const { t } = useTranslation();
  const etapaId = etapaAtual(momento);
  if (!etapaId) return null;

  const atual = indiceEtapa(etapaId);

  return (
    <div className={cn("grid grid-cols-6 gap-1", className)}>
      {ETAPAS.map((etapa, indice) => {
        const passou = indice < atual;
        const agora = indice === atual;
        return (
          <div key={etapa.id} className="flex flex-col items-center gap-1.5">
            <div className="flex w-full items-center">
              <span
                className={cn(
                  "h-0.5 flex-1",
                  indice === 0 ? "bg-transparent" : passou || agora ? "bg-brand-300" : "bg-ink-200"
                )}
              />
              <span
                className={cn(
                  "h-2.5 w-2.5 shrink-0 rounded-full transition",
                  agora
                    ? "bg-brand-600 ring-4 ring-brand-100"
                    : passou
                      ? "bg-brand-500"
                      : "bg-ink-200"
                )}
              />
              <span
                className={cn(
                  "h-0.5 flex-1",
                  indice === ETAPAS.length - 1
                    ? "bg-transparent"
                    : passou
                      ? "bg-brand-300"
                      : "bg-ink-200"
                )}
              />
            </div>
            <span
              className={cn(
                "text-center text-[10px] leading-none",
                agora ? "font-bold text-ink-800" : passou ? "text-ink-500" : "text-ink-400"
              )}
            >
              {t(etapa.i18nKey)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
