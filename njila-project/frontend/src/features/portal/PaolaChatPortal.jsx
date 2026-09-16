import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Bot, Send, X } from "lucide-react";
import { enviarMensagemChat } from "../../services/endpoints";
import { saudacaoPorPerfil, responderOffline } from "./paolaUi";

const EMPRESA_DEMO = "E001";

/**
 * Chat da Paola dentro do Portal do fornecedor. Abre como diálogo flutuante
 * com saudação contextual ao perfil e ações sugeridas; conversa livre vai
 * para o backend real (/chat) e cai num fallback offline por palavra-chave
 * quando o serviço não responde.
 */
export function PaolaChatPortal({ perfil, onClose, onAbrirTask, onNotificar }) {
  const { t } = useTranslation();
  const [mensagens, setMensagens] = useState(() => {
    const { texto, acoes } = saudacaoPorPerfil(perfil);
    return [{ autor: "paola", texto, acoes }];
  });
  const [pergunta, setPergunta] = useState("");
  const [pensando, setPensando] = useState(false);
  const fecharRef = useRef(null);

  useEffect(() => {
    fecharRef.current?.focus();
    function fecharComEsc(evento) {
      if (evento.key === "Escape") onClose();
    }
    document.addEventListener("keydown", fecharComEsc);
    return () => document.removeEventListener("keydown", fecharComEsc);
  }, [onClose]);

  function escolherAcao(acao) {
    setMensagens((atual) => [...atual, { autor: "usuario", texto: acao }]);

    if (acao === "Continuar cotação") {
      onAbrirTask("oportunidades");
      setMensagens((atual) => [...atual, { autor: "paola", texto: t("portal.paola.resp_continuar") }]);
    } else if (acao === "Ver pendências") {
      onAbrirTask("documentos");
      setMensagens((atual) => [...atual, { autor: "paola", texto: t("portal.paola.resp_pendencias") }]);
    } else if (acao === "Falar com Atendimento") {
      onNotificar(t("portal.paola.atendimento_toast"));
      setMensagens((atual) => [
        ...atual,
        { autor: "sistema", texto: t("portal.paola.divisor_atendimento") },
        { autor: "paola", texto: t("portal.paola.resp_atendimento") },
      ]);
    } else {
      setMensagens((atual) => [...atual, { autor: "paola", texto: t("portal.paola.resp_dispensado") }]);
    }
  }

  async function enviar(evento) {
    evento.preventDefault();
    const texto = pergunta.trim();
    if (!texto || pensando) return;

    setMensagens((atual) => [...atual, { autor: "usuario", texto }]);
    setPergunta("");
    setPensando(true);

    try {
      const resposta = await enviarMensagemChat({ empresaId: EMPRESA_DEMO, mensagem: texto });
      setMensagens((atual) => [...atual, { autor: "paola", texto: resposta.resposta }]);
    } catch {
      setMensagens((atual) => [
        ...atual,
        { autor: "sistema", texto: t("portal.paola.modo_demo") },
        { autor: "paola", texto: responderOffline(texto) },
      ]);
    } finally {
      setPensando(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-end bg-portal-950/40 p-4 backdrop-blur-[2px] sm:p-6"
      role="presentation"
      onMouseDown={(evento) => evento.target === evento.currentTarget && onClose()}
    >
      <section
        className="chat-enter flex h-[min(600px,calc(100dvh-2rem))] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-white/10 bg-portal-900 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="paola-portal-titulo"
      >
        <header className="flex items-center justify-between bg-portal-950 px-5 py-4 text-white">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-portal-lime text-portal-950">
              <Bot className="h-5 w-5" />
            </span>
            <div>
              <p id="paola-portal-titulo" className="font-bold">
                {t("portal.paola.nome")}
              </p>
              <p className="text-xs text-white/60">{t("portal.paola.papel")}</p>
            </div>
          </div>
          <button
            ref={fecharRef}
            type="button"
            onClick={onClose}
            aria-label={t("portal.paola.fechar")}
            className="rounded-md p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 space-y-3 overflow-y-auto bg-portal-900 p-5" aria-live="polite" aria-busy={pensando}>
          {mensagens.map((mensagem, indice) => {
            if (mensagem.autor === "sistema") {
              return (
                <p key={indice} className="text-center text-xs font-semibold text-white/40">
                  {mensagem.texto}
                </p>
              );
            }
            const meu = mensagem.autor === "usuario";
            return (
              <div key={indice} className="flex flex-col items-start">
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-sm leading-6 ${
                    meu ? "ml-auto bg-portal-lime text-portal-950" : "bg-white/10 text-white"
                  }`}
                >
                  {mensagem.texto}
                </div>
                {mensagem.acoes?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {mensagem.acoes.map((acao) => (
                      <button
                        key={acao}
                        type="button"
                        onClick={() => escolherAcao(acao)}
                        className="rounded-full border border-portal-lime/50 px-3 py-1.5 text-xs font-bold text-portal-lime transition hover:bg-portal-lime/10"
                      >
                        {acao}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {pensando && (
            <p className="flex items-center gap-2 text-sm text-white/50">
              <span className="inline-flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-portal-lime [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-portal-lime [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-portal-lime" />
              </span>
              {t("portal.paola.pensando")}
            </p>
          )}
        </div>

        <form onSubmit={enviar} className="flex items-center gap-2 border-t border-white/10 bg-portal-950 p-3">
          <label htmlFor="paola-portal-mensagem" className="sr-only">
            {t("portal.paola.placeholder")}
          </label>
          <input
            id="paola-portal-mensagem"
            value={pergunta}
            onChange={(evento) => setPergunta(evento.target.value)}
            disabled={pensando}
            placeholder={t("portal.paola.placeholder")}
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-portal-lime/60 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={pensando}
            aria-label={t("portal.paola.enviar")}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-portal-lime text-portal-950 transition hover:bg-portal-lime/90 disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </section>
    </div>
  );
}
