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
        }
      },
      boxShadow: {
        'glow-gold': '0 0 15px rgba(217, 119, 6, 0.3)',
        'glow-blue': '0 0 10px rgba(34, 211, 238, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backgroundImage: {
        'tech-grid': "radial-gradient(circle at center, rgba(217, 119, 6, 0.05) 0%, transparent 70%)",
      }
    }
  },
  plugins: []
}
