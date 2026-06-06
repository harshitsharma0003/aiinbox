/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#07090D',
        onyx: '#0D1117',
        carbon: '#161B22',
        lead: '#21262D',
        graph: '#30363D',
        zinc: '#6E7681',
        silver: '#8B949E',
        paper: '#F0F6FC',
        amber: '#E6933A',
        cyan: '#58A6FF',
        jade: '#3FB950',
        rose: '#F85149',
        violet: '#BC8CFF',
        gold: '#E3B341',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['DM Mono', 'Fira Code', 'monospace'],
      }
    }
  },
  plugins: []
}
