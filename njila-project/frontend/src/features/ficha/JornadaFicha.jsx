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
 * Jornada completa na Ficha: as seis etapas do caminho do fornecedor, com o
 * nome de cada uma e a etapa atual destacada — o padrão de "path" dos
 * produtos operacionais.
 *
 * A linha tem altura fixa para que os conectores permaneçam alinhados mesmo
 * com o nó atual maior que os demais.
 */
export function JornadaFicha({ momento }) {
  const { t } = useTranslation();
  const etapaId = etapaAtual(momento);
  if (!etapaId) return null;

  const atual = indiceEtapa(etapaId);

  return (
    <ol className="grid grid-cols-3 gap-x-2 gap-y-4 sm:flex sm:min-w-[560px]">
      {ETAPAS.map((etapa, indice) => {
        const Icone = ICONES[etapa.id];
        const passou = indice < atual;
        const agora = indice === atual;
        const primeira = indice === 0;
        const ultima = indice === ETAPAS.length - 1;

         return (
           <li key={etapa.id} className="flex flex-col items-center sm:flex-1">
             <div className="flex h-11 w-full items-center justify-center sm:justify-normal">
               <span
                 className={cn(
                   "hidden h-[3px] flex-1 rounded-full sm:block",
                  primeira ? "bg-transparent" : indice <= atual ? "bg-brand-400" : "bg-ink-100"
                )}
              />
               <span
                className={cn(
                  "flex shrink-0 items-center justify-center rounded-full transition-all",
                  agora
                    ? "h-10 w-10 bg-brand-600 text-white shadow-sm ring-4 ring-brand-100"
                    : "h-8 w-8",
                  passou && "bg-brand-500 text-white",
                  !passou && !agora && "border-2 border-ink-200 bg-white text-ink-300"
                )}
              >
                <Icone size={agora ? 18 : 15} strokeWidth={2.3} />
              </span>
               <span
                 className={cn(
                   "hidden h-[3px] flex-1 rounded-full sm:block",
                  ultima ? "bg-transparent" : indice < atual ? "bg-brand-400" : "bg-ink-100"
                )}
              />
            </div>
             <span
               className={cn(
                 "mt-2 max-w-[92px] text-center text-[11px] leading-tight",
                agora ? "font-bold text-brand-700" : "font-medium text-ink-500"
              )}
            >
              {t(etapa.i18nKey)}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
