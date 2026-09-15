import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Info, MoreHorizontal } from "lucide-react";
import { Badge } from "../../design/ui/Badge";
import { Button } from "../../design/ui/Button";
import { IconTile } from "../../design/ui/IconTile";
import { PriorityRing } from "../../design/ui/PriorityRing";
import { cn } from "../../lib/cn";
import { getMomento } from "../../domain/momentos";
import { getSituacao } from "../../domain/situacao";
import { ACOES, ACOES_FILA, acaoPrimaria } from "../../domain/acoes";
import { iconeDoMomento } from "./iconesMomento";
import { MiniJornada } from "./MiniJornada";

/**
 * Card-caso: a unidade de decisão, no formato de jogo — ícone do momento,
 * anel de prioridade, trilha da jornada e uma ação primária. A evidência fica
 * em uma linha; o último acesso e o tempo parado, no tooltip do card.
 */
export function CardCaso({ item, saindo = false, onVerFicha, onAcao }) {
  const { t } = useTranslation();
  const [menuAberto, setMenuAberto] = useState(false);

  const momento = getMomento(item.momento);
  const situacao = getSituacao(item.situacao);
  const primaria = acaoPrimaria(item.momento);
  const detalhes = `${t("fila.ultimo_acesso")}: ${item.ultimo_acesso} · ${t("fila.parado_ha_dias", {
    count: item.dias_parado,
  })}`;

  return (
    <article
      title={detalhes}
      className={cn(
        "rounded-xl border bg-white p-4 shadow-card transition-all duration-300",
        saindo ? "scale-95 opacity-0" : "border-ink-200 hover:border-ink-300"
      )}
    >
      <header className="flex items-start gap-3.5">
        <IconTile icon={iconeDoMomento(item.momento)} variant={momento.variante} />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-base font-bold text-ink-900">{item.nome_empresa}</h3>
              <p className="mt-0.5 text-xs text-ink-500">{item.segmento}</p>
            </div>
            <PriorityRing score={item.score} />
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant={momento.variante}>
              {momento.i18nKey ? t(momento.i18nKey) : item.momento}
            </Badge>
            <Badge variant={situacao.variante}>
              {situacao.i18nKey ? t(situacao.i18nKey) : item.situacao}
            </Badge>
          </div>
        </div>
      </header>

      <MiniJornada momento={item.momento} className="mt-4" />

      {item.score_explicacao && (
        <p className="mt-3 flex items-start gap-1.5 text-xs leading-relaxed text-ink-500">
          <Info size={13} className="mt-0.5 shrink-0 text-ink-400" />
          <span>{item.score_explicacao}</span>
        </p>
      )}

      <footer className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-ink-100 pt-3">
        <p className="min-w-0 truncate text-xs text-ink-500">
          <span className="text-ink-400">{t("fila.proximo_passo")}: </span>
          <span className="font-medium text-ink-800">{item.acao_recomendada}</span>
        </p>

        <div className="flex shrink-0 items-center gap-2">
          {primaria && (
            <Button size="sm" onClick={() => onAcao(item.empresa_id, primaria, item.nome_empresa)}>
              {t(ACOES[primaria])}
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={() => onVerFicha(item.empresa_id)}>
            {t("comum.ver_ficha")}
          </Button>

          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              aria-label={t("fila.mais_acoes")}
              aria-expanded={menuAberto}
              onClick={() => setMenuAberto((aberto) => !aberto)}
            >
              <MoreHorizontal size={16} />
            </Button>

            {menuAberto && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuAberto(false)} />
                <div className="absolute right-0 z-20 mt-1 w-56 overflow-hidden rounded-lg border border-ink-200 bg-white py-1 shadow-lg">
                  {ACOES_FILA.map((tipo) => (
                    <button
                      key={tipo}
                      onClick={() => {
                        setMenuAberto(false);
                        onAcao(item.empresa_id, tipo, item.nome_empresa);
                      }}
                      className={cn(
                        "block w-full px-3 py-2 text-left text-sm text-ink-700 hover:bg-ink-50",
                        tipo === primaria && "text-ink-400"
                      )}
                    >
                      {t(ACOES[tipo])}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </footer>
    </article>
  );
}
