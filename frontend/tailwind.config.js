/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        netflix: {
          black: '#000000',
          dark: '#141414',
          red: '#E50914',
          gray: '#808080',
        },
        premium: {
          bg: '#0f0c29',
          gradient: 'linear-gradient(to right, #0f0c29, #302b63, #24243e)',
          card: 'rgba(255, 255, 255, 0.05)',
          border: 'rgba(255, 255, 255, 0.1)',
        },
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        accent: {
          purple: '#8b5cf6',
          pink: '#ec4899',
          blue: '#3b82f6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(14, 165, 233, 0.3)',
        'glow-accent': '0 0 20px rgba(139, 92, 246, 0.3)',
      }
    },
  },
  plugins: [],
}
