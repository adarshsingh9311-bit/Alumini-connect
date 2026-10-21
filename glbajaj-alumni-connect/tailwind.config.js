/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Official GLBITM (G.L. Bajaj Institute of Technology & Management) Palette
        glbitm: {
          dark: '#472510',     // Deepest GLBITM Dark Brown / Mahogany
          primary: '#592106',  // Signature GLBITM Header Brown (#592106)
          light: '#742600',    // Warm Russet Accent
          gold: '#ffcc4e',     // Official Bright Golden Yellow from glbitm.org
          amber: '#c87e35',    // Secondary Golden Amber
          cream: '#faf6eb',    // GLBITM Institutional Cream Background
          surface: '#fdfbf7'   // Clean light page canvas
        },
        // Universal color aliases used throughout codebase
        glbajaj: {
          50: '#faf6eb',
          100: '#f5edd3',
          200: '#eddba8',
          300: '#e3c577',
          400: '#d7ab4b',
          500: '#c87e35',
          600: '#9e5218',
          700: '#742600',
          800: '#592106',      // Primary GLBITM Header (#592106)
          900: '#472510',      // Deepest GLBITM Brown (#472510)
          950: '#2f1508'
        },
        glblue: {
          50: '#faf6eb',
          100: '#f5edd3',
          200: '#eddba8',
          600: '#c87e35',
          700: '#742600',
          750: '#592106',      // Map legacy glblue-750 to GLBITM Primary #592106
          800: '#472510',
          900: '#381a0b',
          950: '#261005'
        },
        glgold: {
          light: '#ffe188',
          DEFAULT: '#ffcc4e',  // Official GLBITM Yellow (#ffcc4e)
          dark: '#c87e35',
          muted: '#a86523'
        },
        glcharcoal: {
          50: '#f9f9f9',
          100: '#f2f2f2',
          200: '#e5e5e5',
          300: '#cccccc',
          600: '#666666',
          700: '#444444',
          800: '#333333',      // Standard text color on glbitm.org
          900: '#222222',
          950: '#111111'
        },
        // Harmonize legacy Tailwind teal classes to GLBITM's mahogany/gold/amber theme
        teal: {
          50: '#faf6eb',       // Warm GLBITM cream
          100: '#f5edd3',      // Light cream/gold border
          200: '#eddba8',      // Soft accent
          300: '#e3c577',      // Muted gold
          400: '#ffcc4e',      // Official GLBITM gold
          500: '#c87e35',      // GLBITM amber
          600: '#9e5218',      // Rich amber
          700: '#742600',      // Russet accent
          800: '#592106',      // GLBITM primary mahogany
          900: '#472510',      // Deep GLBITM dark brown
          950: '#2f1508'       // Darkest shadow mahogany
        }
      },
      fontFamily: {
        // Exact font stack from https://www.glbitm.org/css/style.css:
        // @import "https://fonts.googleapis.com/css?family=Lato:400,100,300,700,900|Roboto:400,100,300,500,700,900|Open+Sans:400,300,600,700,800";
        sans: ["'Open Sans'", 'sans-serif'],
        display: ["'Lato'", "'Open Sans'", 'sans-serif'],
        roboto: ["'Roboto'", 'sans-serif'],
        serif: ["'Roboto Slab'", 'Georgia', 'serif']
      },
      fontSize: {
        '2xs': ['10px', '14px'],
        'xs': ['11px', '16px'],
        'sm': ['12px', '18px'],
        'base': ['14px', '1.4'], // Official GLBITM base: font-size:14px; line-height:1.4
        'md': ['15px', '22px'],
        'lg': ['16px', '24px'],
        'xl': ['18px', '26px'],
        '2xl': ['20px', '28px'],
        '3xl': ['24px', '32px'],
        '4xl': ['28px', '36px'],
        '5xl': ['32px', '1.3']
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(71, 37, 16, 0.04), 0 1px 2px -1px rgba(71, 37, 16, 0.04)',
        'elevated': '0 10px 25px -5px rgba(71, 37, 16, 0.08), 0 8px 10px -6px rgba(71, 37, 16, 0.04)',
        'card': '0 4px 20px -2px rgba(89, 33, 6, 0.06)',
        'card-hover': '0 20px 35px -10px rgba(89, 33, 6, 0.12), 0 8px 16px -6px rgba(89, 33, 6, 0.06)',
        'glbitm-glow': '0 8px 24px -4px rgba(89, 33, 6, 0.35)',
        'gold-glow': '0 0 25px -4px rgba(255, 204, 78, 0.45)'
      }
    },
  },
  plugins: [],
}
