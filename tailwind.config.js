/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: '#05090f',
        'bg-2': '#0a1220',
        ink: '#eaf2ff',
        'ink-dim': '#7a8aa3',
        'ink-mute': '#3a475c',
        line: 'rgba(180,210,255,0.08)',
        'line-strong': 'rgba(180,210,255,0.18)',
        cyan: '#4dc8ff',
        azure: '#2596ff',
        deep: '#0b3a7a',
        glow: '#9dd9ff',
        accent: '#ff7a2d',
        'accent-hot': '#ff5b1f'
      },
      fontFamily: {
        serif: ['Fraunces', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    }
  },
  plugins: []
};
