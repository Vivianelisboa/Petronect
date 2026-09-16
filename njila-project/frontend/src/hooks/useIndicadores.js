import { useCallback } from "react";
import { useAsync } from "./useAsync";
import { buscarIndicadores } from "../services/endpoints";

/** Indicadores agregados da Visão analítica (por período). */
export function useIndicadores(periodo = 30) {
  const buscar = useCallback(() => buscarIndicadores({ periodo }), [periodo]);
  const { dados, carregando, erro, recarregar } = useAsync(buscar, [periodo]);
  return { indicadores: dados, carregando, erro, recarregar };
}
