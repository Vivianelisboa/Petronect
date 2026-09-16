import { useCallback } from "react";
import { useAsync } from "./useAsync";
import { buscarAssistente } from "../services/endpoints";

/** Card proativo do Assistente para uma empresa (visão do fornecedor). */
export function useAssistente(empresaId) {
  const buscar = useCallback(() => {
    if (!empresaId) return Promise.resolve(null);
    return buscarAssistente(empresaId);
  }, [empresaId]);

  const { dados, carregando, erro } = useAsync(buscar, [empresaId]);
  return { assistente: dados, carregando, erro };
}
