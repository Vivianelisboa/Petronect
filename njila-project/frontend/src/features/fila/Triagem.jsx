import { useTranslation } from "react-i18next";
import { cn } from "../../lib/cn";
import { SITUACOES_TRIAGEM, getSituacao } from "../../domain/situacao";

/** 
 * Filtros em estilo segmentado — compactos e refinados.
 */
export function Triagem({ valor, onSelecionar }) {
  const { t } = useTranslation();
  const opcoes = ["todos", ...SITUACOES_TRIAGEM];

  return (
    <div
      role="tablist"
      aria-label={t("fila.coluna_situacao")}
      className="inline-flex flex-wrap gap-1"
    >
      {opcoes.map((opcao) => {
        const rotulo = opcao === "todos" ? t("fila.todos") : t(getSituacao(opcao).i18nKey);
        const ativo = valor === opcao;
        return (
          <button
            key={opcao}
            role="tab"
            aria-selected={ativo}
            onClick={() => onSelecionar(opcao)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
              ativo 
                ? "bg-ink-900 text-white" 
                : "text-ink-500 hover:bg-ink-100 hover:text-ink-800"
            )}
          >
            {rotulo}
          </button>
        );
      })}
    </div>
  );
}
