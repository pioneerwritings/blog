/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        indigo: '#3E3BC9',
        cornflower: '#7275F0',
        midnight: '#0C0C3C',
        ash: '#767684'
      },
      fontFamily: {
        sans: ['Inter var']
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
}
