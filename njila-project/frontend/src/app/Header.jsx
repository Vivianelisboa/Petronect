import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { ListTodo, MessagesSquare } from "lucide-react";
import { cn } from "../lib/cn";

/**
 * Cabeçalho da Central: marca e navegação em uma única barra de produto.
 */
export function Header() {
  const { t } = useTranslation();

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
        <span className="hidden text-[11px] font-semibold uppercase tracking-widest text-ink-400 md:block">
          {t("app.audiencia")}
        </span>
      </div>
    </header>
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
