
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Green
        'brand-primary': {
          DEFAULT: '#059669', // emerald-600
          50: '#ECFDF5', // emerald-50
          100: '#D1FAE5', // emerald-100
          200: '#A7F3D0', // emerald-200
          300: '#6EE7B7', // emerald-300
          400: '#34D399', // emerald-400
          500: '#10B981', // emerald-500
          600: '#059669', // emerald-600
          700: '#047857', // emerald-700
          800: '#065F46', // emerald-800
          900: '#064E3B', // emerald-900
        },
        // Secondary Blue
        'brand-secondary': {
          DEFAULT: '#0284C7', // sky-600
          50: '#F0F9FF', // sky-50
          100: '#E0F2FE', // sky-100
          200: '#BAE6FD', // sky-200
          300: '#7DD3FC', // sky-300
          400: '#38BDF8', // sky-400
          500: '#0EA5E9', // sky-500
          600: '#0284C7', // sky-600
          700: '#0369A1', // sky-700
          800: '#075985', // sky-800
          900: '#0C4A6E', // sky-900
        },
        // Accent Yellow/Gold
        'brand-accent': {
          DEFAULT: '#FBBE24', // amber-400
          50: '#FFFBEB', // amber-50
          100: '#FEF3C7', // amber-100
          200: '#FDE68A', // amber-200
          300: '#FCD34D', // amber-300
          400: '#FBBE24', // amber-400
          500: '#F59E0B', // amber-500
          600: '#D97706', // amber-600
          700: '#B45309', // amber-700
          800: '#92400E', // amber-800
          900: '#78350F', // amber-900
        },
        // Specific colors for mood/hydration if needed, or use brand colors
        'mood-excellent': '#4CAF50', // Still using a specific green for excellent mood
        'mood-good': '#8BC34A',
        'mood-neutral': '#FFEB3B',
        'mood-poor': '#F44336',
        'hydration-excellent': '#2196F3'
// tailwind.config.js
module.exports = {
  darkMode: 'class', // This is important! It tells Tailwind to look for the 'dark' class
  theme: {
    extend: {
      colors: {
        // Define your light mode colors
        emerald: {
          100: '#D1FAE5', // Light emerald
          200: '#A7F3D0',
          300: '#6EE7B7',
          // ... other shades
          500: '#10B981', // Your existing emerald-500
          700: '#047857',
          800: '#065F46', // Your existing emerald-800
        },
        green: {
          200: '#A7F3D0', // Your existing green-200
        },
        gray: {
          // Ensure gray has dark variants if you're not using default ones
          100: '#F3F4F6', // Light gray
          // ...
          700: '#374151',
          800: '#1F2937', // Darker gray
          900: '#111827', // Even darker gray
        },
        // Add specific shades for your "mood-excellent", "hydration-excellent", "productivity-high"
        'mood-excellent': {
          DEFAULT: '#10B981', // Example light color
          dark: '#34D399', // Example dark color
        },
        'hydration-excellent': {
          DEFAULT: '#3B82F6', // Example light color
          dark: '#60A5FA', // Example dark color
        },
        'productivity-high': {
          DEFAULT: '#8B5CF6', // Example light color
          dark: '#A78BFA', // Example dar
      },
    },
  },
  plugins: [],

};

