import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SendHorizontal } from "lucide-react";
import { Button } from "../../design/ui/Button";
import { Card, CardHeader } from "../../design/ui/Card";
import { Input } from "../../design/ui/Input";
import { enviarMensagemChat } from "../../services/endpoints";

/**
 * Chat de conversa livre com o Assistente. Estado local porque é efêmero —
 * não precisa sobreviver à troca de empresa (a página usa `key` para resetar).
 */
export function ChatPanel({ empresaId }) {
  const { t } = useTranslation();
  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState("");

  async function enviar() {
    const pergunta = texto.trim();
    if (!pergunta) return;
    setMensagens((atual) => [...atual, { autor: "usuario", texto: pergunta }]);
    setTexto("");
    const resposta = await enviarMensagemChat({ empresaId, mensagem: pergunta });
    setMensagens((atual) => [...atual, { autor: "bot", texto: resposta.resposta }]);
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>{t("assistente.chat_titulo")}</CardHeader>
      <div className="max-h-64 space-y-2 overflow-y-auto p-4">
        {mensagens.length === 0 && (
          <p className="text-sm text-slate-400">{t("assistente.chat_vazio")}</p>
        )}
        {mensagens.map((mensagem, indice) => (
          <div
            key={indice}
            className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
              mensagem.autor === "usuario"
                ? "ml-auto bg-brand-600 text-white"
                : "bg-slate-100 text-ink-800"
            }`}
          >
            {mensagem.texto}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 border-t border-slate-100 p-3">
        <Input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enviar()}
          placeholder={t("assistente.chat_placeholder")}
        />
        <Button onClick={enviar} aria-label={t("assistente.chat_enviar")}>
          <SendHorizontal size={16} />
        </Button>
      </div>
    </Card>
  );
}
