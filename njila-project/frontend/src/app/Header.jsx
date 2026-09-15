import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { Bell, ChevronDown, ListTodo, LogOut, MessagesSquare, Settings, UserRound } from "lucide-react";
import { cn } from "../lib/cn";

/**
 * Cabeçalho da Central: marca e navegação em uma única barra de produto.
 */
export function Header() {
  const { t } = useTranslation();
  const [perfilAberto, setPerfilAberto] = useState(false);

  return (
    <header className="border-b border-ink-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4 lg:px-8">
        <div className="flex shrink-0 items-center gap-8">
          <div className="flex items-center gap-3" aria-label="portal njila">
            <NjilaMark />
            <span className="text-2xl font-semibold tracking-[-0.03em] text-ink-900">
              portal <span className="font-display font-normal text-brand-600">njila</span>
            </span>
          </div>
          <nav className="hidden items-center gap-1 sm:flex" aria-label={t("nav.menu")}>
            <HeaderLink to="/" end icon={ListTodo} label={t("nav.fila")} />
            <HeaderLink to="/assistente" icon={MessagesSquare} label={t("nav.assistente")} />
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label={t("perfil.notificacoes")}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-ink-500 transition-colors hover:bg-ink-50 hover:text-ink-800"
          >
            <Bell size={18} />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-brand-500 ring-2 ring-white" />
          </button>

          <div className="relative">
            <button
              type="button"
              aria-expanded={perfilAberto}
              onClick={() => setPerfilAberto((aberto) => !aberto)}
              className="flex items-center gap-2 rounded-xl px-2 py-1.5 text-left transition-colors hover:bg-ink-50"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-800">
                MC
              </span>
              <span className="hidden leading-tight sm:block">
                <span className="block text-xs font-semibold text-ink-800">{t("perfil.nome")}</span>
                <span className="block text-[10px] text-ink-400">{t("perfil.papel")}</span>
              </span>
              <ChevronDown size={15} className="text-ink-400" />
            </button>

            {perfilAberto && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setPerfilAberto(false)} />
                <div className="absolute right-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-xl border border-ink-100 bg-white py-1 shadow-lg">
                  <div className="border-b border-ink-100 px-4 py-3">
                    <p className="text-xs font-semibold text-ink-800">{t("perfil.nome")}</p>
                    <p className="mt-0.5 text-[11px] text-ink-400">{t("perfil.email")}</p>
                  </div>
                  <ProfileAction icon={UserRound} label={t("perfil.conta")} />
                  <ProfileAction icon={Settings} label={t("perfil.preferencias")} />
                  <ProfileAction icon={LogOut} label={t("perfil.sair")} danger />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function ProfileAction({ icon: Icon, label, danger = false }) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition-colors hover:bg-surface-50",
        danger ? "text-red-600" : "text-ink-600"
      )}
    >
      <Icon size={15} />
      {label}
    </button>
  );
}

/** Marca gráfica do Njila: um caminho com três pontos de passagem. */
function NjilaMark() {
  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 shadow-sm shadow-brand-600/20">
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      >
        <path d="M5 18c0-4.1 2.2-7 6.3-7 4 0 7.7-2.1 7.7-5.8" className="text-white" />
        <circle cx="5" cy="18" r="1.8" className="fill-white stroke-white" />
        <circle cx="11.3" cy="11" r="1.8" className="fill-white stroke-white" />
        <circle cx="19" cy="5.2" r="1.8" className="fill-white stroke-white" />
      </svg>
    </span>
  );
}

function HeaderLink({ to, end, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          isActive ? "bg-brand-50 text-brand-800" : "text-ink-500 hover:bg-ink-50 hover:text-ink-800"
        )
      }
    >
      <Icon size={16} />
      {label}
    </NavLink>
  );
}
