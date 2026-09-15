import { useCallback } from "react";
import { useAsync } from "./useAsync";
import { buscarFilaHoje } from "../services/endpoints";

/**
 * Fila de Hoje. Filtra por momento (opcional) e limita a quantidade.
 * Devolve sempre um array (`fila`) para simplificar o consumo na UI.
 */
export function useFilaHoje({ momento, limit } = {}) {
  const buscar = useCallback(() => buscarFilaHoje({ momento, limit }), [momento, limit]);
  const { dados, carregando, erro, recarregar } = useAsync(buscar, [momento, limit]);

  return {
    fila: dados?.fila ?? [],
    total: dados?.total ?? 0,
    carregando,
    erro,
    recarregar,
  };
}
