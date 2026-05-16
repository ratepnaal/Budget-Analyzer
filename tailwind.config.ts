import type { Config } from "tailwindcss";

const config: Config = {
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#40E0D0',
          dark: '#006a62',
        },
        secondary: {
          DEFAULT: '#1A2B3C',
        },
        surface: '#F7FAFC',
        'outline-variant': '#D0D7DE',
        error: '#DC2626',
      },
      borderRadius: {
        'card': '12px',
      }
    },
  },  
   plugins: []
};

export default config;