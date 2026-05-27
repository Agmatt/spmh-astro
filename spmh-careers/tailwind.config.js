/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Tell Tailwind to scan these files for class names
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Adding SPMH brand colors
      colors: {
        maroon: {
          50:  '#f5e6e6',
          100: '#e6cccc',
          200: '#cc9999',
          300: '#b36666',
          400: '#993333',
          500: '#860E0E',
          600: '#7B1A2E',
          700: '#6B1525',
          800: '#4a0e1a',
          900: '#2d0910',
        }
      }
    },
  },
  plugins: [],
}