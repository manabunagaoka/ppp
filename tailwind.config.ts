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
        night: {
          950: "#030712",
          900: "#050a18",
          800: "#0c1224",
          700: "#111a32",
        },
        brand: {
          gold: "#f5ba27",
          pink: "#f15bb5",
          teal: "#1dd3b0",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "Geist Mono", "SFMono-Regular", "monospace"],
      },
      backgroundImage: {
        "grid-night":
          "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      backgroundSize: {
        grid: "80px 80px",
      },
      boxShadow: {
        "card-glow": "0 20px 45px rgba(0, 0, 0, 0.45)",
        "accent-ring": "0 0 0 1px rgba(245, 186, 39, 0.5)",
      },
    },
  },
  plugins: [],
};

export default config;
