/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      boxShadow: {
        glow: '0 0 10px rgba(16, 185, 129, 0.5)', // Emerald glow
        'glow-dark': '0 0 10px rgba(59, 130, 246, 0.5)', // Blue glow for dark mode
      },
      colors: {
        primary: {
          DEFAULT: '#10B981', // emerald-500
          dark: '#06B6D4', // cyan-500
        },
        secondary: {
          DEFAULT: '#6B7280', // gray-500
          dark: '#1E3A8A', // blue-900
        },
      },
    },
  },
  plugins: [],
};