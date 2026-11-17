/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Light institutional teal for the public site
        brand: {
          50: '#EEF6F5',
          100: '#DDEDEB',
          200: '#BDDBD7',
          300: '#8FC0BB',
          400: '#62A39C',
          500: '#44888F'.replace('8F', '82'),
          600: '#2F726C', // Primary button colour
          700: '#265C57', // Button hover, link hover
          800: '#1F4A46',
          900: '#183A37',
        },
        // Deep teal kept only for the Phase 2 dashboard sidebars
        navy: {
          50: '#F0F5F4',
          100: '#DDE9E7',
          200: '#BBD2CF',
          300: '#8FB5B0',
          400: '#5F918B',
          500: '#438078',
          600: '#356F69',
          700: '#2B625D',
          800: '#245B57',
          900: '#194843',
        },
        // Muted brass: thin accents only
        gold: {
          50: '#FAF7F0',
          100: '#F3EDDD',
          200: '#E7DABA',
          300: '#D9C592',
          400: '#CDB47E',
          500: '#C1A36A',
          600: '#A88B53',
          700: '#876F3F',
          800: '#665330',
          900: '#463A22',
        },
        surface: '#F6F8F7', // Page background
        ink: '#29343A', // Main text
        muted: '#68747A', // Secondary text
        line: '#DCE2DF', // Borders
        success: '#28734F',
        warning: '#A56B22',
        danger: '#A94343',
        info: '#426F91',
      },
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(41, 52, 58, 0.05), 0 1px 3px rgba(41, 52, 58, 0.08)',
      },
    },
  },
  plugins: [],
};