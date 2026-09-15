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
 * Cores da marca Petronect e da interface Njila.
 * - `brand` (verde #70bb44): cor primária da marca — CTAs, destaques, progresso.
 * - `ink` (slate): texto, bordas e superfícies neutras.
 * - `surface` (warm gray): fundos sutis para cards e seções.
 * 
 * Design principle: fundo branco como base, verde usado com disciplina
 * como acento de marca, nunca como fundo principal.
 */
export const palette = {
  brand: LEAF,
  ink: colors.slate,
  surface: {
    50: "#fafaf9",
    100: "#f5f5f4",
    200: "#e7e5e4",
    300: "#d6d3d1",
    400: "#a8a29e",
    500: "#78716c",
    600: "#57534e",
    700: "#44403c",
    800: "#292524",
    900: "#1c1917",
  },
};

/**
 * Paleta do Portal do fornecedor — azul profundo + verde-lima, a experiência
 * que o fornecedor vive no Portal Petronect. É mantida separada da paleta
 * corporativa do Njila de propósito: o portal é a "rua", o painel é a "sala".
 */
export const portal = {
  950: "#0D1B4C",
  900: "#132466",
  800: "#1C3184",
  700: "#2A44A6",
  lime: "#8DC63F",
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
