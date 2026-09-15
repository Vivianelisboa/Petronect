import { palette, shadows } from "./src/design/tokens.js";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: palette.brand,
        ink: palette.ink,
        surface: palette.surface,
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        display: ["Garet", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: shadows.card,
      },
    },
  },
  plugins: [],
};
