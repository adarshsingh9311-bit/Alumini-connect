/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core Solid Institutional Palette matching homepage
        navy: {
          DEFAULT: '#102235',
          dark: '#0B1724',
          light: '#1B3550',
          50: '#F0F4F8',
          100: '#D9E2EC',
          200: '#BCCCDC',
          600: '#244566',
          700: '#1B3550',
          800: '#102235',
          900: '#0B1724',
          950: '#060D14',
        },
        primary: {
          DEFAULT: '#102235',
          dark: '#0B1724',
          light: '#1B3550',
          50: '#F0F4F8',
          100: '#D9E2EC',
          200: '#BCCCDC',
          600: '#244566',
          700: '#1B3550',
          800: '#102235',
          900: '#0B1724',
        },
        gold: {
          DEFAULT: '#D6A34D',
          muted: '#C2933E',
          light: '#E2B86E',
          dark: '#B8862D',
        },
        glgold: {
          DEFAULT: '#D6A34D',
          light: '#E2B86E',
          dark: '#B8862D',
        },
        cream: {
          DEFAULT: '#F7F5F0',
          light: '#FAF9F6',
          dark: '#EFECE4',
          50: '#FAF9F6',
          100: '#F7F5F0',
          200: '#EFECE4',
        },
        charcoal: {
          DEFAULT: '#202124',
          text: '#202124',
        },
        slateText: '#667085',
        academicBorder: '#D9DDE3',
        statusSuccess: '#2E6B4A',
        statusWarning: '#A66A00',
        statusError: '#B42318',

        // Bridge aliases so existing code maps cleanly into the solid institutional palette
        glblue: {
          50: '#F7F5F0',
          100: '#EFECE4',
          200: '#D9E2EC',
          600: '#244566',
          700: '#1B3550',
          750: '#152C43',
          800: '#102235',
          900: '#0B1724',
          950: '#060D14'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
