/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        amarante: ['Amarante', 'serif'],
        federo: ['Federo', 'sans-serif'],
      },
      colors: {
        console:  '#C41E3A',
        archive:  '#5b28d1',
        execute:  '#1a8f34',
      },
    },
  },
  plugins: [],
}
