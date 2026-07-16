/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte}'],
  theme: {
    extend: {
      colors: {
        espresso: '#2C1810',   // texto principal, fondos oscuros
        mocha: '#4E342E',      // secciones oscuras, navbar
        roast: '#6F4E37',      // acentos, botones
        latte: '#A67C52',      // acentos claros, hover
        cream: '#F8F5F2',      // fondo principal claro
        white: '#FFFFFF',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      transitionTimingFunction: {
        'power3-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
