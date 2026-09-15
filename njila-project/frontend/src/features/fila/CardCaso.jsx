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

/**
 * Row-caso: layout em linha (estilo Linear/GitHub).
 * Compacto, escaneável, sem bordas — só divisores sutis.
 * Hover revela ações e destaca a linha.
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
        "group flex items-center gap-4 px-5 py-4 transition-all duration-150",
        "hover:bg-surface-50",
        saindo && "scale-[0.98] opacity-0"
      )}
    >
      {/* Ícone do momento */}
      <IconTile icon={iconeDoMomento(item.momento)} variant={momento.variante} size={16} />

      {/* Info principal */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-sm font-semibold text-ink-900">{item.nome_empresa}</h3>
          <Badge variant={momento.variante} className="hidden sm:inline-flex">{t(momento.i18nKey)}</Badge>
          <Badge variant={situacao.variante} className="hidden sm:inline-flex">{t(situacao.i18nKey)}</Badge>
        </div>
        <p className="mt-0.5 text-xs text-ink-400">{item.segmento} · {item.acao_recomendada}</p>
        
        {item.score_explicacao && (
          <p className="mt-1.5 flex items-start gap-1 text-xs text-ink-500">
            <Info size={12} className="mt-0.5 shrink-0 text-ink-300" />
            <span className="line-clamp-1">{item.score_explicacao}</span>
          </p>
        )}
      </div>

      {/* Prioridade + Ações (aparecem no hover) */}
      <div className="flex shrink-0 items-center gap-3">
        <PriorityRing score={item.score} size={40} />
        
        <div className="hidden items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100 sm:flex">
          {primaria && (
            <Button size="sm" onClick={() => onAcao(item.empresa_id, primaria, item.nome_empresa)}>
              {t(ACOES[primaria])}
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => onVerFicha(item.empresa_id)}>
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
                <div className="absolute right-0 top-full z-20 mt-1 w-56 overflow-hidden rounded-xl border border-ink-100 bg-white py-1 shadow-lg">
                  {ACOES_FILA.map((tipo) => (
                    <button
                      key={tipo}
                      onClick={() => {
                        setMenuAberto(false);
                        onAcao(item.empresa_id, tipo, item.nome_empresa);
                      }}
                      className={cn(
                        "block w-full px-3 py-2 text-left text-sm text-ink-700 hover:bg-surface-50 transition-colors",
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
