import { Outlet } from "react-router-dom";
import { Header } from "./Header";

/** 
 * Superfície única de operação: marca, navegação e conteúdo trabalham
 * juntos sem transformar a Central em um painel administrativo genérico.
 */
export function AppShell() {
  return (
    <div className="min-h-screen bg-surface-50">
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-8 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
