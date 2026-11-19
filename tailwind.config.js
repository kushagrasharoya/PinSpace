/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pin: {
          red: '#E60023',
          redHover: '#ad081b',
          lightRed: '#ffebee',
          gray: {
            50: '#f9f9f9',
            100: '#efefef',
            200: '#e2e2e2',
            300: '#cdcdcd',
            400: '#a5a5a5',
            500: '#767676',
            600: '#5f5f5f',
            700: '#333333',
            800: '#212121',
            900: '#111111',
          }
        }
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'pin': '0 1px 20px 0 rgba(0, 0, 0, 0.1)',
        'pin-hover': '0 12px 28px 0 rgba(0, 0, 0, 0.15)',
        'dropdown': '0 4px 20px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
