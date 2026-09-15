/**
 * design/tokens.js
 * Fonte única de verdade do design system. O `tailwind.config.js` importa
 * daqui, então mudar um tom aqui reflete em todo o painel. As escalas vêm
 * das paletas oficiais do Tailwind (valores já testados para contraste),
 * apenas renomeadas para o vocabulário do produto.
 */
import colors from "tailwindcss/colors";

/** Cores da marca e da interface. */
export const palette = {
  brand: colors.green, // verde Njila / Petronect
  ink: colors.blue, // azul profundo do Portal
};

/**
 * Cores semânticas de estado. Os componentes de UI expõem essas variantes
 * (ver design/ui/Badge.jsx) para que o domínio nunca precise conhecer
 * classes do Tailwind.
 */
export const status = {
  neutral: colors.slate,
  info: colors.blue,
  success: colors.green,
  warning: colors.amber,
  danger: colors.red,
  accent: colors.pink,
};

/** Sombras e raios padronizados para cards e superfícies elevadas. */
export const shadows = {
  card: "0 1px 2px 0 rgb(15 23 42 / 0.04), 0 1px 3px 0 rgb(15 23 42 / 0.08)",
};
