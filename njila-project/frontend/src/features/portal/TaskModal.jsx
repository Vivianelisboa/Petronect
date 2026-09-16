import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, X } from "lucide-react";

const OPORTUNIDADES = ["item1", "item2", "item3"];

/**
 * Modal de tarefa do portal: cadastro (form de demonstração), oportunidades
 * abertas (lista com prazos) e documentos (próximo passo apontado pela Paola).
 */
export function TaskModal({ task, registered, onClose, onRegister, onAbrirOportunidade }) {
  const { t } = useTranslation();
  const fecharRef = useRef(null);

  useEffect(() => {
    fecharRef.current?.focus();
    function fecharComEsc(evento) {
      if (evento.key === "Escape") onClose();
    }
    document.addEventListener("keydown", fecharComEsc);
    return () => document.removeEventListener("keydown", fecharComEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[55] grid place-items-center bg-portal-950/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tarefa-titulo"
      onMouseDown={(evento) => evento.target === evento.currentTarget && onClose()}
    >
      <div className="task-enter max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-portal-900 p-6 shadow-2xl sm:p-8">
        <button
          ref={fecharRef}
          type="button"
          onClick={onClose}
          aria-label={t("portal.tarefas.fechar")}
          className="float-right rounded-md p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {task === "cadastro" && (
          <ConteudoCadastro registered={registered} onRegister={onRegister} t={t} />
        )}

        {task === "oportunidades" && (
          <>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-portal-lime">
              {t("portal.tarefas.oportunidades.label")}
            </p>
            <h2 id="tarefa-titulo" className="font-display mt-2 text-2xl font-bold text-white">
              {t("portal.tarefas.oportunidades.titulo")}
            </h2>
            <div className="mt-5 space-y-3">
              {OPORTUNIDADES.map((chave) => (
                <button
                  key={chave}
                  type="button"
                  onClick={() => onAbrirOportunidade(chave)}
                  className="flex w-full items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[.04] p-4 text-left text-sm font-semibold text-white transition hover:border-portal-lime/60 hover:bg-white/[.07]"
                >
                  {t(`portal.tarefas.oportunidades.${chave}`)}
                  <ArrowRight className="h-4 w-4 shrink-0 text-portal-lime" />
                </button>
              ))}
            </div>
          </>
        )}

        {task === "documentos" && (
          <>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-portal-lime">
              {t("portal.tarefas.documentos.label")}
            </p>
            <h2 id="tarefa-titulo" className="font-display mt-2 text-2xl font-bold text-white">
              {t("portal.tarefas.documentos.titulo")}
            </h2>
            <p className="mt-4 leading-7 text-white/65">{t("portal.tarefas.documentos.texto")}</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 rounded-xl bg-portal-lime px-5 py-3 font-bold text-portal-950 transition hover:bg-portal-lime/90"
            >
              {t("portal.tarefas.documentos.acao")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function ConteudoCadastro({ registered, onRegister, t }) {
  const [enviado, setEnviado] = useState(registered);

  function registrar(evento) {
    evento.preventDefault();
    setEnviado(true);
    onRegister();
  }

  return (
    <>
      <p className="text-xs font-bold uppercase tracking-[.16em] text-portal-lime">
        {t("portal.tarefas.cadastro.label")}
      </p>
      <h2 id="tarefa-titulo" className="font-display mt-2 text-2xl font-bold text-white">
        {enviado ? t("portal.tarefas.cadastro.titulo_ok") : t("portal.tarefas.cadastro.titulo")}
      </h2>

      {enviado ? (
        <p className="mt-4 leading-7 text-white/65">{t("portal.tarefas.cadastro.ok")}</p>
      ) : (
        <form onSubmit={registrar} className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-bold text-white/85 sm:col-span-2">
            {t("portal.tarefas.cadastro.razao")}
            <input
              required
              autoComplete="organization"
              placeholder={t("portal.tarefas.cadastro.razao_ph")}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 p-3 font-normal text-white outline-none transition placeholder:text-white/35 focus:border-portal-lime/60"
            />
          </label>
          <label className="text-sm font-bold text-white/85">
            {t("portal.tarefas.cadastro.cnpj")}
            <input
              required
              inputMode="numeric"
              placeholder={t("portal.tarefas.cadastro.cnpj_ph")}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 p-3 font-normal text-white outline-none transition placeholder:text-white/35 focus:border-portal-lime/60"
            />
          </label>
          <label className="text-sm font-bold text-white/85">
            {t("portal.tarefas.cadastro.email")}
            <input
              required
              type="email"
              autoComplete="email"
              placeholder={t("portal.tarefas.cadastro.email_ph")}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 p-3 font-normal text-white outline-none transition placeholder:text-white/35 focus:border-portal-lime/60"
            />
          </label>
          <button
            type="submit"
            className="rounded-xl bg-portal-lime px-5 py-3 font-bold text-portal-950 transition hover:bg-portal-lime/90 sm:col-span-2"
          >
            {t("portal.tarefas.cadastro.acao")}
          </button>
        </form>
      )}
    </>
  );
}
