import { useState } from "react";
import { useTranslation } from "react-i18next";
import FilaHoje from "./components/FilaHoje";
import FichaEmpresa from "./components/FichaEmpresa";
import AssistenteWidget from "./components/AssistenteWidget";

export default function App() {
  const { t } = useTranslation();
  const [aba, setAba] = useState("fila");
  const [empresaSelecionada, setEmpresaSelecionada] = useState(null);

  function abrirFicha(empresaId) {
    setEmpresaSelecionada(empresaId);
    setAba("ficha");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-njila-green" />
        <h1 className="text-lg font-bold text-njila-blue">{t("app_title")}</h1>
      </header>

      <nav className="bg-white border-b px-6 flex gap-6 text-sm">
        <AbaBotao ativo={aba === "fila"} onClick={() => setAba("fila")} label={t("tab_fila")} />
        <AbaBotao ativo={aba === "ficha"} onClick={() => setAba("ficha")} label={t("tab_ficha")} />
        <AbaBotao ativo={aba === "assistente"} onClick={() => setAba("assistente")} label={t("tab_assistente")} />
      </nav>

      <main>
        {aba === "fila" && <FilaHoje onSelecionarEmpresa={abrirFicha} />}
        {aba === "ficha" && <FichaEmpresa empresaId={empresaSelecionada} />}
        {aba === "assistente" && <AssistenteWidget />}
      </main>
    </div>
  );
}

function AbaBotao({ ativo, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`py-3 border-b-2 ${
        ativo ? "border-njila-green text-njila-green font-medium" : "border-transparent text-gray-500"
      }`}
    >
      {label}
    </button>
  );
}
