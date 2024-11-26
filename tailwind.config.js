/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        moveUp: {
          '0%': { transform: 'translateY(-120vh)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        moveUp: 'moveUp 2s ease-out forwards',
      },
    },
  },
  plugins: [],
}

