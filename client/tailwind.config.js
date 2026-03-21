/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'sony-black': '#000000',
        'sony-dark': '#404040',
        'sony-mid': '#7F7F7F',
        'sony-light': '#E5E5E5',
        'sony-white': '#FFFFFF',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
        editorial: ['Cormorant Garamond', 'serif'],
      },
    },
  },
  plugins: [],
};
