/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6c63ff',
          hover: '#5b54e0',
          dark: '#4c44d0',
        },
        bg: {
          dark: '#0f0f1a',
          card: '#1a1a2e',
          accent: '#2a2a4e',
        },
        text: {
          primary: '#e1e1e6',
          secondary: '#a1a1aa',
          muted: '#71717a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%)',
      },
    },
  },
  plugins: [],
}
