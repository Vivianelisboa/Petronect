import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Building2, Search, Sparkles, UserCheck, X } from "lucide-react";
import { cn } from "../../lib/cn";

const PERFIS = [
  { id: "fornecedor", icone: Building2, recomendado: true },
  { id: "cliente", icone: UserCheck, recomendado: false },
  { id: "novo", icone: Search, recomendado: false },
];

/**
 * Onboarding de primeiro uso do Portal do fornecedor. Aparece só na primeira
 * visita (o perfil fica salvo em localStorage) e adapta a jornada: hero,
 * área de perfil e a ajuda da Paola mudam conforme a escolha. O fornecedor
 * vem marcado como recomendado porque é a persona central da demonstração.
 */
export function Onboarding({ onEscolher, onFechar }) {
  const { t } = useTranslation();
  const fecharRef = useRef(null);

  useEffect(() => {
    fecharRef.current?.focus();
    function fecharComEsc(evento) {
      if (evento.key === "Escape") onFechar();
    }
    document.addEventListener("keydown", fecharComEsc);
    return () => document.removeEventListener("keydown", fecharComEsc);
  }, [onFechar]);

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-portal-950/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-titulo"
      onMouseDown={(evento) => evento.target === evento.currentTarget && onFechar()}
    >
      <div className="onboarding-enter w-full max-w-2xl rounded-3xl border border-white/10 bg-portal-900 p-6 shadow-2xl sm:p-9">
        <button
          ref={fecharRef}
          type="button"
          onClick={onFechar}
          aria-label={t("portal.onboarding.fechar")}
          className="float-right rounded-md p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <span className="grid h-12 w-12 place-items-center rounded-xl bg-portal-lime/15 text-portal-lime">
          <Sparkles className="h-6 w-6" />
        </span>
        <p className="mt-5 text-xs font-bold uppercase tracking-[.16em] text-portal-lime">
          {t("portal.onboarding.label")}
        </p>
        <h2 id="onboarding-titulo" className="font-display mt-2 text-3xl font-bold tracking-tight text-white">
          {t("portal.onboarding.titulo")}
        </h2>
        <p className="mt-3 max-w-xl leading-7 text-white/60">{t("portal.onboarding.subtitulo")}</p>

        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          {PERFIS.map(({ id, icone: Icone, recomendado }) => (
            <button
              key={id}
              type="button"
              onClick={() => onEscolher(id)}
              className={cn(
                "group relative rounded-2xl border p-5 text-left transition duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-portal-lime",
                recomendado
                  ? "border-portal-lime bg-portal-lime/10 hover:bg-portal-lime/15"
                  : "border-white/10 bg-white/[.04] hover:border-white/30 hover:bg-white/[.07]"
              )}
            >
              {recomendado && (
                <span className="absolute right-3 top-3 rounded-full bg-portal-lime px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-portal-950">
                  {t("portal.onboarding.recomendado")}
                </span>
              )}
              <span
                className={cn(
                  "grid h-11 w-11 place-items-center rounded-xl transition",
                  recomendado
                    ? "bg-portal-lime text-portal-950"
                    : "bg-white/10 text-portal-lime group-hover:bg-white/15"
                )}
              >
                <Icone className="h-5 w-5" />
              </span>
              <p className="mt-5 font-bold text-white">{t(`portal.perfis.${id}.titulo`)}</p>
              <p className="mt-2 text-sm leading-5 text-white/55">{t(`portal.onboarding.perfis.${id}`)}</p>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onFechar}
          className="mt-6 text-sm font-semibold text-white/60 transition hover:text-portal-lime"
        >
          {t("portal.onboarding.pular")}
        </button>
      </div>
    </div>
  );
}
