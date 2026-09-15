import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Headset, HelpCircle, SendHorizontal } from "lucide-react";
import { Badge } from "../../design/ui/Badge";
import { Button } from "../../design/ui/Button";
import { Card } from "../../design/ui/Card";
import { Input } from "../../design/ui/Input";
import { enviarMensagemChat } from "../../services/endpoints";
import { getMomento } from "../../domain/momentos";

/** Rótulos que o motor do backend emite para handoff e dispensa. */
const ACAO_HANDOFF = "Falar com Atendimento";
const ACAO_DISPENSAR = "Agora não";

/**
 * Assistente virtual integrado ao Njila. Recebe o gatilho de jornada
 * e apresenta uma superfície única: mensagem proativa, conversa e
 * handoff para o Atendimento.
 */
export function PaolaWidget({ empresaId, momento, assistente, onAcao }) {
  const { t } = useTranslation();
  const [emAtendimento, setEmAtendimento] = useState(false);
  const [mostrarPorque, setMostrarPorque] = useState(false);
  const [texto, setTexto] = useState("");
  const [mensagens, setMensagens] = useState(() => mensagensIniciais(assistente, t));

  async function escolherAcao(acao) {
    setMensagens((atual) => [...atual, { autor: "usuario", texto: acao }]);
    setMostrarPorque(false);
    await onAcao(acao);

    if (acao === ACAO_HANDOFF) {
      setEmAtendimento(true);
      setMensagens((atual) => [
        ...atual,
        { autor: "sistema", texto: t("assistente.handoff_divisor") },
        { autor: "bot", texto: t("assistente.handoff_mensagem") },
      ]);
      return;
    }
    const resposta = acao === ACAO_DISPENSAR ? "assistente.dispensado" : "assistente.confirmacao";
    setMensagens((atual) => [...atual, { autor: "bot", texto: t(resposta) }]);
  }

  async function enviar() {
    const pergunta = texto.trim();
    if (!pergunta) return;
    setMensagens((atual) => [...atual, { autor: "usuario", texto: pergunta }]);
    setTexto("");
    const resposta = await enviarMensagemChat({ empresaId, mensagem: pergunta });
    setMensagens((atual) => [...atual, { autor: "bot", texto: resposta.resposta }]);
  }

  const momentoInfo = momento ? getMomento(momento) : null;

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-3 border-b border-ink-100 px-4 py-3">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-700">
          <Headset size={16} />
          <span
            className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white ${
              emAtendimento ? "bg-ink-400" : "bg-brand-500"
            }`}
          />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-ink-800">{t("assistente.paola_nome")}</p>
          <p className="flex items-center gap-1 text-xs text-ink-500">
            {emAtendimento && <Headset size={11} />}
            {emAtendimento ? t("assistente.paola_papel_humano") : t("assistente.paola_papel_ia")}
          </p>
        </div>
        {momentoInfo?.i18nKey && (
          <Badge variant={momentoInfo.variante} className="ml-auto">
            {t(momentoInfo.i18nKey)}
          </Badge>
        )}
      </div>

      <div className="max-h-80 space-y-3 overflow-y-auto p-4">
        {mensagens.map((mensagem, indice) => {
          if (mensagem.autor === "sistema") {
            return (
              <p key={indice} className="text-center text-xs font-medium text-ink-400">
                {mensagem.texto}
              </p>
            );
          }
          const meu = mensagem.autor === "usuario";
          return (
            <div key={indice} className={meu ? "flex flex-col items-end" : "flex flex-col items-start"}>
              <div
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                  meu ? "bg-brand-700 text-white" : "bg-surface-100 text-ink-800"
                }`}
              >
                {mensagem.texto}
              </div>

              {mensagem.acoes && !emAtendimento && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {mensagem.acoes.map((acao) => (
                    <Button
                      key={acao}
                      variant="secondary"
                      size="sm"
                      className="rounded-full"
                      onClick={() => escolherAcao(acao)}
                    >
                      {acao}
                    </Button>
                  ))}
                </div>
              )}

              {mensagem.acoes && (
                <button
                  onClick={() => setMostrarPorque((valor) => !valor)}
                  className="mt-2 inline-flex items-center gap-1 text-xs text-ink-400 hover:text-ink-600"
                >
                  <HelpCircle size={12} />
                  {t("assistente.porque")}
                </button>
              )}

              {mensagem.acoes && mostrarPorque && (
                <p className="mt-1 rounded-md bg-surface-50 p-2 text-xs text-ink-500">
                  {t("assistente.porque_explicacao")}{" "}
                  <strong>{momentoInfo?.i18nKey ? t(momentoInfo.i18nKey) : "—"}</strong>
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 border-t border-ink-100 p-3">
        <Input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enviar()}
          placeholder={
            emAtendimento ? t("assistente.chat_placeholder_humano") : t("assistente.chat_placeholder")
          }
        />
        <Button onClick={enviar} aria-label={t("assistente.chat_enviar")}>
          <SendHorizontal size={16} />
        </Button>
      </div>
    </Card>
  );
}

function mensagensIniciais(assistente, t) {
  if (assistente?.deve_exibir) {
    const { mensagem, acoes } = assistente.assistente;
    return [{ autor: "bot", texto: mensagem, acoes }];
  }
  return [{ autor: "bot", texto: t("assistente.sem_alerta") }];
}
