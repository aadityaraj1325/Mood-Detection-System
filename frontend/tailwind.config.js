/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      colors: {
        bg: {
          void: 'var(--bg-void)',
          deep: 'var(--bg-deep)',
          surface: 'var(--bg-surface)'
        },
        glass: {
          ultra: 'var(--glass-ultra)',
          light: 'var(--glass-light)',
          medium: 'var(--glass-medium)',
          strong: 'var(--glass-strong)'
        },
        border: {
          subtle: 'var(--border-subtle)',
          glass: 'var(--border-glass)',
          glow: 'var(--border-glow)'
        },
        neural: {
          50: 'var(--neural-50)',
          100: 'var(--neural-100)',
          200: 'var(--neural-200)',
          300: 'var(--neural-300)',
          400: 'var(--neural-400)',
          500: 'var(--neural-500)',
          600: 'var(--neural-600)',
          700: 'var(--neural-700)',
          800: 'var(--neural-800)',
          900: 'var(--neural-900)'
        },
        pulse: {
          50: 'var(--pulse-50)',
          100: 'var(--pulse-100)',
          200: 'var(--pulse-200)',
          300: 'var(--pulse-300)',
          400: 'var(--pulse-400)',
          500: 'var(--pulse-500)',
          600: 'var(--pulse-600)',
          700: 'var(--pulse-700)',
          800: 'var(--pulse-800)',
          900: 'var(--pulse-900)'
        },
        serenity: {
          400: 'var(--serenity-400)',
          500: 'var(--serenity-500)',
          600: 'var(--serenity-600)'
        },
        emotion: {
          happy: 'var(--emotion-happy)',
          neutral: 'var(--emotion-neutral)',
          sad: 'var(--emotion-sad)',
          stress: 'var(--emotion-stress)'
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
          glow: 'var(--text-glow)'
        }
      },
      spacing: {
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        8: '32px',
        10: '40px',
        12: '48px',
        16: '64px',
        20: '80px',
        24: '96px'
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '20px',
        xl: '28px'
      },
      blur: {
        sm: '8px',
        md: '20px',
        lg: '40px',
        xl: '60px'
      },
      zIndex: {
        background: '0',
        cards: '10',
        sidebar: '100',
        'modal-backdrop': '200',
        modal: '300',
        toast: '400',
        tooltip: '500'
      },
      boxShadow: {
        'glass-card':
          '0 4px 6px rgba(0, 0, 0, 0.3), 0 12px 24px rgba(0, 0, 0, 0.4), 0 24px 48px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.08), inset 0 -1px 0 rgba(0, 0, 0, 0.2)',
        'glass-card-hover':
          '0 8px 12px rgba(0, 0, 0, 0.4), 0 20px 40px rgba(0, 0, 0, 0.5), 0 32px 64px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 170, 255, 0.15), 0 0 30px rgba(0, 170, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
        glow: '0 0 20px rgba(0, 170, 255, 0.35)'
      },
      backgroundImage: {
        'gradient-void':
          'radial-gradient(ellipse at 20% 20%, rgba(0, 170, 255, 0.12) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(102, 0, 255, 0.12) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(20, 184, 166, 0.05) 0%, transparent 70%)',
        'gradient-neural': 'linear-gradient(135deg, #00aaff 0%, #6600ff 50%, #14b8a6 100%)',
        'gradient-card-top':
          'linear-gradient(90deg, transparent, rgba(0,170,255,0.5), transparent)',
        'gradient-happy': 'linear-gradient(135deg, #fbbf24, #f59e0b)',
        'gradient-neutral': 'linear-gradient(135deg, #60a5fa, #3b82f6)',
        'gradient-sad': 'linear-gradient(135deg, #818cf8, #6366f1)'
      },
      keyframes: {
        pageEnter: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        scanLine: {
          from: { top: '0%', opacity: '0.8' },
          to: { top: '100%', opacity: '0' }
        }
      },
      animation: {
        'page-enter': 'pageEnter 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        shimmer: 'shimmer 1.5s linear infinite',
        scan: 'scanLine 2s ease-in-out infinite'
      },
      transitionTimingFunction: {
        neural: 'cubic-bezier(0.4, 0, 0.2, 1)'
      },
      transitionDuration: {
        fast: '150ms',
        normal: '300ms',
        slow: '600ms'
      }
    }
  },
  plugins: [],
}

