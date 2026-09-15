/**
 * design/tokens.js
 * Fonte única de verdade do design system. O `tailwind.config.js` importa
 * daqui, então mudar um tom aqui reflete em todo o painel. As escalas neutras
 * vêm das paletas oficiais do Tailwind (valores já testados para contraste);
 * `leaf` e `cream` são tons da marca, derivados dos hex oficiais.
 */
import colors from "tailwindcss/colors";

/** Verde da marca Petronect/Njila (#70bb44) e sua escala derivada. */
const LEAF = {
  50: "#f8fcf6",
  100: "#eef7e9",
  200: "#daedce",
  300: "#badea5",
  400: "#95cd75",
  500: "#70bb44",
  600: "#5e9d39",
  700: "#4a7b2d",
  800: "#385e22",
  900: "#284318",
};

/**
 * Cores da marca e da interface.
 * - `brand` (azul corporativo): ação — botões, navegação ativa, foco.
 * - `leaf` (verde #70bb44): jornada — trilha, progresso e estados positivos.
 * - `cream` (#f6efdf): fundo quente da página e blocos de destaque.
 * - `ink` (neutro): texto e superfícies brancas.
 */
export const palette = {
  brand: colors.blue,
  leaf: LEAF,
  cream: {
    50: "#fffefd",
    100: "#fefdfb",
    200: "#fdfbf7",
    300: "#fbf7f0",
    400: "#f6efdf",
    500: "#f6efdf",
    600: "#cfc9bb",
    700: "#a29e93",
    800: "#7b7870",
    900: "#595650",
  },
  ink: colors.slate,
};

/**
 * Cores semânticas de estado. Os componentes de UI expõem essas variantes
 * (ver design/ui/Badge.jsx) para que o domínio nunca precise conhecer
 * classes do Tailwind.
 */
export const status = {
  neutral: colors.slate,
  info: colors.sky,
  success: LEAF,
  warning: colors.amber,
  danger: colors.red,
  accent: colors.pink,
};

/** Sombras e raios padronizados para cards e superfícies elevadas. */
export const shadows = {
  card: "0 1px 2px 0 rgb(15 23 42 / 0.04), 0 1px 3px 0 rgb(15 23 42 / 0.08)",
};
