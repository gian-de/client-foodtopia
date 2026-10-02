/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/components/**/*.{js,vue,ts}",
    "./app/layouts/**/*.vue",
    "./app/pages/**/*.vue",
    "./app/plugins/**/*.{js,ts}",
    "./app/app.vue",
    "./app/error.vue",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fef6f3",
          100: "#fdeee8",
          500: "#c75a3a",
          600: "#b04e32",
          700: "#934228",
        },
      },
    },
  },
  plugins: [],
};
