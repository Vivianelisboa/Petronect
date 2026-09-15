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
          <span className="font-display text-xl font-bold tracking-tight text-ink-900">
            portal <span className="text-brand-600">njila</span>
          </span>
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
