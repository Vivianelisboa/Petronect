import { useTranslation } from "react-i18next";

/**
 * Header minimalista — só o título da página e ações.
 * O peso visual está na sidebar, não aqui.
 */
export function Header() {
  const { t } = useTranslation();

  return (
    <header className="border-b border-ink-200 bg-white px-8 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ink-900">{t("fila.titulo")}</h1>
        <span className="text-sm text-ink-500">{t("fila.subtitulo")}</span>
      </div>
    </header>
  );
}
