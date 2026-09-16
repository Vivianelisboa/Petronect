import { useCallback } from "react";
import { useAsync } from "./useAsync";
import { buscarFilaHoje } from "../services/endpoints";

/**
 * Fila de Hoje. Filtra por momento (opcional) e limita a quantidade.
 * Devolve sempre um array (`fila`) para simplificar o consumo na UI.
 */
export function useFilaHoje({ momento, limit, data } = {}) {
  const buscar = useCallback(() => buscarFilaHoje({ momento, limit, data }), [momento, limit, data]);
  const { dados, carregando, erro, recarregar } = useAsync(buscar, [momento, limit, data]);

  return {
    fila: dados?.fila ?? [],
    total: dados?.total ?? 0,
    carregando,
    erro,
    recarregar,
  };
}
