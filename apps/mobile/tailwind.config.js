/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],

  presets: [require("nativewind/preset")],

  theme: {
    extend: {
      colors: {
        brand: {
          50: "#FFF7F2",
          100: "#FFF1E8",
          200: "#FFD9C2",
          300: "#FFB580",
          400: "#FF914D",
          500: "#FF7A1A",
          600: "#EA580C",
          700: "#C2410C",
        },

        surface: {
          DEFAULT: "#FFFCFA",
          card: "#FFFFFF",
          muted: "#F8FAFC",
        },
      },
    },
  },

  plugins: [],
};
