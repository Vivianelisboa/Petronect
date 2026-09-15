import { AlertTriangle, CheckCircle2, Clock, Headset } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "../../lib/cn";

const ITENS_CONFIG = [
  { 
    id: "criticos", 
    tom: "danger",
    cor: "text-red-600",
    bg: "bg-red-50",
    bgHover: "hover:bg-red-100",
    barra: "bg-red-500",
    icone: AlertTriangle,
    rotuloKey: "fila.resumo.criticos"
  },
  { 
    id: "pendente", 
    tom: "warning",
    cor: "text-amber-600",
    bg: "bg-amber-50",
    bgHover: "hover:bg-amber-100",
    barra: "bg-amber-500",
    icone: Clock,
    rotuloKey: "fila.resumo.pendente"
  },
  { 
    id: "em_atendimento", 
    tom: "info",
    cor: "text-sky-600",
    bg: "bg-sky-50",
    bgHover: "hover:bg-sky-100",
    barra: "bg-sky-500",
    icone: Headset,
    rotuloKey: "fila.resumo.em_atendimento"
  },
  { 
    id: "resolvido", 
    tom: "success",
    cor: "text-brand-600",
    bg: "bg-brand-50",
    bgHover: "hover:bg-brand-100",
    barra: "bg-brand-500",
    icone: CheckCircle2,
    rotuloKey: "fila.resumo.resolvido"
  },
];

/**
 * Painel de missão: filtros gamificados como cards de contador.
 * Cada item é um card colorido com ícone, número e barra de progresso.
 */
export function ResumoFila({ contagens, total, ativo, onSelecionar }) {
  const { t } = useTranslation();

  const concluidas = contagens.resolvido;
  const percentual = total > 0 ? Math.round((concluidas / total) * 100) : 100;

  return (
    <div className="space-y-4">
      {/* Cards de filtro */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {ITENS_CONFIG.map((config) => {
          const valor = contagens[config.id];
          const selecionado = ativo === config.id;
          const Icone = config.icone;

          return (
            <button
              key={config.id}
              onClick={() => onSelecionar(config.id)}
              aria-pressed={selecionado}
              className={cn(
                "relative overflow-hidden rounded-2xl p-4 text-left transition-all duration-200",
                config.bg,
                config.bgHover,
                selecionado 
                  ? "ring-2 ring-offset-2 ring-ink-900 scale-[1.02] shadow-md" 
                  : "hover:shadow-sm"
              )}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg bg-white/80", config.cor)}>
                  <Icone size={18} strokeWidth={2.5} />
                </span>
                <span className={cn("text-3xl font-bold tabular-nums leading-none", config.cor)}>
                  {valor}
                </span>
              </div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-ink-500">
                {t(config.rotuloKey)}
              </span>
              
              {/* Barra de progresso do filtro quando ativo */}
              {selecionado && (
                <div className="absolute bottom-0 left-0 right-0 h-1">
                  <div className={cn("h-full", config.barra)} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Barra da meta */}
      <div className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">{t("fila.meta")}</span>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink-100">
          <div
            className="h-full rounded-full bg-brand-500 transition-all duration-700 ease-out"
            style={{ width: `${percentual}%` }}
          />
        </div>
        <span className="text-xs font-bold tabular-nums text-ink-700">
          {concluidas}/{total}
        </span>
        {percentual === 100 && concluidas > 0 && (
          <span className="text-xs font-bold text-brand-600">Meta atingida</span>
        )}
      </div>
    </div>
  );
}
