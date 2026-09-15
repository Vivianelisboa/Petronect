import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Bot, Building2, ListTodo } from "lucide-react";
import { cn } from "../lib/cn";

const ITENS = [
  { to: "/", chave: "nav.fila", Icone: ListTodo, end: true },
  { to: "/empresa", chave: "nav.ficha", Icone: Building2, end: false },
  { to: "/assistente", chave: "nav.assistente", Icone: Bot, end: false },
];

/** Navegação principal. Usa `NavLink` para marcar a aba ativa pela URL. */
export function Navigation() {
  const { t } = useTranslation();

  return (
    <nav className="flex gap-6 border-b border-slate-200 bg-white px-6 text-sm">
      {ITENS.map(({ to, chave, Icone, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2 border-b-2 py-3 transition-colors",
              isActive
                ? "border-brand-600 font-medium text-brand-700"
                : "border-transparent text-slate-500 hover:text-ink-700"
            )
          }
        >
          <Icone size={15} />
          {t(chave)}
        </NavLink>
      ))}
    </nav>
  );
}
