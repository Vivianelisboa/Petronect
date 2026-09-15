import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { ListTodo, MessagesSquare } from "lucide-react";
import { cn } from "../lib/cn";

const ITENS = [
  { to: "/", chave: "nav.fila", Icone: ListTodo, end: true },
  { to: "/assistente", chave: "nav.assistente", Icone: MessagesSquare, end: false },
];

/** Navegação principal com estados refinados e hierarquia visual clara. */
export function Navigation() {
  const { t } = useTranslation();

  return (
    <nav className="border-b border-ink-200 bg-white">
      <div className="mx-auto flex max-w-6xl gap-1 px-6">
        {ITENS.map(({ to, chave, Icone, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "border-brand-600 text-brand-700"
                  : "border-transparent text-ink-500 hover:text-ink-800"
              )
            }
          >
            <Icone size={16} strokeWidth={2} />
            {t(chave)}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
