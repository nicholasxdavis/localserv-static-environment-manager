/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist Sans', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
      colors: {
        background: '#000000',
        surface: '#18181b',
        border: '#27272a',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(2px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    }
  },
  plugins: [],
}

