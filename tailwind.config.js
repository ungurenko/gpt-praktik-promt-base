/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./context/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}" // Catch files in root like App.tsx if they were moved
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        stone: {
          50: 'rgb(var(--bg-page-rgb) / <alpha-value>)',
          100: 'rgb(var(--border-color-rgb) / <alpha-value>)',
          200: 'rgb(var(--border-color-rgb) / <alpha-value>)',
          300: 'rgb(var(--text-muted-rgb) / <alpha-value>)',
          400: 'rgb(var(--text-muted-rgb) / <alpha-value>)',
          500: 'rgb(var(--text-secondary-rgb) / <alpha-value>)',
          600: 'rgb(var(--text-secondary-rgb) / <alpha-value>)',
          800: 'rgb(var(--text-main-rgb) / <alpha-value>)',
          900: 'rgb(var(--text-main-rgb) / <alpha-value>)',
        },
        orange: {
          50: 'rgba(255, 85, 0, 0.1)', 
          500: '#FF5500', 
          600: '#E04800',
        }
      },
      borderRadius: {
        '4xl': '2.5rem',
        '5xl': '3rem',
      },
      boxShadow: {
        'glass': '0 4px 20px 0 var(--shadow-color)', 
        'soft': '0 10px 25px -5px var(--shadow-color)',
        'glow': '0 0 20px rgba(251, 146, 60, 0.15)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}