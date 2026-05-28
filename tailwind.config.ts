import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          dark: 'var(--color-primary-dark)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
        },
        surface: 'var(--color-surface)',
        'surface-container': 'var(--color-surface-container)',
        'outline-variant': 'var(--color-outline-variant)',
        error: 'var(--color-error)',
      },
      borderRadius: {
        'card': '12px',
      }
    },
  },  
   plugins: []
};

export default config;