import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

/** 
 * Layout moderno com sidebar + conteúdo principal.
 * Isso quebra imediatamente a cara de "portal HTML".
 */
export function AppShell() {
  return (
    <div className="flex h-screen bg-surface-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-5xl px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
