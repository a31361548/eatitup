/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // 注意：所有自定義樣式（fontSize、letterSpacing、fontFamily、colors、boxShadow、
      // backgroundImage、animation、keyframes）已全部遷移到 globals.css
      // Tailwind CSS v4 採用 CSS-first 配置方式
      // 
      // 如需新增自定義樣式，請在 globals.css 中：
      // - 顏色、字體、陰影等：加入 @theme 區塊
      // - 動畫、工具類：加入 @layer utilities 區塊
    }
  },
  plugins: []
}
