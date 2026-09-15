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
 * Card-caso: uma unidade de decisão com linguagem de missão,
 * mas hierarquia e ações próprias de um produto corporativo.
 */
export function CardCaso({ item, saindo = false, onVerFicha, onAcao }) {
  const { t } = useTranslation();
  const [menuAberto, setMenuAberto] = useState(false);

  const momento = getMomento(item.momento);
  const situacao = getSituacao(item.situacao);
  const primaria = acaoPrimaria(item.momento);
  const detalhes = `${t("fila.ultimo_acesso")}: ${item.ultimo_acesso} · ${t("fila.parado_ha_dias", { count: item.dias_parado })}`;

  return (
    <article
      title={detalhes}
      className={cn(
        "group flex min-h-[278px] flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink-100/80 transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-lg hover:ring-ink-200",
        saindo && "scale-[0.98] opacity-0"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <IconTile
            icon={iconeDoMomento(item.momento)}
            variant={momento.variante}
            size={21}
            className="h-14 w-14 rounded-2xl"
          />
          <div className="min-w-0 pt-0.5">
            <h3 className="truncate text-base font-bold tracking-tight text-ink-900">{item.nome_empresa}</h3>
            <p className="mt-1 truncate text-xs text-ink-500">{item.segmento}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Badge variant={momento.variante}>{t(momento.i18nKey)}</Badge>
              <Badge variant={situacao.variante}>{t(situacao.i18nKey)}</Badge>
            </div>
          </div>
        </div>
        <PriorityRing score={item.score} size={52} />
      </div>

      <div className="mt-5 rounded-xl bg-surface-50 px-3 py-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-ink-400">Jornada</span>
          <span className="text-[10px] font-medium text-ink-400">{item.dias_parado}d sem retorno</span>
        </div>
        <MiniJornada momento={item.momento} />
      </div>

      {item.score_explicacao && (
        <p className="mt-3 flex min-h-[32px] items-start gap-1.5 text-xs leading-relaxed text-ink-500">
          <Info size={13} className="mt-0.5 shrink-0 text-ink-300" />
          <span className="line-clamp-2">{item.score_explicacao}</span>
        </p>
      )}

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-ink-100 pt-4">
        <p className="min-w-0 truncate text-xs text-ink-500">
          <span className="text-ink-400">Próximo: </span>
          <span className="font-semibold text-ink-700">{item.acao_recomendada}</span>
        </p>

        <div className="flex shrink-0 items-center gap-1.5">
          {primaria && (
            <Button size="sm" onClick={() => onAcao(item.empresa_id, primaria, item.nome_empresa)}>
              {t(ACOES[primaria])}
            </Button>
          )}
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
                <div className="absolute bottom-full right-0 z-20 mb-1 w-56 overflow-hidden rounded-xl border border-ink-100 bg-white py-1 shadow-lg">
                  {ACOES_FILA.map((tipo) => (
                    <button
                      key={tipo}
                      onClick={() => {
                        setMenuAberto(false);
                        onAcao(item.empresa_id, tipo, item.nome_empresa);
                      }}
                      className={cn(
                        "block w-full px-3 py-2 text-left text-sm text-ink-700 transition-colors hover:bg-surface-50",
                        tipo === primaria && "text-ink-300"
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
      </div>
    </article>
  );
}
