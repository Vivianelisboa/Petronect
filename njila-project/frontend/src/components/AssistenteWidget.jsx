import { useEffect, useState } from "react";
import { buscarFilaHoje, buscarAssistente, enviarMensagemChat, registrarAcao } from "../api";

/**
 * Simula a experiência do FORNECEDOR ao logar no Portal: o card do
 * Assistente aparece sozinho quando o Njila identifica uma situação
 * (taxa pendente, cadastro incompleto, etc.) — exatamente como descrito
 * no MVP. Abaixo dele, um chat de conversa livre para perguntas soltas.
 */
export default function AssistenteWidget() {
  const [empresas, setEmpresas] = useState([]);
  const [empresaId, setEmpresaId] = useState("");
  const [assistente, setAssistente] = useState(null);
  const [mensagens, setMensagens] = useState([]);
  const [textoChat, setTextoChat] = useState("");

  useEffect(() => {
    buscarFilaHoje({ limit: 60 }).then((data) => setEmpresas(data.fila));
  }, []);

  useEffect(() => {
    if (!empresaId) return;
    setMensagens([]);
    buscarAssistente(empresaId).then(setAssistente);
  }, [empresaId]);

  async function handleAcaoAssistente(acao) {
    // No protótipo, qualquer ação clicada já registra automaticamente
    // (no Portal real, "Continuar pagamento" levaria a empresa para lá)
    if (acao !== "Agora não") {
      await registrarAcao(empresaId, {
        tipo_acao: "enviar_mensagem",
        canal: "assistente_portal",
        mensagem_enviada: `Fornecedor clicou: "${acao}"`,
      });
    }
    setMensagens((m) => [...m, { autor: "usuario", texto: acao }]);
  }

  async function enviarChat() {
    if (!textoChat.trim()) return;
    const pergunta = textoChat;
    setMensagens((m) => [...m, { autor: "usuario", texto: pergunta }]);
    setTextoChat("");
    const resp = await enviarMensagemChat({ empresaId, mensagem: pergunta });
    setMensagens((m) => [...m, { autor: "bot", texto: resp.resposta }]);
  }

  return (
    <div className="p-6 max-w-xl">
      <label className="block text-sm font-medium text-gray-600 mb-1">
        Simular login de qual empresa? (visão do fornecedor no Portal)
      </label>
      <select
        value={empresaId}
        onChange={(e) => setEmpresaId(e.target.value)}
        className="w-full border rounded-md px-3 py-2 mb-4"
      >
        <option value="">Selecione uma empresa...</option>
        {empresas.map((e) => (
          <option key={e.empresa_id} value={e.empresa_id}>{e.nome_empresa}</option>
        ))}
      </select>

      {empresaId && assistente && (
        <div className="rounded-xl border shadow-sm overflow-hidden mb-4">
          {assistente.deve_exibir ? (
            <div className="bg-white">
              <div className="bg-njila-blue text-white px-4 py-3 font-semibold">
                {assistente.assistente.titulo}
              </div>
              <div className="p-4 text-sm text-gray-700">{assistente.assistente.mensagem}</div>
              <div className="p-3 pt-0 flex flex-wrap gap-2">
                {assistente.assistente.acoes.map((acao) => (
                  <button
                    key={acao}
                    onClick={() => handleAcaoAssistente(acao)}
                    className="text-xs px-3 py-1.5 rounded-full border hover:bg-gray-50"
                  >
                    {acao}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 text-sm text-gray-500 bg-gray-50">
              Nenhum alerta no momento — jornada concluída para esta empresa.
            </div>
          )}
        </div>
      )}

      {empresaId && (
        <div className="border rounded-xl overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 text-sm font-medium text-gray-600">
            Converse com o Assistente
          </div>
          <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
            {mensagens.map((m, i) => (
              <div
                key={i}
                className={`text-sm max-w-[80%] rounded-lg px-3 py-2 ${
                  m.autor === "usuario"
                    ? "bg-njila-green text-white ml-auto"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {m.texto}
              </div>
            ))}
          </div>
          <div className="flex border-t">
            <input
              value={textoChat}
              onChange={(e) => setTextoChat(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && enviarChat()}
              placeholder="Digite sua dúvida..."
              className="flex-1 px-3 py-2 text-sm outline-none"
            />
            <button onClick={enviarChat} className="px-4 text-sm font-medium text-njila-green">
              Enviar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
