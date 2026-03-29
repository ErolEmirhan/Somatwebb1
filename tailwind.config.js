/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        gold: {
          light: '#F5E6C8',
          DEFAULT: '#D4AF37',
          dark: '#B8860B',
          rich: '#C5A028',
        },
        dark: {
          900: '#0f0a05',
          800: '#1a1208',
          700: '#2d1f0d',
        },
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #fef3c7 0%, #fde68a 25%, #fcd34d 50%, #d4af37 75%, #b45309 100%)',
        'gradient-gold-subtle': 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fde68a 100%)',
        'gradient-card': 'linear-gradient(180deg, rgba(15,10,5,0.85) 0%, rgba(26,18,8,0.95) 100%)',
        'gradient-card-overlay': 'linear-gradient(180deg, rgba(212,175,55,0.08) 0%, transparent 50%, rgba(0,0,0,0.4) 100%)',
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'gold': '0 4px 24px rgba(212, 175, 55, 0.25)',
        'gold-lg': '0 8px 40px rgba(212, 175, 55, 0.35)',
        'gold-inner': 'inset 0 0 0 1px rgba(212, 175, 55, 0.3)',
        'prestige': '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(212, 175, 55, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(30px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        scaleIn: { '0%': { transform: 'scale(0.96)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
      },
    },
  },
  plugins: [],
}
