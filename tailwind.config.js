/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Cinzel"', '"Noto Serif TC"', 'serif'],
        tech: ['"Rajdhani"', '"Noto Sans TC"', 'sans-serif'],
        rune: ['"Cinzel Decorative"', 'serif'],
        scroll: ['"Cormorant Garamond"', 'serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#16a34a',
          600: '#15803d',
          700: '#166534'
        },
        danger: {
          DEFAULT: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c'
        },
        void: {
          900: '#050505', // Deepest black
          800: '#0a0a0c', // Panel bg
          700: '#16161a',
        },
        gold: {
          100: '#fef3c7',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#d97706', // Antique gold
          glow: '#ffae00',
        },
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
          glow: '#00f0ff',
        },
        mythril: {
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
        },
        forge: {
          dark: '#0f0500',     // Void Black/Brown
          brown: '#2a1a15',    // Deep Leather
          bronze: '#5d4037',   // Aged Bronze
          metal: '#3e2723',    // Dark Metal
          gold: '#ffb300',     // Molten Gold
          light: '#ffe082',    // Hot Metal
          glow: '#ff6f00',     // Ember Glow
          ember: '#ff3d00'     // Fire
        }
      },
      boxShadow: {
        'glow-gold': '0 0 15px rgba(217, 119, 6, 0.3)',
        'glow-blue': '0 0 10px rgba(34, 211, 238, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backgroundImage: {
        'tech-grid': "radial-gradient(circle at center, rgba(217, 119, 6, 0.05) 0%, transparent 70%)",
        'forge-gradient': 'radial-gradient(circle at 30% 50%, #2a1a15 0%, #0f0500 100%)',
        'magma-border': 'linear-gradient(45deg, #5d4037, #ffb300, #5d4037)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
        'spin-reverse': 'spin 25s linear infinite reverse',
        'ember-rise': 'rise 10s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        rise: {
          '0%': { transform: 'translateY(100vh) scale(0)', opacity: '0' },
          '20%': { opacity: '1' },
          '100%': { transform: 'translateY(-10vh) scale(1)', opacity: '0' },
        }
      }
    }
  },
  plugins: []
}
