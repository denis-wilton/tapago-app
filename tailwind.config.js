/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0E66D8",
        secondary: "#FFFFFF",
      },
      backgroundColor: {
        primary: "#0E66D8",
        secondary: "#FFFFFF",
      },
      textColor: {
        primary: "#FFFFFF",
        secondary: "#000000",
      },
    },
  },
  plugins: [],
};
