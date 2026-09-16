import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  Building2,
  ClipboardList,
  FileText,
  LockKeyhole,
  UserCheck,
  UserPlus,
  Wallet,
} from "lucide-react";
import { cn } from "../../lib/cn";
import { track } from "../../services/tracking";

const PERFIS = [
  { id: "fornecedor", icone: Building2, path: "/portal/fornecedor" },
  { id: "cliente", icone: UserCheck, path: "/portal/cliente" },
  { id: "novo", icone: UserPlus, path: "/portal/novo-visitante" },
];

const SERVICOS = [
  { id: "cotacoes", icone: FileText },
  { id: "cadastro", icone: ClipboardList },
  { id: "contratos", icone: Building2 },
  { id: "pagamentos", icone: Wallet },
];

/**
 * Simulação do Portal Petronect voltado ao fornecedor. Ao escolher um perfil,
 * o conteúdo em destaque muda — a ideia de "separar por parte" do enunciado,
 * aplicada à experiência do usuário final.
 *
 * A navegação aqui emite eventos de acesso consentidos (ver services/tracking),
 * que alimentam o painel operacional do Njila.
 */
export function PortalHomePage() {
  const { t } = useTranslation();
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    track({ name: "page_view", path: "/portal" });
  }, []);

  function escolher(id, path) {
    setPerfil(id);
    track({ name: "page_view", path });
  }

  function usarAcao() {
    if (!perfil) return;
    track({ name: "opportunity_opened", path: `/portal/${perfil}/oportunidades` });
  }

  const perfilAtivo = perfil ? t(`portal.perfis.${perfil}`, { returnObjects: true }) : null;

  return (
    <main className="portal-shell min-h-screen overflow-hidden text-white">
      <header className="border-b border-white/10 bg-portal-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-portal-lime font-extrabold text-portal-950">
              P
            </span>
            <div>
              <p className="font-bold">{t("portal.titulo")}</p>
              <p className="text-[10px] font-bold uppercase tracking-[.16em] text-portal-lime">
                {t("portal.tagline")}
              </p>
            </div>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-white/80 transition hover:border-portal-lime hover:text-portal-lime"
          >
            <LockKeyhole size={14} />
            {t("portal.admin")}
          </Link>
        </div>
      </header>

      <section className="relative">
        <div className="portal-glow portal-glow-one" aria-hidden="true" />
        <div className="portal-glow portal-glow-two" aria-hidden="true" />

        <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-portal-lime/30 bg-portal-lime/10 px-3 py-1.5 text-xs font-bold text-portal-lime">
            <span className="h-1.5 w-1.5 rounded-full bg-portal-lime" />
            {t("portal.badge")}
          </span>

          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-[1.06] tracking-tight sm:text-6xl">
            {t("portal.hero_titulo")}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
            {t("portal.hero_subtitulo")}
          </p>

          <p className="mt-10 text-sm font-semibold text-white/85">{t("portal.ajudar")}</p>
          <div className="mt-4 grid max-w-4xl gap-3 sm:grid-cols-3">
            {PERFIS.map((item) => {
              const Icone = item.icone;
              const ativo = perfil === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={ativo}
                  onClick={() => escolher(item.id, item.path)}
                  className={cn(
                    "rounded-2xl border p-5 text-left transition hover:-translate-y-1",
                    ativo
                      ? "border-portal-lime bg-portal-lime text-portal-950"
                      : "border-white/15 bg-white/[.06] hover:border-white/35"
                  )}
                >
                  <Icone className={cn("h-5 w-5", ativo ? "text-portal-950" : "text-portal-lime")} />
                  <p className="mt-5 font-bold">{t(`portal.perfis.${item.id}.titulo`)}</p>
                  <p className={cn("mt-1 text-sm", ativo ? "text-portal-950/70" : "text-white/55")}>
                    {t(`portal.perfis.${item.id}.descricao`)}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
        <div className="rounded-3xl border border-portal-lime/30 bg-portal-950/50 p-7 sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-portal-lime">
            {t("portal.personalizado_label")}
          </p>
          <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                {perfilAtivo?.destaque || t("portal.personalizado_titulo")}
              </h2>
              <p className="mt-2 text-white/60">
                {perfil
                  ? t("portal.personalizado_texto_ativo")
                  : t("portal.personalizado_texto")}
              </p>
            </div>
            <button
              type="button"
              onClick={usarAcao}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-portal-lime px-5 py-3 font-semibold text-portal-950"
            >
              {perfilAtivo?.acao || t("portal.acao_padrao")}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-16">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-portal-lime">
            {t("portal.servicos_label")}
          </p>
          <h2 className="mt-2 text-3xl font-bold">{t("portal.servicos_titulo")}</h2>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICOS.map((servico) => {
            const Icone = servico.icone;
            return (
              <article
                key={servico.id}
                className="rounded-2xl border border-white/10 bg-white/[.045] p-5 transition hover:border-portal-lime/50"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-portal-lime">
                  <Icone className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-bold">{t(`portal.servicos.${servico.id}.titulo`)}</h3>
                <p className="mt-2 text-sm leading-5 text-white/55">
                  {t(`portal.servicos.${servico.id}.texto`)}
                </p>
                <span className="mt-5 inline-flex items-center text-sm font-semibold text-portal-lime">
                  {t("portal.acessar")}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </span>
              </article>
            );
          })}
        </div>
      </section>

      <footer className="border-t border-white/10 px-5 py-8 text-center text-xs text-white/40">
        © {new Date().getFullYear()} {t("portal.rodape")}
      </footer>
    </main>
  );
}
