/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif'],
      },
      colors: {
        'spmh-maroon': '#7B1A2E',
        'spmh-crimson': '#860E0E',
      },
    },
  },
  plugins: [],
};
