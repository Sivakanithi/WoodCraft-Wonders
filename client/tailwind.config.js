
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#faf6f1",
          100: "#f3e8dc",
          200: "#e6cfb6",
          300: "#d8b58f",
          400: "#c89a67",
          500: "#b97f3f",
          600: "#955f28",
          700: "#6f451e",
          800: "#4a2f15",
          900: "#271a0c"
        }
      }
    },
  },
  plugins: [],
}
