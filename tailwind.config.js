/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // 注意：fontSize、letterSpacing、fontFamily、colors 已全部遷移到 globals.css 的 @theme 中
      // 在 Tailwind v4 中，建議使用 CSS-first 配置方式
      
      boxShadow: {
        'pixel-card': '8px 8px 0px 0px rgba(17, 66, 66, 0.8)',
        hud: '0 0 30px rgba(103, 232, 249, 0.35)',
      },
      backgroundImage: {
        'crt-grid': 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
      },
      animation: {
        blink: 'blink 1s steps(2, start) infinite',
        shake: 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
        scanline: 'scanline 8s linear infinite',
        float: 'float 3s ease-in-out infinite',
        typewriter: 'typewriter 2s steps(40, end) 1s 1 normal both',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
        },
        scanline: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '0% 100%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        typewriter: {
          from: { width: '0' },
          to: { width: '100%' },
        },
      }
    }
  },
  plugins: []
}
