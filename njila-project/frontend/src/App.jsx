import { Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Building2, Compass } from "lucide-react";
import { AppShell } from "./app/AppShell";
import { EmptyState } from "./design/ui/EmptyState";
import { FilaHojePage } from "./features/fila/FilaHojePage";
import { FichaEmpresaPage } from "./features/ficha/FichaEmpresaPage";
import { AssistentePage } from "./features/assistente/AssistentePage";

/**
 * Mapa de rotas. O `AppShell` é o layout compartilhado; cada rota preenche
 * o `<Outlet />` dele. `/empresa` sem id mostra um estado vazio explicando
 * como chegar numa ficha.
 */
export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<FilaHojePage />} />
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
