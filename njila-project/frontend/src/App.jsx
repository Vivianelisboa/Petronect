import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Building2, Compass } from "lucide-react";
import { AppShell } from "./app/AppShell";
import { EmptyState } from "./design/ui/EmptyState";
import { Spinner } from "./design/ui/Spinner";
import { FilaHojePage } from "./features/fila/FilaHojePage";
import { FichaEmpresaPage } from "./features/ficha/FichaEmpresaPage";
import { AssistentePage } from "./features/assistente/AssistentePage";
import { PortalHomePage } from "./features/portal/PortalHomePage";

// A Visão analítica carrega o recharts, que é pesado. Carregada sob demanda
// para não penalizar a Central, que é a tela de uso diário.
const AnalyticsPage = lazy(() =>
  import("./features/analitico/AnalyticsPage").then((modulo) => ({
    default: modulo.AnalyticsPage,
  }))
);

/**
 * Mapa de rotas. O `AppShell` é o layout compartilhado; cada rota preenche
 * o `<Outlet />` dele. `/empresa` sem id mostra um estado vazio explicando
 * como chegar numa ficha. `/portal` fica fora do shell: é a experiência do
 * fornecedor no Portal, com identidade visual própria.
 */
export default function App() {
  const { t } = useTranslation();

  return (
    <Routes>
      <Route path="portal" element={<PortalHomePage />} />
      <Route element={<AppShell />}>
        <Route index element={<FilaHojePage />} />
        <Route
          path="analitico"
          element={
            <Suspense fallback={<Spinner label={t("comum.carregando")} className="py-10" />}>
              <AnalyticsPage />
            </Suspense>
          }
        />
        <Route path="empresa" element={<SemEmpresa />} />
        <Route path="empresa/:empresaId" element={<FichaEmpresaPage />} />
        <Route path="assistente" element={<AssistentePage />} />
        <Route path="*" element={<NaoEncontrada />} />
      </Route>
    </Routes>
  );
}

function SemEmpresa() {
  const { t } = useTranslation();
  return (
    <div className="p-6">
      <EmptyState icon={Building2} title={t("ficha.selecione")} />
    </div>
  );
}

function NaoEncontrada() {
  const { t } = useTranslation();
  return (
    <div className="p-6">
      <EmptyState
        icon={Compass}
        title={t("comum.pagina_nao_encontrada")}
        description={t("comum.voltar_para_fila")}
      />
    </div>
  );
}
