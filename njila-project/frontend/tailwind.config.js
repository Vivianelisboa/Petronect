import { palette, shadows } from "./src/design/tokens.js";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: palette.brand,
        leaf: palette.leaf,
        cream: palette.cream,
        ink: palette.ink,
      },
      fontFamily: {
        sans: ["Garet", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
      },
      boxShadow: {
        card: shadows.card,
      },
    },
  },
  plugins: [],
};
