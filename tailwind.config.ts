import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Theme-aware tokens, driven by CSS variables (channel triplets) so
        // every `bg-bg*` / `text-fg` / `*-fg/NN` flips with the .dark class.
        bg: {
          DEFAULT: "rgb(var(--bg) / <alpha-value>)",
          soft: "rgb(var(--bg-soft) / <alpha-value>)",
          card: "rgb(var(--bg-card) / <alpha-value>)",
          border: "rgb(var(--bg-border) / <alpha-value>)",
        },
        fg: "rgb(var(--fg) / <alpha-value>)",
        brand: {
          50: "#f3f1ff",
          100: "#e9e5ff",
          // 200/300 are used as emphasis *text* — theme-aware so they stay
          // readable on white (deep) and glowy on black (pale).
          200: "rgb(var(--brand-200) / <alpha-value>)",
          300: "rgb(var(--brand-300) / <alpha-value>)",
          400: "#8e75ff",
          500: "#6f4dff",
          600: "#5b32ff",
          700: "#4a24e6",
          800: "#3c1eb8",
          900: "#311b8f",
        },
        // Accent colors shift to deeper, accessible shades in light mode and
        // stay bright in dark; low-opacity bg tints still read well in both.
        accent: {
          pink: "rgb(var(--accent-pink) / <alpha-value>)",
          blue: "rgb(var(--accent-blue) / <alpha-value>)",
          teal: "rgb(var(--accent-teal) / <alpha-value>)",
          amber: "rgb(var(--accent-amber) / <alpha-value>)",
          red: "rgb(var(--accent-red) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "var(--shadow-glow)",
        soft: "var(--shadow-soft)",
      },
      backgroundImage: {
        "grad-brand": "linear-gradient(135deg,#6f4dff 0%,#ff5fa2 50%,#ffb35f 100%)",
        "grad-soft": "var(--grad-soft)",
        "grid-fade": "var(--grid-fade)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2.4s linear infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
