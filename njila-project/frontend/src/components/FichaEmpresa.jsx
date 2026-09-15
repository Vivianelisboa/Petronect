import { useEffect, useState } from "react";
import { buscarEmpresa, registrarAcao } from "../api";

export default function FichaEmpresa({ empresaId }) {
  const [empresa, setEmpresa] = useState(null);

  async function carregar() {
    if (!empresaId) return;
    const data = await buscarEmpresa(empresaId);
    setEmpresa(data);
  }

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [empresaId]);

  if (!empresaId) {
    return <div className="p-6 text-gray-500">Selecione uma empresa na Fila de Hoje.</div>;
  }
  if (!empresa) {
    return <div className="p-6 text-gray-500">Carregando ficha...</div>;
  }

  const { classificacao } = empresa;

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-start justify-between mb-1">
        <div>
          <h2 className="text-xl font-bold text-njila-blue">{empresa.nome_empresa}</h2>
          <p className="text-sm text-gray-500">{empresa.cnpj_mascarado} · {empresa.segmento}</p>
        </div>
        {classificacao && (
          <span className="px-3 py-1 rounded-full text-sm font-semibold bg-njila-blue text-white">
            {classificacao.score}/100
          </span>
        )}
      </div>

      {classificacao && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-blue-900">
          {classificacao.score_explicacao}
        </div>
      )}

      <h3 className="mt-6 mb-2 font-semibold text-gray-700">Linha do tempo da jornada</h3>
      <ol className="border-l-2 border-njila-green pl-4 space-y-3">
        {empresa.timeline.map((ev, i) => (
          <li key={i} className="relative">
            <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-njila-green" />
            <div className="text-xs text-gray-400">{ev.timestamp}</div>
            <div className="text-sm">
              <span className="font-medium">{ev.acao}</span>
              {ev.pagina && <span className="text-gray-500"> — {ev.pagina}</span>}
              {ev.oportunidade_id && (
                <span className="text-gray-400"> (oportunidade {ev.oportunidade_id})</span>
              )}
            </div>
          </li>
        ))}
      </ol>

      <h3 className="mt-6 mb-2 font-semibold text-gray-700">Registro de ações</h3>
      {empresa.historico_acoes.length === 0 ? (
        <p className="text-sm text-gray-400">Nenhuma ação registrada ainda.</p>
      ) : (
        <ul className="space-y-2">
          {empresa.historico_acoes.map((a) => (
            <li key={a.acao_id} className="text-sm border rounded-md p-2">
              <span className="font-medium">{a.tipo_acao}</span> via {a.canal} — {a.registrado_em}
              {a.mensagem_enviada && <div className="text-gray-500 italic">"{a.mensagem_enviada}"</div>}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex gap-2 flex-wrap">
        <BotaoAcao empresaId={empresaId} tipo="enviar_mensagem" label="Enviar mensagem" onFeito={carregar} />
        <BotaoAcao empresaId={empresaId} tipo="enviar_tutorial" label="Enviar tutorial" onFeito={carregar} />
        <BotaoAcao empresaId={empresaId} tipo="encaminhar_atendimento" label="Encaminhar ao Atendimento" onFeito={carregar} />
        <BotaoAcao empresaId={empresaId} tipo="marcar_resolvido" label="Marcar como resolvido" onFeito={carregar} />
      </div>
    </div>
  );
}

function BotaoAcao({ empresaId, tipo, label, onFeito }) {
  async function clicar() {
    await registrarAcao(empresaId, { tipo_acao: tipo, canal: "email", mensagem_enviada: label });
    onFeito();
  }
  return (
    <button
      onClick={clicar}
      className="text-sm px-3 py-1.5 rounded-md border hover:bg-gray-50"
    >
      {label}
    </button>
  );
}
