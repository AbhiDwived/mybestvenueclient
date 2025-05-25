import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary": "#0F4C81", // Professional blue
        "primary-light": "#6B9AC4",
        "secondary": "#445D7B", // Muted slate-blue
        "accent": "#D4B483", // Gold accent
        "neutral": "#E8EDF3", // Light gray with blue tint
        "dark": "#1A2A3A", // Dark navy
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
    [require('tailwind-scrollbar-hide')],
    tailwindcss(),
  ],
})