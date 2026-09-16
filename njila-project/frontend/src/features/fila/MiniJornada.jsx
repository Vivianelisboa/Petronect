import { useTranslation } from "react-i18next";
import { ClipboardList, CreditCard, FileText, Home, Search, Trophy } from "lucide-react";
import { cn } from "../../lib/cn";
import { ETAPAS, etapaAtual, indiceEtapa } from "../../domain/jornada";

const ICONES = {
  acessou: Home,
  buscou: Search,
  abriu: FileText,
  cadastro: ClipboardList,
  taxa: CreditCard,
  concluiu: Trophy,
};

/**
 * Trilha da jornada ultra-compacta.
 * Nós pequenos, conectores finos, sem texto — só o visual.
 */
export function MiniJornada({ momento, className }) {
  const { t } = useTranslation();
  const etapaId = etapaAtual(momento);
  if (!etapaId) return null;

  const atual = indiceEtapa(etapaId);

  return (
    <div className={cn("flex items-center", className)}>
      {ETAPAS.map((etapa, indice) => {
        const Icone = ICONES[etapa.id];
        const passou = indice < atual;
        const agora = indice === atual;

        return (
          <div key={etapa.id} className="flex flex-1 items-center last:flex-none">
            {indice > 0 && (
              <span
                className={cn(
                  "h-[2px] flex-1",
                  indice <= atual ? "bg-brand-400" : "bg-ink-100"
                )}
              />
            )}
            <span
              title={t(etapa.i18nKey)}
              className={cn(
                "flex shrink-0 items-center justify-center rounded-full transition-all",
                agora
                  ? "h-7 w-7 bg-brand-600 text-white shadow-sm"
                  : "h-5 w-5",
                passou && "bg-brand-500 text-white",
                !passou && !agora && "border-2 border-ink-200 bg-white text-ink-300"
              )}
            >
              <Icone size={agora ? 14 : 10} strokeWidth={2.5} />
            </span>
          </div>
        );
      })}
    </div>
  );
}
