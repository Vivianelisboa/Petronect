import { useTranslation } from "react-i18next";
import { CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "../../design/ui/Button";
import { Card } from "../../design/ui/Card";

/**
 * Card proativo que o fornecedor veria ao logar no Portal. As ações vêm do
 * backend (motor de regras), então são strings prontas — não chaves de i18n.
 */
export function AssistenteCard({ assistente, onAcao }) {
  const { t } = useTranslation();
  if (!assistente) return null;

  if (!assistente.deve_exibir) {
    return (
      <Card className="flex items-center gap-2 p-4 text-sm text-slate-500">
        <CheckCircle2 size={16} className="text-brand-600" />
        {t("assistente.sem_alerta")}
      </Card>
    );
  }

  const { titulo, mensagem, acoes } = assistente.assistente;

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-2 bg-ink-700 px-4 py-3 font-semibold text-white">
        <Sparkles size={16} />
        {titulo}
      </div>
      <p className="p-4 text-sm text-ink-700">{mensagem}</p>
      <div className="flex flex-wrap gap-2 px-4 pb-4">
        {acoes.map((acao) => (
          <Button
            key={acao}
            variant="secondary"
            size="sm"
            className="rounded-full"
            onClick={() => onAcao(acao)}
          >
            {acao}
          </Button>
        ))}
      </div>
    </Card>
  );
}
