import { useTranslation } from "react-i18next";
import { cn } from "../../lib/cn";
import { SITUACOES_TRIAGEM, getSituacao } from "../../domain/situacao";

/** Controle segmentado por Situação, com "Todos" à frente. */
export function Triagem({ valor, onSelecionar }) {
  const { t } = useTranslation();
  const opcoes = ["todos", ...SITUACOES_TRIAGEM];

  return (
    <div
      role="tablist"
      aria-label={t("fila.coluna_situacao")}
      className="inline-flex flex-wrap gap-1 rounded-full border border-ink-200 bg-white p-1"
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
              "rounded-full px-3 py-1.5 text-sm transition",
              ativo ? "bg-ink-900 text-white" : "text-ink-600 hover:bg-ink-50"
            )}
          >
            {rotulo}
          </button>
        );
      })}
    </div>
  );
}
