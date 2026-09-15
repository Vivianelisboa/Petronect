import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Navigation } from "./Navigation";

/** Moldura da aplicação: cabeçalho + navegação + conteúdo da rota. */
export function AppShell() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <Navigation />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
