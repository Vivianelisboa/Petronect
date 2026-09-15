import { useTranslation } from "react-i18next";
import { Route } from "lucide-react";

/**
 * Marca do produto. Tile com o símbolo do "caminho" (njila, em kimbundu) no
 * azul de ação, wordmark em Garet Heavy e a tagline — o produto em uma linha.
 */
export function Header() {
  const { t } = useTranslation();

  return (
    <header className="border-b border-ink-200 bg-white px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
            <Route size={20} />
          </span>
          <div className="leading-tight">
            <span className="block text-2xl font-bold tracking-tight text-ink-900" aria-label="portal njila">
              portal <span className="text-brand-600">njila</span>
            </span>
            <span className="hidden text-[11px] text-ink-400 sm:block">{t("app.tagline")}</span>
          </div>
        </div>

        <span className="hidden text-xs font-medium uppercase tracking-wider text-ink-400 sm:block">
          {t("app.audiencia")}
        </span>
      </div>
    </header>
  );
}
