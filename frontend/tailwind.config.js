/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eef2f9', 100: '#d9e2f1', 200: '#b3c5e3', 300: '#7f9ccb',
          400: '#4d71ad', 500: '#2d5090', 600: '#1e3a72', 700: '#162d5a',
          800: '#102246', 900: '#0b1a37', 950: '#071023',
        },
        gold: { 50: '#fbf7ec', 100: '#f4ebcf', 300: '#dcc27a', 500: '#b8963e', 600: '#9a7c2e', 700: '#7a6024' },
        surface: '#f5f6f8',
        success: { 50: '#ecf7f0', 600: '#1f7a4a', 700: '#176039' },
        warning: { 50: '#fff6e5', 600: '#b7791f', 700: '#8f5d15' },
        danger: { 50: '#fbeeee', 600: '#b03a3a', 700: '#8d2e2e' },
      },
      fontFamily: {
        sans: ['Manrope', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(11, 26, 55, 0.06)',
      },
    },
  },
  plugins: [],
};
