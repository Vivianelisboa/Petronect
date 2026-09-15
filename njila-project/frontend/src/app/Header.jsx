import { useTranslation } from "react-i18next";
import { Hexagon } from "lucide-react";

/** Cabeçalho fixo com a marca do painel. */
export function Header() {
  const { t } = useTranslation();

  return (
    <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-6 py-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white">
        <Hexagon size={18} />
      </div>
      <h1 className="text-lg font-bold text-ink-800">{t("app.titulo")}</h1>
    </header>
  );
}
