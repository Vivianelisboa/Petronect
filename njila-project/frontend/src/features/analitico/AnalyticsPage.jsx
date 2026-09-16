import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AlertTriangle, BellRing, Building2, Users } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useIndicadores } from "../../hooks/useIndicadores";
import { getEvento, getPagina } from "../../domain/eventos";
import { getMomento } from "../../domain/momentos";
import { Button } from "../../design/ui/Button";
import { Skeleton } from "../../design/ui/Skeleton";
import { cn } from "../../lib/cn";

const PERIODOS = [7, 30, 90];

const CORES = {
  linha: "#8DC63F",
  barra: "#8DC63F",
  grade: "rgba(255,255,255,0.08)",
  eixo: "#9DB0D6",
};

const ESTILO_TOOLTIP = {
  background: "#0B1640",
  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: 8,
  fontSize: 12,
  color: "#EDF1F5",
};

function formatarDia(dia) {
  const [, mes, d] = dia.split("-");
  return `${d}/${mes}`;
}

function formatarHora(timestamp) {
  return timestamp.slice(11, 16);
}

function Painel({ titulo, descricao, className, children }) {
  return (
    <section className={cn("rounded-2xl border border-white/10 bg-white/[.05] p-5", className)}>
      <h2 className="text-sm font-semibold text-white">{titulo}</h2>
      {descricao && <p className="mt-1 text-xs text-white/55">{descricao}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

/**
 * Visão analítica: como os fornecedores usam o Portal Petronect dentro do
 * período. Consome indicadores agregados do backend — nada é mock aqui.
 * Roda no azul profundo do Portal, o mesmo mundo do fornecedor.
 */
export function AnalyticsPage() {
  const { t } = useTranslation();
  const [periodo, setPeriodo] = useState(30);
  const { indicadores, carregando, erro, recarregar } = useIndicadores(periodo);

  const serie = (indicadores?.serie ?? []).map((ponto) => ({
    ...ponto,
    rotulo: formatarDia(ponto.dia),
  }));

  const kpis = [
    { id: "empresas", valor: indicadores?.kpis.empresas, icone: Building2 },
    { id: "eventos", valor: indicadores?.kpis.eventos, icone: Users },
    { id: "criticos", valor: indicadores?.kpis.criticos, icone: AlertTriangle, tom: "text-rose-300" },
    { id: "intervencoes", valor: indicadores?.kpis.intervencoes, icone: BellRing },
  ];

  const maxMomento = Math.max(1, ...(indicadores?.momentos ?? []).map((m) => m.total));

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-portal-lime">
            {t("analitico.titulo")}
          </p>
          <h1 className="font-display mt-2 text-3xl font-normal tracking-[-0.035em] text-white">
            {t("analitico.titulo")}
          </h1>
          <p className="mt-1 text-sm text-white/60">{t("analitico.subtitulo")}</p>
        </div>

        <div className="inline-flex gap-1 rounded-lg border border-white/15 bg-white/[.06] p-1">
          {PERIODOS.map((valor) => (
            <button
              key={valor}
              type="button"
              aria-pressed={periodo === valor}
              onClick={() => setPeriodo(valor)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                periodo === valor
                  ? "bg-portal-lime text-portal-950"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              {t("analitico.periodos." + valor)}
            </button>
          ))}
        </div>
      </header>

      {erro ? (
        <Painel titulo={t("analitico.erro")}>
          <Button variant="secondary" size="sm" onClick={() => recarregar()}>
            {t("comum.tentar_de_novo")}
          </Button>
        </Painel>
      ) : carregando ? (
        <AnaliticoSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {kpis.map((kpi) => {
              const Icone = kpi.icone;
              return (
                <div
                  key={kpi.id}
                  className="rounded-2xl border border-white/10 bg-white/[.05] p-4"
                >
                  <Icone size={16} className={cn("text-white/45", kpi.tom)} />
                  <p
                    className={cn(
                      "font-display mt-3 text-3xl font-normal tabular-nums leading-none",
                      kpi.tom || "text-white"
                    )}
                  >
                    {kpi.valor ?? 0}
                  </p>
                  <p className="mt-1.5 text-xs text-white/55">{t(`analitico.kpis.${kpi.id}`)}</p>
                </div>
              );
            })}
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Painel
              titulo={t("analitico.graficos.eventos")}
              descricao={t("analitico.graficos.eventos_desc")}
              className="lg:col-span-2"
            >
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={serie} margin={{ left: -20, right: 8, top: 8 }}>
                    <CartesianGrid stroke={CORES.grade} vertical={false} />
                    <XAxis
                      dataKey="rotulo"
                      stroke={CORES.eixo}
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      interval={periodo === 90 ? 12 : periodo === 30 ? 4 : 0}
                    />
                    <YAxis
                      stroke={CORES.eixo}
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      width={36}
                    />
                    <Tooltip contentStyle={ESTILO_TOOLTIP} labelStyle={{ color: "#9DB0D6" }} />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke={CORES.linha}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Painel>

            <Painel titulo={t("analitico.recentes.titulo")} descricao={t("analitico.recentes.desc")}>
              <ul className="space-y-3">
                {indicadores.recentes.map((evento, indice) => (
                  <li key={indice} className="border-l-2 border-portal-lime/40 pl-3 text-sm">
                    <p className="truncate text-white/90">{evento.nome_empresa}</p>
                    <p className="text-xs text-white/45">
                      {getEvento(evento.acao) ? t(getEvento(evento.acao)) : evento.acao}
                      {" · "}
                      {formatarHora(evento.timestamp)}
                    </p>
                  </li>
                ))}
              </ul>
            </Painel>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Painel
              titulo={t("analitico.graficos.areas")}
              descricao={t("analitico.graficos.areas_desc")}
            >
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={indicadores.areas.map((area) => ({
                      ...area,
                      rotulo: getPagina(area.area) ? t(getPagina(area.area)) : area.area,
                    }))}
                    margin={{ left: -20, right: 8, top: 8 }}
                  >
                    <CartesianGrid stroke={CORES.grade} vertical={false} />
                    <XAxis
                      dataKey="rotulo"
                      stroke={CORES.eixo}
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      interval={0}
                    />
                    <YAxis
                      stroke={CORES.eixo}
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      width={32}
                    />
                    <Tooltip
                      contentStyle={ESTILO_TOOLTIP}
                      labelStyle={{ color: "#9DB0D6" }}
                      cursor={{ fill: "rgba(141,198,63,0.08)" }}
                    />
                    <Bar dataKey="total" fill={CORES.barra} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Painel>

            <Painel titulo={t("analitico.momentos.titulo")} descricao={t("analitico.momentos.desc")}>
              <div className="space-y-4">
                {indicadores.momentos.map((item) => {
                  const momento = getMomento(item.momento);
                  const percentual = Math.round((item.total / maxMomento) * 100);
                  return (
                    <div key={item.momento}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="text-white/85">
                          {momento.i18nKey ? t(momento.i18nKey) : item.momento}
                        </span>
                        <span className="font-medium tabular-nums text-white/55">{item.total}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-portal-lime transition-all duration-700 ease-out"
                          style={{ width: `${percentual}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Painel>
          </div>
        </>
      )}
    </section>
  );
}

function AnaliticoSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[0, 1, 2, 3].map((indice) => (
          <Skeleton key={indice} className="h-24 rounded-2xl bg-white/10" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Skeleton className="h-80 rounded-2xl bg-white/10 lg:col-span-2" />
        <Skeleton className="h-80 rounded-2xl bg-white/10" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-80 rounded-2xl bg-white/10" />
        <Skeleton className="h-80 rounded-2xl bg-white/10" />
      </div>
    </div>
  );
}
