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
          dark: '#A78BFA', // Example dark color
        }
      },
    },
  },
  plugins: [],
};