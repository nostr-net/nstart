/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontSize: {
        // 'base': '1.1rem',
      },
      colors: {
        lavender: '#fdf0f5',
        strongpink: '#e32a6d',
        crimson: '#bc1150',
        garnet: '#42091e'
      },
      lineHeight: {
        normal: '0.8'
      },
    },
  },
  plugins: [],
}

