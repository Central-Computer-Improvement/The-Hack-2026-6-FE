import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  // Telah diubah menjadi string sesuai aturan Tailwind terbaru
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        
        // Jembatan khusus untuk komponen Atoms & Molecules kita
        indigo: {
          base: "hsl(var(--indigo-base))",
          dark: "hsl(var(--indigo-dark))",
          mid: "hsl(var(--indigo-mid))",
          soft: "hsl(var(--indigo-soft))",
        },
        amber: {
          base: "hsl(var(--amber-base))",
          dark: "hsl(var(--amber-dark))",
          mid: "hsl(var(--amber-mid))",
          soft: "hsl(var(--amber-soft))",
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        
        // Jembatan radius khusus dari PRD
        btn: "var(--radius-btn)",     // 12px untuk tombol/input
        card: "var(--radius-card)",   // 20px untuk kartu/modal
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;