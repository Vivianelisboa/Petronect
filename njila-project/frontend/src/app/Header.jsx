import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart3,
  Bell,
  ChevronDown,
  ExternalLink,
  ListTodo,
  LogOut,
  Menu,
  MessagesSquare,
  Settings,
  UserRound,
  X,
} from "lucide-react";
import { cn } from "../lib/cn";

/**
 * Cabeçalho da Central: marca e navegação em uma única barra de produto.
 * Adapta-se ao tema escuro nas rotas que rodam sobre o azul do Portal.
 */
export function Header() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const escuro = pathname.startsWith("/analitico");
  const [perfilAberto, setPerfilAberto] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <header
      className={cn(
        "border-b",
        escuro ? "border-white/10 bg-portal-950/70 backdrop-blur-xl" : "border-ink-200 bg-white"
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
        <div className="flex min-w-0 shrink items-center gap-6">
          <div className="flex shrink-0 items-center gap-3" aria-label="portal njila">
            <NjilaMark escuro={escuro} />
            <span
              className={cn(
                "font-display whitespace-nowrap text-2xl font-normal tracking-[-0.03em]",
                escuro ? "text-white" : "text-ink-900"
              )}
            >
              portal <span className={escuro ? "text-portal-lime" : "text-brand-600"}>njila</span>
            </span>
            <span
              className={cn(
                "hidden whitespace-nowrap border-l pl-3 text-[10px] font-bold uppercase tracking-widest 2xl:inline",
                escuro ? "border-white/20 text-white/50" : "border-ink-200 text-ink-400"
              )}
            >
              {t("app.assinatura")}
            </span>
          </div>
          <nav className="hidden items-center gap-0.5 xl:flex" aria-label={t("nav.menu")}>
            <HeaderLink to="/" end icon={ListTodo} label={t("nav.fila")} escuro={escuro} />
            <HeaderLink to="/analitico" icon={BarChart3} label={t("nav.analitico")} escuro={escuro} />
            <HeaderLink
              to="/assistente"
              icon={MessagesSquare}
              label={t("nav.assistente")}
              escuro={escuro}
            />
            <HeaderLink to="/portal" icon={ExternalLink} label={t("nav.portal")} escuro={escuro} />
          </nav>
        </div>

        <button
          type="button"
          aria-label={t("nav.menu")}
          aria-expanded={menuAberto}
          onClick={() => setMenuAberto((aberto) => !aberto)}
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors xl:hidden",
            escuro
              ? "text-white/70 hover:bg-white/10 hover:text-white"
              : "text-ink-500 hover:bg-ink-50 hover:text-ink-800"
          )}
        >
          {menuAberto ? <X size={18} /> : <Menu size={18} />}
        </button>

        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            aria-label={t("perfil.notificacoes")}
            className={cn(
              "relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
              escuro
                ? "text-white/70 hover:bg-white/10 hover:text-white"
                : "text-ink-500 hover:bg-ink-50 hover:text-ink-800"
            )}
          >
            <Bell size={18} />
            <span
              className={cn(
                "absolute right-2 top-2 h-1.5 w-1.5 rounded-full ring-2",
                escuro ? "bg-portal-lime ring-portal-950" : "bg-brand-500 ring-white"
              )}
            />
          </button>

          <div className="relative">
            <button
              type="button"
              aria-expanded={perfilAberto}
              onClick={() => setPerfilAberto((aberto) => !aberto)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-xl px-2 py-1.5 text-left transition-colors",
                escuro ? "hover:bg-white/10" : "hover:bg-ink-50"
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  escuro ? "bg-portal-lime text-portal-950" : "bg-brand-100 text-brand-800"
                )}
              >
                MC
              </span>
              <span className="hidden leading-tight lg:block">
                <span
                  className={cn(
                    "font-display block whitespace-nowrap text-[13px] font-normal",
                    escuro ? "text-white" : "text-ink-800"
                  )}
                >
                  {t("perfil.nome")}
                </span>
                <span
                  className={cn(
                    "block whitespace-nowrap text-[10px]",
                    escuro ? "text-white/50" : "text-ink-400"
                  )}
                >
                  {t("perfil.papel")}
                </span>
              </span>
              <ChevronDown size={15} className={cn("shrink-0", escuro ? "text-white/50" : "text-ink-400")} />
            </button>

            {perfilAberto && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setPerfilAberto(false)} />
                <div
                  className={cn(
                    "absolute right-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-xl border py-1 shadow-lg",
                    escuro ? "border-white/15 bg-portal-900" : "border-ink-100 bg-white"
                  )}
                >
                  <div className={cn("border-b px-4 py-3", escuro ? "border-white/10" : "border-ink-100")}>
                    <p className={cn("text-xs font-semibold", escuro ? "text-white" : "text-ink-800")}>
                      {t("perfil.nome")}
                    </p>
                    <p className={cn("mt-0.5 text-[11px]", escuro ? "text-white/50" : "text-ink-400")}>
                      {t("perfil.email")}
                    </p>
                  </div>
                  <ProfileAction icon={UserRound} label={t("perfil.conta")} escuro={escuro} />
                  <ProfileAction icon={Settings} label={t("perfil.preferencias")} escuro={escuro} />
                  <ProfileAction icon={LogOut} label={t("perfil.sair")} escuro={escuro} danger />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {menuAberto && (
        <nav
          className={cn("border-t px-6 py-2 xl:hidden", escuro ? "border-white/10" : "border-ink-100")}
          aria-label={t("nav.menu")}
        >
          <HeaderLink to="/" end icon={ListTodo} label={t("nav.fila")} escuro={escuro} onNavigate={() => setMenuAberto(false)} />
          <HeaderLink to="/analitico" icon={BarChart3} label={t("nav.analitico")} escuro={escuro} onNavigate={() => setMenuAberto(false)} />
          <HeaderLink to="/assistente" icon={MessagesSquare} label={t("nav.assistente")} escuro={escuro} onNavigate={() => setMenuAberto(false)} />
          <HeaderLink to="/portal" icon={ExternalLink} label={t("nav.portal")} escuro={escuro} onNavigate={() => setMenuAberto(false)} />
        </nav>
      )}
    </header>
  );
}

function ProfileAction({ icon: Icon, label, danger = false, escuro = false }) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition-colors",
        danger ? "text-rose-300" : escuro ? "text-white/75" : "text-ink-600",
        escuro ? "hover:bg-white/10" : "hover:bg-surface-50"
      )}
    >
      <Icon size={15} />
      {label}
    </button>
  );
}

/** Marca gráfica do Njila: um caminho com três pontos de passagem. */
function NjilaMark({ escuro = false }) {
  return (
    <span
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-xl shadow-sm",
        escuro ? "bg-portal-lime" : "bg-brand-600 shadow-brand-600/20"
      )}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className={cn("h-6 w-6", escuro ? "text-portal-950" : "text-white")}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      >
        <path d="M5 18c0-4.1 2.2-7 6.3-7 4 0 7.7-2.1 7.7-5.8" />
        <circle cx="5" cy="18" r="1.8" className="fill-current stroke-current" />
        <circle cx="11.3" cy="11" r="1.8" className="fill-current stroke-current" />
        <circle cx="19" cy="5.2" r="1.8" className="fill-current stroke-current" />
      </svg>
    </span>
  );
}

function HeaderLink({ to, end, icon: Icon, label, onNavigate, escuro = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "font-display flex items-center gap-2 whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-normal transition-colors",
          isActive
            ? escuro
              ? "bg-white/10 text-white"
              : "bg-brand-50 text-brand-800"
            : escuro
              ? "text-white/60 hover:bg-white/10 hover:text-white"
              : "text-ink-500 hover:bg-ink-50 hover:text-ink-800"
        )
      }
    >
      <Icon size={16} />
      {label}
    </NavLink>
  );
}
