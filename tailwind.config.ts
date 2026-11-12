import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"]
      },
      boxShadow: {
        glow: "0 0 30px rgba(6, 182, 212, 0.12)",
        "glow-violet": "0 0 30px rgba(139, 92, 246, 0.16)"
      }
    }
  },
  plugins: []
};

export default config;
