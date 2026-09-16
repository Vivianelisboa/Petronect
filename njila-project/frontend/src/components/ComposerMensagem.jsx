import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Mail, Phone, SendHorizontal, Sparkles, X } from "lucide-react";
import { Button } from "../design/ui/Button";
import { cn } from "../lib/cn";
import { ACOES } from "../domain/acoes";
import { CANAIS_ENVIO, CANAL_PADRAO_ENVIO, getCanal } from "../domain/eventos";

const ICONES_CANAL = {
  assistente_portal: Sparkles,
  email: Mail,
  telefone: Phone,
};

/**
 * Compositor de mensagem compartilhado (Central e Ficha): parte de um modelo
 * pronto por momento, permite ajuste, escolhe o canal e confirma o envio.
 * É a confirmação explícita antes de registrar a intervenção.
 */
export function ComposerMensagem({ empresa, tipoAcao, textoInicial, onCancelar, onEnviar, processando }) {
  const { t } = useTranslation();
  const [texto, setTexto] = useState(textoInicial);
  const [canal, setCanal] = useState(CANAL_PADRAO_ENVIO);
  const campoRef = useRef(null);

  useEffect(() => {
    campoRef.current?.focus();
    function handleKeyDown(event) {
      if (event.key === "Escape") onCancelar();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancelar]);

  function enviar() {
    const conteudo = texto.trim();
    if (!conteudo || processando) return;
    onEnviar(conteudo, canal);
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-ink-950/35 p-4 backdrop-blur-[2px]"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && onCancelar()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="composer-titulo"
         className="w-full max-w-lg rounded-2xl bg-white p-4 shadow-2xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="composer-titulo" className="text-base font-bold text-ink-900">
              {t(ACOES[tipoAcao])}
            </h2>
            <p className="mt-1 text-sm text-ink-500">
              {t("ficha.envio_para")} <span className="font-medium text-ink-700">{empresa}</span>
            </p>
          </div>
          <button
            type="button"
            aria-label={t("ficha.cancelar")}
            onClick={onCancelar}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-400 transition-colors hover:bg-surface-50 hover:text-ink-800"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5">
          <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-ink-400">
            {t("ficha.canal")}
          </span>
          <div role="radiogroup" aria-label={t("ficha.canal")} className="flex flex-wrap gap-1.5">
            {CANAIS_ENVIO.map((opcao) => {
              const Icone = ICONES_CANAL[opcao] || SendHorizontal;
              const selecionado = canal === opcao;
              return (
                <button
                  key={opcao}
                  type="button"
                  role="radio"
                  aria-checked={selecionado}
                  onClick={() => setCanal(opcao)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                    selecionado
                      ? "bg-brand-50 text-brand-800 ring-1 ring-brand-200"
                      : "text-ink-500 hover:bg-surface-50 hover:text-ink-800"
                  )}
                >
                  <Icone size={15} />
                  {t(getCanal(opcao))}
                </button>
              );
            })}
          </div>
        </div>

        <label className="mt-4 block">
          <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-ink-400">
            {t("ficha.mensagem")}
          </span>
          <textarea
            ref={campoRef}
            value={texto}
            onChange={(event) => setTexto(event.target.value)}
            rows={6}
            className="w-full resize-y rounded-xl border border-ink-200 bg-white p-3 text-sm leading-relaxed text-ink-800 outline-none transition placeholder:text-ink-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </label>

         <div className="mt-5 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs text-ink-400">{t("ficha.envio_aviso")}</span>
           <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={onCancelar}>
              {t("ficha.cancelar")}
            </Button>
            <Button size="sm" disabled={!texto.trim() || processando} onClick={enviar}>
              <SendHorizontal size={14} />
              {processando ? t("comum.registrando") : t("ficha.enviar")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
