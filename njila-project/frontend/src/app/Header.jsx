import { useTranslation } from "react-i18next";

/**
 * Cabeçalho corporativo e refinado. A marca é apresentada de forma
 * discreta: wordmark em Garet (fonte display) com o verde Petronect
 * apenas no nome "njila". Sem ícones decorativos, sem filetes coloridos.
 */
export function Header() {
  const { t } = useTranslation();

  return (
    <header className="border-b border-ink-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-xl font-bold tracking-tight text-ink-900">
            portal <span className="text-brand-600">njila</span>
          </span>
          <span className="hidden text-xs text-ink-400 sm:inline">
            {t("app.tagline")}
          </span>
        </div>

        <span className="text-xs font-medium uppercase tracking-wider text-ink-400">
          {t("app.audiencia")}
        </span>
      </div>
    </header>
  );
}
