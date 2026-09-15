import { useTranslation } from "react-i18next";
import { Eye, GraduationCap } from "lucide-react";
import { Badge } from "../../design/ui/Badge";
import { Button } from "../../design/ui/Button";
import { PriorityBadge } from "../../design/ui/PriorityBadge";
import { getMomento } from "../../domain/momentos";
import { getSituacao } from "../../domain/situacao";

/** Tabela da Fila de Hoje, ordenada por prioridade (o backend já entrega ordenado). */
export function FilaTable({ fila, onVerFicha, onAcaoRapida }) {
  const { t } = useTranslation();

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3 font-medium">{t("fila.coluna_empresa")}</th>
            <th className="px-4 py-3 font-medium">{t("fila.coluna_momento")}</th>
            <th className="px-4 py-3 font-medium">{t("fila.coluna_prioridade")}</th>
            <th className="px-4 py-3 font-medium">{t("fila.coluna_situacao")}</th>
            <th className="px-4 py-3 font-medium">{t("fila.coluna_proximo_passo")}</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {fila.map((item) => {
            const momento = getMomento(item.momento);
            const situacao = getSituacao(item.situacao);
            return (
              <tr key={item.empresa_id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-ink-800">{item.nome_empresa}</div>
                  <div className="text-xs text-slate-500">{item.segmento}</div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={momento.variante}>
                    {momento.i18nKey ? t(momento.i18nKey) : item.momento}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <PriorityBadge score={item.score} />
                  <p className="mt-1 max-w-xs text-xs text-slate-500">{item.score_explicacao}</p>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={situacao.variante}>
                    {situacao.i18nKey ? t(situacao.i18nKey) : item.situacao}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-slate-600">{item.acao_recomendada}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2 whitespace-nowrap">
                    <Button variant="secondary" size="sm" onClick={() => onVerFicha(item.empresa_id)}>
                      <Eye size={14} />
                      {t("comum.ver_ficha")}
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => onAcaoRapida(item.empresa_id)}>
                      <GraduationCap size={14} />
                      {t("fila.enviar_tutorial")}
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
