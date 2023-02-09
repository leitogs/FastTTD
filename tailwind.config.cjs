/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        faded: "faded 0s 2s ease-out",
      },
      keyframes: {
        faded: {
          to: {
            opacity: "0",
          },
        },
      },
    },
  },
  plugins: [],
};
