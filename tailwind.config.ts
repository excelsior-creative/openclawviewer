import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Forge AI Brand Colors
        forge: {
          bg: "#0a0a0f",
          card: "#111118",
          "card-hover": "#18181f",
          border: "#2a2a3a",
          yellow: "#f59e0b",
          orange: "#f97316",
          amber: "#fbbf24",
          text: "#fafafa",
          muted: "#a1a1aa",
          accent: "#f97316",
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "forge-gradient": "linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #ea580c 100%)",
        "forge-glow": "radial-gradient(ellipse at center, rgba(249,115,22,0.15) 0%, transparent 70%)",
      },
      boxShadow: {
        "forge": "0 0 20px rgba(249,115,22,0.3)",
        "forge-lg": "0 0 40px rgba(249,115,22,0.4)",
      },
    },
  },
  plugins: [],
} satisfies Config;
