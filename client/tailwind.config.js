/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          teal: '#028090',
          mint: '#02C39A',
          navy: '#0a1628',
          navy2: '#112240',
          slate: '#1e3a5f',
          off: '#f4fafb',
          border: '#d0e8ed',
          muted: '#8da8b8'
        },
        navy: {
          DEFAULT: '#0a1628',
          50: '#e1e7ef',
          100: '#c3cfdf',
          200: '#879fbf',
          300: '#4b6f9f',
          400: '#0f3f7f',
          500: '#0a1628'
        },
        teal: {
          DEFAULT: '#028090',
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981'
        },
        mint: {
          DEFAULT: '#02C39A',
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80'
        }
      },
      fontFamily: {
        heading: ['Syne', 'ui-sans-serif', 'system-ui'],
        body: ['DM Sans', 'ui-sans-serif', 'system-ui'],
        syne: ['Syne', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
        ui: ['Inter', 'DM Sans', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        soft: '0 4px 24px rgba(2,128,144,0.12)',
        mint: '0 8px 32px rgba(2,195,154,0.40)',
      },
      borderRadius: {
        xl: '16px',
        '2xl': '24px',
        '3xl': '32px'
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideRight: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        slideLeft: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        pulseRing: {
          '0%': { transform: 'scale(1)', opacity: '0.7' },
          '100%': { transform: 'scale(1.4)', opacity: '0' }
        },
        wobble: {
          '0%, 100%': { transform: 'rotate(0)' },
          '25%': { transform: 'rotate(-5deg)' },
          '75%': { transform: 'rotate(5deg)' }
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(2px)' }
        }
      },
      animation: {
        shimmer: 'shimmer 2s infinite linear',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-right': 'slideRight 0.5s ease-out forwards',
        'slide-left': 'slideLeft 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'scale-in': 'scaleIn 0.4s ease-out forwards',
        'bounce-slow': 'bounce 3s ease-in-out infinite',
        'pulse-ring': 'pulseRing 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        wobble: 'wobble 0.5s ease-in-out infinite',
        shake: 'shake 0.8s cubic-bezier(.36,.07,.19,.97) infinite',
        'spin-slow': 'spin 10s linear infinite'
      }
    }
  },
  plugins: [
    function({ addUtilities }) {
      const delays = {
        '.animation-delay-100': { 'animation-delay': '100ms' },
        '.animation-delay-200': { 'animation-delay': '200ms' },
        '.animation-delay-300': { 'animation-delay': '300ms' },
        '.animation-delay-400': { 'animation-delay': '400ms' },
        '.animation-delay-500': { 'animation-delay': '500ms' },
        '.animation-delay-600': { 'animation-delay': '600ms' },
        '.animation-delay-700': { 'animation-delay': '700ms' },
        '.animation-delay-800': { 'animation-delay': '800ms' },
      }
      addUtilities(delays)
    }
  ]
};
