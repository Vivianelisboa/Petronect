import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Navigation } from "./Navigation";

/** Moldura da aplicação: cabeçalho + navegação + conteúdo da rota. */
export function AppShell() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Navigation />
      <main className="mx-auto max-w-6xl">
        <Outlet />
      </main>
    </div>
  );
}
