import { CheckCircle2, ClipboardList, Compass, CreditCard, Flame, Ghost } from "lucide-react";

/**
 * Ícone de cada momento da jornada — a cara do card, no espírito dos cards
 * de ícone do Portal. `Ghost` para "era ativa e sumiu" é intencional: a
 * empresa desapareceu.
 */
const ICONES = {
  chegou_perdeu: Compass,
  parou_cadastro: ClipboardList,
  quis_participar_travou: CreditCard,
  era_ativa_sumiu: Ghost,
  oportunidade_quente: Flame,
  jornada_concluida: CheckCircle2,
};

export function iconeDoMomento(momento) {
  return ICONES[momento] || Compass;
}
