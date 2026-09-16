import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Bell, LockKeyhole, Menu, UserRound, X } from "lucide-react";

/**
 * Cabeçalho do Portal do fornecedor. Âncoras para as seções da página,
 * troca de perfil (reabre o onboarding) e atalho para a área administrativa.
 */
export function PortalHeader({ perfil, onTrocarPerfil, onNotificar }) {
  const { t } = useTranslation();
  const [menu, setMenu] = useState(false);

  const navegacao = [
    { href: "#oportunidades", rotulo: t("portal.header.oportunidades") },
    { href: "#servicos", rotulo: t("portal.header.servicos") },
    { href: "#ajuda", rotulo: t("portal.header.ajuda") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-portal-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <a href="#inicio" className="flex items-center gap-3" aria-label="portal njila">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-portal-lime font-extrabold text-portal-950">
            P
          </span>
          <span className="leading-none">
            <span className="block text-lg font-semibold tracking-tight text-white">
              portal <b className="font-semibold text-portal-lime">njila</b>
            </span>
            <span className="mt-1 block text-[9px] font-bold tracking-[.16em] text-white/40">
              {t("portal.tagline")}
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 text-sm font-semibold text-white/70 md:flex">
          {navegacao.map((item) => (
            <a key={item.href} href={item.href} className="transition hover:text-portal-lime">
              {item.rotulo}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          {perfil && (
            <button
              type="button"
              onClick={onTrocarPerfil}
              className="inline-flex items-center gap-1 rounded-md px-2 py-2 text-xs font-bold text-white/70 transition hover:bg-white/10 hover:text-portal-lime"
            >
              <UserRound className="h-4 w-4" />
              {t("portal.header.trocar_perfil")}
            </button>
          )}
          <button
            type="button"
            onClick={() => onNotificar(t("portal.header.notif_nenhuma"))}
            className="rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
            aria-label={t("portal.header.notificacoes")}
          >
            <Bell className="h-5 w-5" />
          </button>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg bg-portal-lime px-4 py-2.5 text-sm font-bold text-portal-950 transition hover:bg-portal-lime/90"
          >
            <LockKeyhole className="h-4 w-4" />
            {t("portal.admin")}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenu(!menu)}
          className="rounded-md p-2 text-white/70 md:hidden"
          aria-label={t("portal.header.menu")}
          aria-expanded={menu}
        >
          {menu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {menu && (
        <nav className="border-t border-white/10 bg-portal-950/90 px-5 py-4 md:hidden">
          <div className="flex flex-col gap-3 text-sm font-semibold text-white/70">
            {navegacao.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setMenu(false)}>
                {item.rotulo}
              </a>
            ))}
            {perfil && (
              <button
                type="button"
                onClick={() => {
                  setMenu(false);
                  onTrocarPerfil();
                }}
                className="text-left"
              >
                {t("portal.header.trocar_perfil")}
              </button>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
