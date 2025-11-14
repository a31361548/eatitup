/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
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
        }
      }
    }
  },
  plugins: []
}
