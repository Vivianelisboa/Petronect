import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Navigation } from "./Navigation";

/** Moldura da aplicação: cabeçalho + navegação + conteúdo da rota. */
export function AppShell() {
  return (
    <div className="min-h-screen bg-cream-200">
      <div className="h-[3px] bg-leaf-500" />
      <Header />
      <Navigation />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
