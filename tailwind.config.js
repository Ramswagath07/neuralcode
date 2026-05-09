/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        syne:  ['Syne', 'sans-serif'],
        mono:  ['"JetBrains Mono"', 'monospace'],
        sans:  ['"Space Grotesk"', 'sans-serif'],
      },
      colors: {
        bg:       '#080B14',
        surface:  '#0D1120',
        surface2: '#121829',
        accent:   '#6378FF',
        accent2:  '#A855F7',
        accent3:  '#22D3EE',
        accent4:  '#F59E0B',
        success:  '#10B981',
        danger:   '#EF4444',
        warning:  '#F97316',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        float:        'float 5s ease-in-out infinite',
        shimmer:      'shimmer 1.8s linear infinite',
        'spin-slow':  'spin 3s linear infinite',
        slideUp:      'slideUp 0.4s ease forwards',
        fadeIn:       'fadeIn 0.35s ease forwards',
        glow:         'glow 2s ease-in-out infinite',
      },
      keyframes: {
        float:    { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        shimmer:  { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        slideUp:  { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn:   { from: { opacity: 0 }, to: { opacity: 1 } },
        glow:     { '0%,100%': { boxShadow: '0 0 20px rgba(99,120,255,0.3)' }, '50%': { boxShadow: '0 0 40px rgba(99,120,255,0.6)' } },
      },
      backgroundImage: {
        'gradient-radial':  'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient':    'linear-gradient(135deg, #6378FF 0%, #A855F7 50%, #22D3EE 100%)',
        'card-gradient':    'linear-gradient(135deg, rgba(99,120,255,0.1), rgba(168,85,247,0.05))',
      },
    },
  },
  plugins: [],
}
