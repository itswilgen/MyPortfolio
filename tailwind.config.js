/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#001f3f",
          light: "#002d5a",
          dark: "#001428",
        },
        accent: {
          DEFAULT: "#00d4ff",
          dark: "#00a8cc",
        },
        gold: {
          DEFAULT: "#f5a623",
          dark: "#d4891a",
        },
      },
      fontFamily: {
        sans: ["DM Sans", "Segoe UI", "sans-serif"],
        display: ["Syne", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "bar-fill": "barFill 1.2s cubic-bezier(0.4,0,0.2,1) forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        barFill: {
          "0%": { width: "0%" },
          "100%": { width: "var(--bar-width)" },
        },
      },
    },
  },
  plugins: [],
};
