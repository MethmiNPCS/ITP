/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        bebas: ['Bebas Neue', 'sans-serif'],
      },
      animation: {
        zoom: 'zoom 10s infinite',
      },
      keyframes: {
        zoom: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' } 
        },
      },
    },
  },
  plugins: [],
}

