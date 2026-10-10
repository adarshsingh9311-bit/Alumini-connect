/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core Solid Academic Palette
        primary: {
          DEFAULT: '#7A1F24',
          dark: '#5C171B',
          light: '#9B282F',
          50: '#FDF6F6',
          100: '#FBE8E9',
          200: '#F7D1D3',
          600: '#9B282F',
          700: '#7A1F24',
          800: '#5C171B',
          900: '#3D0F12',
        },
        maroon: {
          DEFAULT: '#7A1F24',
          dark: '#5C171B',
          light: '#9B282F',
          50: '#FDF6F6',
          100: '#FBE8E9',
          200: '#F7D1D3',
          600: '#9B282F',
          700: '#7A1F24',
          800: '#5C171B',
          900: '#3D0F12',
        },
        cream: {
          DEFAULT: '#F7F3EA',
          light: '#FAF8F3',
          dark: '#EDE7D8',
          50: '#FAF8F3',
          100: '#F7F3EA',
          200: '#EFE9D9',
        },
        charcoal: {
          DEFAULT: '#202124',
          text: '#202124',
        },
        slateText: '#667085',
        academicBorder: '#D9DDE3',
        gold: {
          DEFAULT: '#B08A3E',
          muted: '#B08A3E',
          light: '#C7A255',
          dark: '#8C6C2B',
        },
        statusSuccess: '#2E6B4A',
        statusWarning: '#A66A00',
        statusError: '#B42318',

        // Bridge aliases so existing code maps cleanly into the solid institutional palette
        glblue: {
          50: '#FAF8F3',
          100: '#F7F3EA',
          200: '#EFE9D9',
          600: '#9B282F',
          700: '#7A1F24',
          750: '#7A1F24',
          800: '#5C171B',
          900: '#3D0F12',
          950: '#2A0B0D'
        },
        glgold: {
          light: '#C7A255',
          DEFAULT: '#B08A3E',
          dark: '#8C6C2B'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
