/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        glblue: {
          50: '#eef6f6',
          100: '#d7e8e8',
          200: '#b4d4d5',
          600: '#346b6c',
          700: '#2d5e5f',
          750: '#2b5859',
          800: '#234748',
          900: '#1b3839',
          950: '#0f2223'
        },
        glgold: {
          light: '#df9c49',
          DEFAULT: '#c2853b',
          dark: '#9e6a2d'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
