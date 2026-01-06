/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        lorcana: {
          amber: "#F59E0B",
          amethyst: "#8B5CF6",
          emerald: "#10B981",
          ruby: "#EF4444",
          sapphire: "#3B82F6",
          steel: "#6B7280",
        },
      },
    },
  },
  plugins: [],
}
