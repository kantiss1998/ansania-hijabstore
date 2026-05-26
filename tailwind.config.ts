import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF1F5',
          100: '#FFE0EA',
          200: '#FFC5D9',
          300: '#FF96B8',
          400: '#FF5C91',
          500: '#F52D6E',
          600: '#D91A58',
          700: '#B5134A',
          800: '#8F0F3A',
          900: '#6B0C2B',
          DEFAULT: '#F52D6E',
        },
        dark: { DEFAULT: '#0A0A0A' },
        accent: {
          lime: '#C8FF00',
          violet: '#7C3AED',
          gold: '#F5A623',
        },
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['Space Grotesk', 'sans-serif'],
        heading: ['Syne', 'sans-serif'],
        accent: ['Space Grotesk', 'serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        colored: '0 10px 40px -10px rgba(186, 53, 101, 0.3)',
        gold: '0 10px 40px -10px rgba(212, 175, 55, 0.3)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #F52D6E 0%, #FF5C91 100%)',
        'gradient-gold': 'linear-gradient(135deg, #D4AF37 0%, #F4E5B8 100%)',
        'gradient-sunset':
          'linear-gradient(135deg, #FF6B8E 0%, #FFA07A 50%, #FFD700 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        float: 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 1.5s infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.9)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
