import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#065f46",
          900: "#064e3b",
          950: "#022c22",
          dark: "#04261c",
        },
        ivory: {
          50: "#fffcf4",
          100: "#fef9ee",
          200: "#fdf4dc",
          300: "#fae8be",
          400: "#f5d595",
          500: "#ebb963",
          bg: "#fffcf4",
          card: "#ffffff",
          muted: "#f8f5ee",
        },
        gold: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          accent: "#c59f42",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Segoe UI", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        serif: ["var(--font-cinzel)", "Georgia", "Palatino Linotype", "serif"],
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(4, 38, 28, 0.06)",
        card: "0 10px 30px -4px rgba(4, 38, 28, 0.08)",
        gold: "0 8px 25px -4px rgba(197, 159, 66, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;

