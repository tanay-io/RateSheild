import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./hooks/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        page: "var(--bg-page)",
        surface: "var(--bg-surface)",
        sidebar: "var(--bg-sidebar)",
        accent: "var(--bg-accent)",
        border: "var(--border)",
        primary: "var(--text-primary)",
        secondary: "var(--text-secondary)",
        muted: "var(--text-muted)",
        green: "var(--green)",
        red: "var(--red)",
        blue: "var(--blue)",
        amber: "var(--amber)"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"]
      },
      keyframes: {
        ticker: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" }
        },
        pulseDot: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.3)", opacity: "0.5" }
        },
        shimmer: {
          from: { backgroundPosition: "-220px 0" },
          to: { backgroundPosition: "220px 0" }
        },
        scrollPulse: {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "0.6" }
        }
      },
      animation: {
        ticker: "ticker 30s linear infinite",
        pulseDot: "pulseDot 2s ease-in-out infinite",
        shimmer: "shimmer 1.5s linear infinite",
        scrollPulse: "scrollPulse 2s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
