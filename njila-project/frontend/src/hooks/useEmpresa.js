import { useCallback } from "react";
import { useAsync } from "./useAsync";
import { buscarEmpresa } from "../services/endpoints";

/** Ficha completa de uma empresa (dados + classificação + timeline + ações). */
export function useEmpresa(empresaId) {
  const buscar = useCallback(() => {
    if (!empresaId) return Promise.resolve(null);
    return buscarEmpresa(empresaId);
  }, [empresaId]);

  const { dados, carregando, erro, recarregar } = useAsync(buscar, [empresaId]);
  return { empresa: dados, carregando, erro, recarregar };
}
