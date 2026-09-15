import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Clock, Info, MoreHorizontal, Timer } from "lucide-react";
import { Badge } from "../../design/ui/Badge";
import { Button } from "../../design/ui/Button";
import { PriorityMeter } from "../../design/ui/PriorityMeter";
import { cn } from "../../lib/cn";
import { getMomento } from "../../domain/momentos";
import { getSituacao } from "../../domain/situacao";
import { ACOES, ACOES_FILA, acaoPrimaria } from "../../domain/acoes";
import { MiniJornada } from "./MiniJornada";

/**
 * Card-caso da Fila: a unidade de decisão. Mostra quem é, por que está aqui
 * (prioridade + evidência), onde parou na jornada e o próximo passo — com uma
 * ação primária e as demais atrás do menu.
 */
export function CardCaso({ item, onVerFicha, onAcao }) {
  const { t } = useTranslation();
  const [menuAberto, setMenuAberto] = useState(false);

  const momento = getMomento(item.momento);
  const situacao = getSituacao(item.situacao);
  const primaria = acaoPrimaria(item.momento);

  return (
    <article className="rounded-xl border border-ink-200 bg-white p-5 shadow-card transition-colors hover:border-ink-300">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-bold text-ink-900">{item.nome_empresa}</h3>
          <p className="mt-0.5 text-xs text-ink-500">
            {item.segmento} · {item.empresa_id}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap justify-end gap-2">
          <Badge variant={momento.variante}>
            {momento.i18nKey ? t(momento.i18nKey) : item.momento}
          </Badge>
          <Badge variant={situacao.variante}>
            {situacao.i18nKey ? t(situacao.i18nKey) : item.situacao}
          </Badge>
        </div>
      </header>

      <div className="mt-4">
        <PriorityMeter score={item.score} />
        {item.score_explicacao && (
          <p className="mt-2 flex items-start gap-1.5 text-sm text-ink-600">
            <Info size={14} className="mt-0.5 shrink-0 text-ink-400" />
            <span>{item.score_explicacao}</span>
          </p>
        )}
      </div>

      <MiniJornada momento={item.momento} className="mt-4" />

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-500">
        <span className="inline-flex items-center gap-1.5">
          <Clock size={12} /> {t("fila.ultimo_acesso")}: {item.ultimo_acesso}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Timer size={12} /> {t("fila.parado_ha_dias", { count: item.dias_parado })}
        </span>
      </div>

      <footer className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-ink-100 pt-4">
        <p className="min-w-0 text-sm text-ink-600">
          <span className="text-ink-400">{t("fila.proximo_passo")}: </span>
          <span className="font-medium text-ink-800">{item.acao_recomendada}</span>
        </p>

        <div className="flex shrink-0 items-center gap-2">
          {primaria && (
            <Button size="sm" onClick={() => onAcao(item.empresa_id, primaria)}>
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
                        onAcao(item.empresa_id, tipo);
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
