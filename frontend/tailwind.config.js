/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'custom' : {
          100: '#FFF2D7',
          200: '#FFE0B5',
          300: '#F8C794',
          400: '#D8AE7E'
        }
      },
    },
  },
  plugins: [],
}

