import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "rgb(var(--color-paper) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        primary: {
          DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
          bright: "rgb(var(--color-primary-bright) / <alpha-value>)",
          dark: "rgb(var(--color-primary-dark) / <alpha-value>)",
        },
        profit: "rgb(var(--color-profit) / <alpha-value>)",
        expense: "rgb(var(--color-expense) / <alpha-value>)",
        gold: "rgb(var(--color-gold) / <alpha-value>)",
        violet: "rgb(var(--color-violet) / <alpha-value>)",
      },
      fontFamily: {
        display: ["Fraunces", "ui-serif", "Georgia", "serif"],
        body: ["\"IBM Plex Sans\"", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "14px",
      },
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "pop-in": {
          from: { opacity: "0", transform: "scale(0.96) translateY(6px)" },
          to: { opacity: "1", transform: "scale(1) translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
        "pop-in": "pop-in 0.25s cubic-bezier(0.16,1,0.3,1)",
      },
    },
  },
  plugins: [],
} satisfies Config;
