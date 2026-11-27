/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff8ff",
          100: "#dceeff",
          200: "#b9e0ff",
          300: "#7cc9ff",
          400: "#36adf5",
          500: "#108ce0",
          600: "#086fbe",
          700: "#09599a",
          800: "#0d4c7f",
          900: "#123f68",
        },
        ink: "#172b4d",
        muted: "#6b7b93",
        canvas: "#f5f8fc",
        emergency: "#e5484d",
      },
      boxShadow: {
        card: "0 8px 24px rgba(30, 64, 112, 0.06)",
        popover: "0 16px 48px rgba(23, 43, 77, 0.18)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
