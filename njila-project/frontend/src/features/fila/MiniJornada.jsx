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
 * A jornada como trilha de jogo: nós com ícone, o atual maior e destacado.
 * Sem rótulos — o nome da etapa fica no `title` de cada nó (tooltip +
 * acessibilidade). Derivada do `momento`; sem etapa associada, não renderiza.
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
                  "h-0.5 flex-1",
                  indice <= atual ? "bg-leaf-300" : "bg-ink-200"
                )}
              />
            )}
            <span
              title={t(etapa.i18nKey)}
              className={cn(
                "flex shrink-0 items-center justify-center rounded-full transition-all",
                agora
                  ? "h-8 w-8 bg-leaf-600 text-white ring-4 ring-leaf-100"
                  : "h-6 w-6",
                passou && "bg-leaf-500 text-white",
                !passou && !agora && "border border-ink-200 bg-white text-ink-300"
              )}
            >
              <Icone size={agora ? 15 : 12} />
            </span>
          </div>
        );
      })}
    </div>
  );
}
