/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body: ['Manrope', 'sans-serif']
      },
      colors: {
        neo: {
          base: '#070B18',
          panel: '#0F172A',
          panelSoft: '#131D38',
          line: '#24324F',
          cyan: '#2DE2E6',
          teal: '#2EF7A3',
          violet: '#8C7BFF',
          pink: '#FF6BD6'
        }
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(45, 226, 230, 0.25), 0 12px 30px rgba(45, 226, 230, 0.15)',
        card: '0 20px 40px rgba(0, 0, 0, 0.35)'
      },
      backgroundImage: {
        'mesh-dark':
          'radial-gradient(circle at 12% 18%, rgba(44,226,230,0.17), transparent 30%), radial-gradient(circle at 88% 6%, rgba(140,123,255,0.22), transparent 26%), radial-gradient(circle at 50% 88%, rgba(46,247,163,0.12), transparent 30%), linear-gradient(160deg, #05070f 0%, #090f1d 45%, #04060f 100%)'
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(45, 226, 230, 0.25)' },
          '50%': { boxShadow: '0 0 0 8px rgba(45, 226, 230, 0)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      },
      animation: {
        pulseGlow: 'pulseGlow 2.2s ease-in-out infinite',
        float: 'float 4s ease-in-out infinite',
        shimmer: 'shimmer 1.8s linear infinite'
      }
    }
  },
  plugins: [],
}

