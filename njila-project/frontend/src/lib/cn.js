import clsx from "clsx";

/**
 * Junta classes condicionais. Atalho para o `clsx`, centralizado para que
 * todos os componentes de UI concatenem classes do mesmo jeito.
 */
export function cn(...inputs) {
  return clsx(inputs);
}
