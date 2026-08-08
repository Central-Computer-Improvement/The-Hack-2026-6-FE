import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-nunito-sans)", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        indigo: {
          base: "#6C5CE7",
          dark: "#4834D4",
          mid: "#A29BFE",
          soft: "#F0EEFF",
        },
        amber: {
          base: "#FF9F43",
          dark: "#E67E22",
          mid: "#FECA57",
          soft: "#FFF9EC",
        },
      },
      borderRadius: {
        // Utility classes 
        lg: "var(--radius)", 
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        btn: "12px",     
        card: "20px",    
        modal: "24px",   
      },
      fontSize: {
        "display-hero": ["48px", { fontWeight: "800", lineHeight: "1.2" }], 
        "headline-large": ["32px", { fontWeight: "700", lineHeight: "1.3" }], 
        "headline-medium": ["24px", { fontWeight: "700", lineHeight: "1.4" }], 
        "body-large": ["18px", { fontWeight: "400", lineHeight: "1.5" }], 
        "body-medium": ["16px", { fontWeight: "400", lineHeight: "1.5" }], 
        "label-bold": ["14px", { fontWeight: "700", lineHeight: "1.2" }], 
      },
    },
  },
  plugins: [require("tailwindcss-animate")], 
};

export default config;