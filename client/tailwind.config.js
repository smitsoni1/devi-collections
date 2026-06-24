/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ebf4ff',
          100: '#e1effe',
          200: '#c3ddfd',
          300: '#a4cafe',
          400: '#76a9fa',
          500: '#2B6CB0', // Corporate Blue (Secondary)
          600: '#1A365D', // Navy Blue (Primary)
          700: '#1e429f',
          800: '#233876',
          900: '#1e3a8a',
          950: '#172554',
        },
        gold: {
          400: '#f6ad55',
          500: '#f6993f',
          600: '#dd6b20',
        },
        surface: {
          DEFAULT: '#F8F9FA', // Clean crisp light gray
          card: '#FFFFFF', // White cards
          elevated: '#FFFFFF',
          border: '#E2E8F0', // Crisp borders
        },
        textPrimary: '#111111', // Deep Charcoal Black
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'], // Keep it clean, no serif
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
        'gold-gradient': 'linear-gradient(135deg, #f6993f, #f6ad55)',
        'dark-radial': 'none',
        'card-glow': 'none',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'shimmer': 'shimmer 1.5s infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-brand': 'pulseBrand 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(10px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.98)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        pulseBrand: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      boxShadow: {
        'brand': '0 2px 4px rgba(2, 132, 199, 0.2)',
        'brand-lg': '0 4px 6px rgba(2, 132, 199, 0.3)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
};
