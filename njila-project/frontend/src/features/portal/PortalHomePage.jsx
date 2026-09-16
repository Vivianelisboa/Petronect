import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  FileText,
  MapPin,
  Search,
  Sparkles,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import { ToastStack } from "../../design/ui/ToastStack";
import { track } from "../../services/tracking";
import { Onboarding } from "./Onboarding";
import { PaolaChatPortal } from "./PaolaChatPortal";
import { PortalHeader } from "./PortalHeader";
import { TaskModal } from "./TaskModal";

const CHAVE_PERFIL = "njila_portal_perfil";

const SERVICOS = [
  { id: "cadastro", tarefa: "cadastro", icone: UserPlus },
  { id: "oportunidades", tarefa: "oportunidades", icone: BriefcaseBusiness },
  { id: "propostas", tarefa: "oportunidades", icone: ClipboardList },
  { id: "documentos", tarefa: "documentos", icone: FileText },
];

/**
 * Portal do fornecedor — a "rua" que o fornecedor vive. Jornada: onboarding
 * de perfil (primeira visita) → hero personalizado → acesso rápido → área do
 * perfil → avisos → serviços → ajuda da Paola, com chat flutuante e modais
 * de tarefa. Todos os passos emitem eventos de acesso consentidos.
 */
export function PortalHomePage() {
  const { t } = useTranslation();
  const [perfil, setPerfil] = useState(() => {
    try {
      return window.localStorage.getItem(CHAVE_PERFIL);
    } catch {
      return null;
    }
  });
  const [onboarding, setOnboarding] = useState(false);
  const [chat, setChat] = useState(false);
  const [tarefa, setTarefa] = useState(null);
  const [registered, setRegistered] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [paolaAtencao, setPaolaAtencao] = useState(false);

  useEffect(() => {
    track({ name: "page_view", path: "/portal" });
    if (!perfil) setOnboarding(true);
  }, []);

  function notificar(texto) {
    const id = crypto.randomUUID();
    setToasts((atual) => [...atual, { id, texto }]);
    window.setTimeout(() => setToasts((atual) => atual.filter((toast) => toast.id !== id)), 3200);
  }

  function escolherPerfil(id) {
    setPerfil(id);
    setOnboarding(false);
    try {
      window.localStorage.setItem(CHAVE_PERFIL, id);
    } catch {
      /* localStorage indisponível — o perfil vale só para esta visita */
    }
    track({ name: "page_view", path: `/portal/${id}` });
    if (id === "fornecedor") setPaolaAtencao(true);
  }

  function abrirTarefa(tarefaId) {
    setTarefa(tarefaId);
  }

  function abrirOportunidade(chave) {
    track({ name: "opportunity_opened", path: `/portal/oportunidades/${chave}` });
    setTarefa(null);
    notificar(t("portal.tarefas.oportunidades.titulo"));
  }

  function registrarCadastro() {
    setRegistered(true);
    notificar(t("portal.tarefas.cadastro.toast"));
  }

  function abrirChat() {
    setPaolaAtencao(false);
    setChat(true);
  }

  const hero = {
    titulo: perfil ? t(`portal.hero.${perfil}`) : t("portal.hero_titulo"),
    subtitulo: perfil ? t(`portal.hero.subtitulo_${perfil}`) : t("portal.hero_subtitulo"),
    acao: perfil ? t(`portal.hero.acao_${perfil}`) : t("portal.acao_padrao"),
  };

  return (
    <main className="portal-shell min-h-screen overflow-x-hidden text-white">
      <PortalHeader perfil={perfil} onTrocarPerfil={() => setOnboarding(true)} onNotificar={notificar} />

      <section id="inicio" className="relative">
        <div className="portal-glow portal-glow-one" aria-hidden="true" />
        <div className="portal-glow portal-glow-two" aria-hidden="true" />

        <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.1fr_.9fr] lg:py-24">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-portal-lime/30 bg-portal-lime/10 px-3 py-1.5 text-xs font-bold text-portal-lime">
              <span className="h-1.5 w-1.5 rounded-full bg-portal-lime" />
              {t("portal.badge")}
            </span>
            <h1 className="font-display mt-6 max-w-2xl text-4xl font-bold leading-[1.06] tracking-tight sm:text-5xl">
              {hero.titulo}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/70 sm:text-lg">{hero.subtitulo}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => abrirTarefa(perfil === "novo" ? "cadastro" : "oportunidades")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-portal-lime px-5 py-3.5 font-bold text-portal-950 transition hover:bg-portal-lime/90"
              >
                {hero.acao}
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={abrirChat}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 px-5 py-3.5 font-bold text-white transition hover:border-portal-lime hover:text-portal-lime"
              >
                <Bot className="h-4 w-4" />
                {t("portal.paola.botao")}
              </button>
            </div>
          </div>

          <AcessoRapido onAbrir={abrirTarefa} />
        </div>
      </section>

      <AreaPerfil perfil={perfil} onAbrirTarefa={abrirTarefa} />

      <section id="oportunidades" className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-portal-lime">{t("portal.avisos.label")}</p>
        <h2 className="font-display mt-2 text-3xl font-bold">{t("portal.avisos.titulo")}</h2>
        <article className="mt-7 grid overflow-hidden rounded-3xl border border-white/10 bg-white/[.045] md:grid-cols-[1.5fr_.5fr]">
          <div className="p-7 sm:p-9">
            <p className="text-xs font-bold uppercase tracking-[.16em] text-portal-lime">{t("portal.avisos.destaque")}</p>
            <h3 className="font-display mt-3 max-w-2xl text-2xl font-bold">{t("portal.avisos.destaque_titulo")}</h3>
            <p className="mt-3 max-w-2xl leading-7 text-white/60">{t("portal.avisos.destaque_texto")}</p>
            <button
              type="button"
              onClick={() => abrirTarefa("oportunidades")}
              className="mt-6 inline-flex items-center gap-2 font-bold text-portal-lime transition hover:text-portal-lime/80"
            >
              {t("portal.avisos.destaque_acao")}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center justify-center bg-portal-lime/10 p-8">
            <CalendarClock className="h-20 w-20 text-portal-lime" />
          </div>
        </article>
      </section>

      <section id="servicos" className="border-y border-white/10 bg-white/[.03] px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-portal-lime">{t("portal.servicos_label")}</p>
          <h2 className="font-display mt-2 text-3xl font-bold">{t("portal.servicos_titulo")}</h2>
          <div className="mt-7 divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/[.045]">
            {SERVICOS.map(({ id, tarefa: tarefaId, icone: Icone }) => (
              <button
                key={id}
                type="button"
                onClick={() => abrirTarefa(tarefaId)}
                className="group flex w-full items-center gap-5 p-5 text-left transition hover:bg-white/[.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-portal-lime sm:p-6"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-portal-lime/10 text-portal-lime">
                  <Icone className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold">{t(`portal.servicos.${id}.titulo`)}</span>
                  <span className="mt-1 block text-sm leading-6 text-white/55">
                    {t(`portal.servicos.${id}.texto`)}
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-portal-lime opacity-50 transition group-hover:translate-x-1 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="ajuda" className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="rounded-3xl border border-portal-lime/20 bg-portal-950/60 px-7 py-10 sm:px-10">
          <Sparkles className="h-6 w-6 text-portal-lime" />
          <h2 className="font-display mt-4 text-3xl font-bold">{t("portal.ajuda.titulo")}</h2>
          <p className="mt-3 max-w-2xl leading-7 text-white/65">{t("portal.ajuda.texto")}</p>
          <button
            type="button"
            onClick={abrirChat}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-portal-lime px-5 py-3 font-bold text-portal-950 transition hover:bg-portal-lime/90"
          >
            <Bot className="h-4 w-4" />
            {t("portal.ajuda.acao")}
          </button>
        </div>
      </section>

      <footer className="border-t border-white/10 px-5 py-8 text-center text-xs text-white/40">
        © {new Date().getFullYear()} {t("portal.rodape")}
      </footer>

      <button
        type="button"
        onClick={abrirChat}
        className="group fixed bottom-5 right-5 z-40 flex h-14 items-center gap-2 rounded-full bg-portal-lime px-5 font-extrabold text-portal-950 shadow-[0_12px_28px_rgba(8,13,19,0.45)] transition duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-portal-lime/40 sm:bottom-6 sm:right-6"
      >
        {paolaAtencao && <span className="paola-pulse absolute inset-0 rounded-full" aria-hidden="true" />}
        <Bot className="relative h-5 w-5" />
        <span className="relative hidden sm:inline">{t("portal.paola.botao")}</span>
      </button>

      {paolaAtencao && !chat && (
        <p className="fixed bottom-24 right-6 z-40 max-w-[240px] rounded-xl rounded-br-sm border border-white/10 bg-portal-900 px-4 py-3 text-xs font-semibold text-white shadow-xl sm:right-8">
          {t("portal.paola.sugestao")}
        </p>
      )}

      <ToastStack toasts={toasts} />

      {onboarding && <Onboarding onEscolher={escolherPerfil} onFechar={() => setOnboarding(false)} />}
      {chat && (
        <PaolaChatPortal
          perfil={perfil}
          onClose={() => setChat(false)}
          onAbrirTask={abrirTarefa}
          onNotificar={notificar}
        />
      )}
      {tarefa && (
        <TaskModal
          task={tarefa}
          registered={registered}
          onClose={() => setTarefa(null)}
          onRegister={registrarCadastro}
          onAbrirOportunidade={abrirOportunidade}
        />
      )}
    </main>
  );
}

function AcessoRapido({ onAbrir }) {
  const { t } = useTranslation();
  const atalhos = [
    { rotulo: t("portal.acesso_rapido.oportunidades"), tarefa: "oportunidades" },
    { rotulo: t("portal.acesso_rapido.cadastro"), tarefa: "cadastro" },
    { rotulo: t("portal.acesso_rapido.documentos"), tarefa: "documentos" },
  ];

  return (
    <aside className="relative z-10 h-fit rounded-3xl border border-white/10 bg-portal-900/70 p-5 shadow-2xl backdrop-blur sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.14em] text-portal-lime">
            {t("portal.acesso_rapido.label")}
          </p>
          <h2 className="font-display mt-1 text-xl font-bold tracking-tight">{t("portal.acesso_rapido.titulo")}</h2>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-portal-lime/10 text-portal-lime">
          <Search className="h-5 w-5" />
        </span>
      </div>
      <div className="mt-5 space-y-2.5">
        {atalhos.map(({ rotulo, tarefa }) => (
          <button
            key={tarefa}
            type="button"
            onClick={() => onAbrir(tarefa)}
            className="group flex min-h-12 w-full items-center justify-between rounded-xl border border-white/10 px-4 py-3 text-left text-sm font-semibold transition hover:border-portal-lime/60 hover:bg-portal-lime/5"
          >
            <span>{rotulo}</span>
            <ArrowRight className="h-4 w-4 text-portal-lime transition-transform group-hover:translate-x-1" />
          </button>
        ))}
      </div>
    </aside>
  );
}

function AreaPerfil({ perfil, onAbrirTarefa }) {
  const { t } = useTranslation();

  if (perfil === "cliente") {
    return (
      <section className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="rounded-3xl bg-portal-700 p-7 sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-portal-lime">{t("portal.cliente_area.label")}</p>
          <h2 className="font-display mt-3 text-2xl font-bold">{t("portal.cliente_area.titulo")}</h2>
          <p className="mt-3 max-w-2xl leading-7 text-white/70">{t("portal.cliente_area.texto")}</p>
          <button
            type="button"
            onClick={() => onAbrirTarefa("oportunidades")}
            className="mt-6 rounded-xl bg-portal-lime px-5 py-3 font-bold text-portal-950 transition hover:bg-portal-lime/90"
          >
            {t("portal.cliente_area.acao")}
          </button>
        </div>
      </section>
    );
  }

  if (perfil === "novo") {
    return (
      <section className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="rounded-3xl border border-portal-lime/30 bg-portal-lime/10 p-7 sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-portal-lime">{t("portal.novo_area.label")}</p>
          <h2 className="font-display mt-3 text-2xl font-bold">{t("portal.novo_area.titulo")}</h2>
          <p className="mt-2 max-w-2xl text-white/70">{t("portal.novo_area.texto")}</p>
          <button
            type="button"
            onClick={() => onAbrirTarefa("cadastro")}
            className="mt-6 rounded-xl bg-portal-lime px-5 py-3 font-bold text-portal-950 transition hover:bg-portal-lime/90"
          >
            {t("portal.novo_area.acao")}
          </button>
        </div>
      </section>
    );
  }

  if (perfil !== "fornecedor") return null;

  const metricas = [
    { icone: CalendarClock, rotulo: t("portal.perfil_empresa.mercado"), valor: t("portal.perfil_empresa.mercado_valor") },
    { icone: Users, rotulo: t("portal.perfil_empresa.colaboradores"), valor: t("portal.perfil_empresa.colaboradores_valor") },
    { icone: MapPin, rotulo: t("portal.perfil_empresa.localizacao"), valor: t("portal.perfil_empresa.localizacao_valor") },
    { icone: TrendingUp, rotulo: t("portal.perfil_empresa.aderencia"), valor: t("portal.perfil_empresa.aderencia_valor") },
  ];

  return (
    <section className="mx-auto max-w-6xl px-5 sm:px-8">
      <div className="rounded-3xl border border-white/10 bg-white/[.045] p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-portal-lime">{t("portal.perfil_empresa.label")}</p>
            <h2 className="font-display mt-2 flex items-center gap-2 text-2xl font-bold">
              <Building2 className="h-6 w-6 text-portal-lime" />
              {t("portal.perfil_empresa.nome")}
            </h2>
            <p className="mt-1 text-sm text-white/55">{t("portal.perfil_empresa.cadastrado")}</p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-portal-lime/15 px-3 py-1.5 text-xs font-bold text-portal-lime">
            <CheckCircle2 className="h-4 w-4" />
            {t("portal.perfil_empresa.verificado")}
          </span>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-6 border-y border-white/10 py-6 lg:grid-cols-4">
          {metricas.map(({ icone: Icone, rotulo, valor }) => (
            <div key={rotulo} className="flex items-center gap-3">
              <Icone className="h-5 w-5 shrink-0 text-portal-lime" />
              <div>
                <p className="font-display text-xl font-bold leading-none">{valor}</p>
                <p className="mt-1.5 text-xs text-white/55">{rotulo}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col justify-between gap-4 rounded-xl border border-amber-300/30 bg-amber-300/10 p-4 sm:flex-row sm:items-center">
          <div>
            <p className="font-bold">{t("portal.perfil_empresa.cotacao_titulo")}</p>
            <p className="text-sm text-white/60">{t("portal.perfil_empresa.cotacao_texto")}</p>
          </div>
          <button
            type="button"
            onClick={() => onAbrirTarefa("oportunidades")}
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-portal-lime px-4 py-2.5 text-sm font-bold text-portal-950 transition hover:bg-portal-lime/90"
          >
            {t("portal.perfis.fornecedor.acao")}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
