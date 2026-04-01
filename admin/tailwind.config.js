/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { mono: ['ui-monospace', 'monospace'] },
      colors: {
        brand: { DEFAULT: '#6366f1', hover: '#4f46e5' },
      },
    },
  },
  plugins: [],
};
