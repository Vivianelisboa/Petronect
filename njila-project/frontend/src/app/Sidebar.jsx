import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ListTodo, MessagesSquare } from "lucide-react";
import { cn } from "../lib/cn";

const ITENS = [
  { to: "/", chave: "nav.fila", Icone: ListTodo },
  { to: "/assistente", chave: "nav.assistente", Icone: MessagesSquare },
];

/**
 * Sidebar escura com identidade forte.
 * O item ativo ganha fundo verde — a cor da marca Petronect.
 */
export function Sidebar() {
  const { t } = useTranslation();

  return (
    <aside className="flex w-64 flex-col border-r border-ink-200 bg-ink-900">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500">
          <span className="font-display text-lg font-bold text-white">N</span>
        </div>
        <div>
          <p className="font-display text-lg font-bold text-white">njila</p>
          <p className="text-[10px] font-medium uppercase tracking-widest text-ink-400">
            {t("app.audiencia")}
          </p>
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-4 py-4">
        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-ink-500">
          {t("nav.menu")}
        </p>
        <div className="space-y-1">
          {ITENS.map(({ to, chave, Icone }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-ink-400 hover:bg-ink-800 hover:text-white"
                )
              }
            >
              <Icone size={18} strokeWidth={2} />
              {t(chave)}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-ink-800 px-6 py-4">
        <p className="text-xs text-ink-500">Petronect</p>
        <p className="text-[10px] text-ink-600">{t("app.tagline")}</p>
      </div>
    </aside>
  );
}
