/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pulseNavy: '#071120',
        pulseCard: '#0b162b',
        pulseBorder: '#162747',
        pulseRed: '#d92d34',
      }
    },
  },
  plugins: [],
}