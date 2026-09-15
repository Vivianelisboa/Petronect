import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { cn } from "../lib/cn";

/**
 * Moldura da aplicação. O fundo muda por rota: a Visão analítica roda sobre o
 * azul profundo do Portal (tema escuro); o restante da operação usa o fundo
 * claro corporativo.
 */
export function AppShell() {
  const { pathname } = useLocation();
  const escuro = pathname.startsWith("/analitico");

  return (
    <div className={cn("min-h-screen", escuro ? "portal-shell text-white" : "bg-surface-50")}>
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
