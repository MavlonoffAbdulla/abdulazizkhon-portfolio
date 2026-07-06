/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1F4E9C",
          light: "#EAF1FB",
          dark: "#153A73"
        },
        ink: "#1A1A1A",
        muted: "#5B5B5B",
        bgAlt: "#F7F9FC",
        borderSoft: "#E3E8F0"
      },
      fontFamily: {
        sans: ["Inter", "Manrope", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
