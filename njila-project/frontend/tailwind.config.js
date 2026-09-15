/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        njila: {
          green: "#4CAF50",
          blue: "#1e3a8a",
        },
      },
    },
  },
  plugins: [],
};
