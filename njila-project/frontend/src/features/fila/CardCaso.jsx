import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowUpRight, Info, MoreHorizontal, X } from "lucide-react";
import { Badge } from "../../design/ui/Badge";
import { Button } from "../../design/ui/Button";
import { IconTile } from "../../design/ui/IconTile";
import { PriorityRing } from "../../design/ui/PriorityRing";
import { Tooltip } from "../../design/ui/Tooltip";
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
  const [previewAberto, setPreviewAberto] = useState(false);

  const momento = getMomento(item.momento);
  const situacao = getSituacao(item.situacao);
  const primaria = acaoPrimaria(item.momento);
  const detalhes = `${t("fila.ultimo_acesso")}: ${item.ultimo_acesso} · ${t("fila.parado_ha_dias", { count: item.dias_parado })}`;

  return (
    <>
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
        </div>
        <MiniJornada momento={item.momento} />
      </div>

      <div className="mt-3 flex items-center justify-between">
        {item.score_explicacao ? (
          <Tooltip label={item.score_explicacao}>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700">
              <Info size={14} />
            </span>
          </Tooltip>
        ) : <span />}
        <span className="text-[11px] text-ink-400">{item.dias_parado}d sem retorno</span>
      </div>

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
          <Button variant="ghost" size="sm" onClick={() => setPreviewAberto(true)}>
            Ver detalhes
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
      {previewAberto && (
        <EmpresaPreview
          item={item}
          momento={momento}
          situacao={situacao}
          primaria={primaria}
          onClose={() => setPreviewAberto(false)}
          onVerFicha={() => onVerFicha(item.empresa_id)}
          onAcao={() => onAcao(item.empresa_id, primaria, item.nome_empresa)}
          t={t}
        />
      )}
    </>
  );
}

function EmpresaPreview({ item, momento, situacao, primaria, onClose, onVerFicha, onAcao, t }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-ink-950/35 p-4 backdrop-blur-[2px]" role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`empresa-preview-${item.empresa_id}`}
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-700">Prévia da empresa</p>
            <h2 id={`empresa-preview-${item.empresa_id}`} className="mt-1 text-xl font-bold tracking-tight text-ink-900">
              {item.nome_empresa}
            </h2>
            <p className="mt-1 text-sm text-ink-500">{item.segmento}</p>
          </div>
          <button
            type="button"
            aria-label="Fechar prévia"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-400 transition-colors hover:bg-surface-50 hover:text-ink-800"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 flex items-center justify-between rounded-xl bg-surface-50 p-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant={momento.variante}>{t(momento.i18nKey)}</Badge>
            <Badge variant={situacao.variante}>{t(situacao.i18nKey)}</Badge>
          </div>
          <PriorityRing score={item.score} size={56} />
        </div>

        {item.score_explicacao && (
          <p className="mt-4 flex gap-2 text-sm leading-relaxed text-ink-600">
            <Info size={15} className="mt-0.5 shrink-0 text-ink-400" />
            {item.score_explicacao}
          </p>
        )}

        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-surface-50 p-3">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-ink-400">Último acesso</span>
            <span className="mt-1 block font-semibold text-ink-800">{item.ultimo_acesso}</span>
          </div>
          <div className="rounded-lg bg-surface-50 p-3">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-ink-400">Próximo passo</span>
            <span className="mt-1 block font-semibold text-ink-800">{item.acao_recomendada}</span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-ink-100 pt-4">
          <Button variant="ghost" size="sm" onClick={onVerFicha}>
            Abrir ficha completa <ArrowUpRight size={14} />
          </Button>
          {primaria && (
            <Button size="sm" onClick={onAcao}>
              {t(ACOES[primaria])}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
