import { nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
       /* NEW: connect Tailwind font utilities to your CSS variables
         (set in layout.tsx via Montserrat + Source Sans Pro) */
      fontFamily: {
        // used by `font-sans`
        sans: [
          "var(--font-body)",
          "Source Sans Pro",
          "ui-sans-serif",
          "system-ui",
        ],
        
        heading: [
          "var(--font-heading)",
          "Montserrat",
          "ui-sans-serif",
          "system-ui",
        ],
      },

      screens: {
        zs: {max: "1200px"}, // kicks in around 150-175% zoom
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
export default config;
