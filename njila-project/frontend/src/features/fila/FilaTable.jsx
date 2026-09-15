import { useTranslation } from "react-i18next";
import { Eye, GraduationCap } from "lucide-react";
import { Badge } from "../../design/ui/Badge";
import { Button } from "../../design/ui/Button";
import { ScorePill } from "../../design/ui/ScorePill";
import { getMomento } from "../../domain/momentos";

/** Tabela da Fila de Hoje, ordenada por score (o backend já entrega ordenado). */
export function FilaTable({ fila, onVerFicha, onAcaoRapida }) {
  const { t } = useTranslation();

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3 font-medium">{t("fila.coluna_empresa")}</th>
            <th className="px-4 py-3 font-medium">{t("fila.coluna_momento")}</th>
            <th className="px-4 py-3 font-medium">{t("fila.coluna_score")}</th>
            <th className="px-4 py-3 font-medium">{t("fila.coluna_acao")}</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {fila.map((item) => {
            const momento = getMomento(item.momento);
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
                  <ScorePill score={item.score} />
                  <p className="mt-1 max-w-xs text-xs text-slate-500">{item.score_explicacao}</p>
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
