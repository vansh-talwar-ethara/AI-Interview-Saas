import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#07111f",
        surface: "#0f1b2d",
        panel: "#15263c",
        accent: "#f97316",
        mint: "#34d399",
        sand: "#f5e6c8",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.06), 0 24px 60px rgba(0,0,0,0.35)",
      },
    },
  },
  plugins: [],
} satisfies Config;
