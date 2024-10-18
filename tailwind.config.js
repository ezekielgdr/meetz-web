/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: 'var(--color-primary-light)',
          dark: 'var(--color-primary-dark)',
        },
        text: {
          light: 'var(--color-text-light)',
          dark: 'var(--color-text-dark)',
        },
        background: {
          light: 'var(--color-background-light)',
        },
      },
    },
  },
  plugins: [],
}