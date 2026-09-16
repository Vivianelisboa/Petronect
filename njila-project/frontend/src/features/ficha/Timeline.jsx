import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CheckCircle2,
  ClipboardList,
  Clock,
  CreditCard,
  Dot,
  FileText,
  Home,
  RefreshCw,
  Search,
  Star,
} from "lucide-react";
import { cn } from "../../lib/cn";
import { Button } from "../../design/ui/Button";
import { EmptyState } from "../../design/ui/EmptyState";
import { getEvento, getPagina, EVENTOS_MARCO } from "../../domain/eventos";

const ICONES = {
  acessou_pagina_inicial: Home,
  buscou_oportunidades: Search,
  iniciou_cadastro: ClipboardList,
  abriu_oportunidade: FileText,
  demonstrou_interesse: Star,
  iniciou_pagamento_taxa: CreditCard,
  retornou_portal: RefreshCw,
  concluiu_acao: CheckCircle2,
};

const VISIVEIS_POR_PADRAO = 4;

function formatarDia(timestamp) {
  const data = new Date(timestamp.replace(" ", "T"));
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(data);
}

function formatarHora(timestamp) {
  return timestamp.slice(11, 16);
}

/** Agrupa eventos por dia, preservando a ordem recebida. */
function agruparPorDia(eventos) {
  return eventos.reduce((grupos, evento) => {
    const dia = evento.timestamp.slice(0, 10);
    const grupo = grupos.find((item) => item.dia === dia);
    if (grupo) {
      grupo.eventos.push(evento);
    } else {
      grupos.push({ dia, eventos: [evento] });
    }
    return grupos;
  }, []);
}

/**
 * Linha do tempo da jornada: mais recente primeiro, agrupada por dia e com
 * divulgação progressiva — evita que uma empresa antiga empurre a página.
 */
export function Timeline({ eventos }) {
  const { t } = useTranslation();
  const [expandido, setExpandido] = useState(false);

  if (!eventos?.length) {
    return <EmptyState icon={Clock} title={t("ficha.sem_eventos")} />;
  }

  const recentes = [...eventos].reverse();
  const visiveis = expandido ? recentes : recentes.slice(0, VISIVEIS_POR_PADRAO);
  const restantes = recentes.length - VISIVEIS_POR_PADRAO;
  const grupos = agruparPorDia(visiveis);

  return (
    <div>
      <div className={cn(expandido && "max-h-[26rem] overflow-y-auto pr-1")}>
        <div className="space-y-5">
          {grupos.map((grupo) => (
            <div key={grupo.dia}>
              <p className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-ink-400">
                {formatarDia(grupo.eventos[0].timestamp)}
              </p>

              <ol className="relative space-y-3 border-l-2 border-ink-100 pl-6">
                {grupo.eventos.map((evento, indice) => {
                  const Icone = ICONES[evento.acao] || Dot;
                  const marco = EVENTOS_MARCO.has(evento.acao);
                  const rotuloEvento = getEvento(evento.acao);
                  const rotuloPagina = getPagina(evento.pagina);
                  const paginaRepetida =
                    evento.pagina === "pagina_inicial" && evento.acao === "acessou_pagina_inicial";

                  return (
                    <li key={indice} className="relative">
                      <span
                        className={cn(
                          "absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full ring-4 ring-white",
                          marco ? "bg-brand-600 text-white" : "bg-ink-100 text-ink-500"
                        )}
                      >
                        <Icone size={11} strokeWidth={2.5} />
                      </span>

                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                        <time className="text-xs font-medium tabular-nums text-ink-400">
                          {formatarHora(evento.timestamp)}
                        </time>
                        <span className={cn("text-sm", marco ? "font-semibold text-ink-900" : "text-ink-700")}>
                          {rotuloEvento ? t(rotuloEvento) : evento.acao}
                        </span>
                      </div>

                      {(!paginaRepetida || evento.oportunidade_id) && (
                        <p className="mt-0.5 text-xs text-ink-400">
                          {!paginaRepetida && (rotuloPagina ? t(rotuloPagina) : evento.pagina)}
                          {evento.oportunidade_id && (
                            <span className={cn(!paginaRepetida && "ml-1")}>
                              · oportunidade {evento.oportunidade_id}
                            </span>
                          )}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </div>
      </div>

      {restantes > 0 && (
        <div className="mt-4 border-t border-ink-100 pt-4">
          <Button variant="ghost" size="sm" onClick={() => setExpandido((valor) => !valor)}>
            {expandido
              ? t("ficha.ver_menos")
              : t("ficha.ver_historico", { count: restantes })}
          </Button>
        </div>
      )}
    </div>
  );
}
