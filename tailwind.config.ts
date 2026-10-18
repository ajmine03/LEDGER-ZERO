import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/domain/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#F7F8F5",
        surface: "#FFFFFF",
        brand: {
          50: "#f0f6f2",
          100: "#dceade",
          200: "#bad7c0",
          300: "#8ebc98",
          400: "#5d9c6c",
          500: "#3d7e4d",
          600: "#2d633b",
          700: "#244e30",
          800: "#1e3f28",
          900: "#183B2A", // Deep forest green
          950: "#0c1f16",
        },
        forest: {
          DEFAULT: "#183B2A",
          dark: "#10281c",
          light: "#25533d",
          action: "#14532D",
          actionHover: "#166534",
        },
        lime: {
          accent: "#D9F99D",
          accentHover: "#BEF264",
          light: "#ECFCCB",
        },
        slateSurface: {
          50: "#F7F8F5",
          100: "#EDF1EE",
          200: "#E2E8E4",
          300: "#CAD3CD",
        },
        risk: {
          50: "#FEF2F2",
          100: "#FEE2E2",
          500: "#EF4444",
          600: "#DC2626",
          700: "#B91C1C",
        },
        warning: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
        },
        success: {
          50: "#ECFDF5",
          100: "#D1FAE5",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(24, 59, 42, 0.05), 0 1px 2px -1px rgba(24, 59, 42, 0.05)",
        cardHover: "0 4px 6px -1px rgba(24, 59, 42, 0.08), 0 2px 4px -2px rgba(24, 59, 42, 0.06)",
        dropdown: "0 10px 15px -3px rgba(24, 59, 42, 0.1), 0 4px 6px -4px rgba(24, 59, 42, 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
