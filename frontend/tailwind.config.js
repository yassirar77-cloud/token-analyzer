/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        },
        dark: {
          900: '#0a0a0a',
          800: '#1a1a1a',
          700: '#2a2a2a',
          600: '#3a3a3a',
          500: '#4a4a4a',
        },
        brand: {
          bg: '#141414',
          blue: '#0049D0',
          red: '#F2134A',
          card: '#141414',
          gray: '#7b7b7b',
          dark: '#252525',
        },
      },
      fontFamily: {
        sans: ['Tektur', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Climate Crisis', 'Poppins', 'system-ui', 'sans-serif'],
        heading: ['Climate Crisis', 'system-ui', 'sans-serif'],
        body: ['Tektur', 'system-ui', 'sans-serif'],
        stencil: ['Marine Corps', 'Impact', 'system-ui', 'sans-serif'],
        logo: ['PROGRESS PERSONAL USE', 'Impact', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(115deg, #0049D0 26%, #F2134A 117%)',
        'gradient-card': 'linear-gradient(to right, #373DB2, #C71C61)',
      },
      borderWidth: {
        '3': '3px',
        '5': '5px',
        '6': '6px',
        '7': '7px',
        '8': '8px',
      },
    },
  },
  plugins: [],
};
