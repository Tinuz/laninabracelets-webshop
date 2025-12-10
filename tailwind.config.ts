import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-playfair)', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['var(--font-lato)', '"Lato"', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        border: '#e7e5e4',
        input: '#f5f5f4',
        ring: '#1c1917',
        background: '#ffffff',
        foreground: '#1c1917',
        primary: {
          DEFAULT: '#1c1917',      // Stone 900 - Primary text/actions
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#78716c',      // Stone 500 - Secondary elements
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT: '#f5f5f4',      // Stone 100 - Subtle backgrounds
          foreground: '#1c1917',
        },
        destructive: {
          DEFAULT: '#dc2626',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#f5f5f4',      // Stone 100
          foreground: '#78716c',   // Stone 500
        },
        stone: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
        warm: {
          beige: '#FDFBF7',        // Hero background
        },
        card: {
          DEFAULT: '#ffffff',
          foreground: '#1c1917',
        },
        popover: {
          DEFAULT: '#ffffff',
          foreground: '#1c1917',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      letterSpacing: {
        widest: '.25em',
      },
      borderRadius: {
        lg: '0.5rem',
        md: 'calc(0.5rem - 2px)',
        sm: 'calc(0.5rem - 4px)',
      },
    },
  },
  plugins: [],
} satisfies Config;
