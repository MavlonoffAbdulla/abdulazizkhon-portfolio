/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: "#0A1128", alt: "#0F1A3A" },
        bgAlt: "#0F1A3A", // обратная совместимость
        surface: "#16244D",
        primary: { DEFAULT: "#2E7CF6", bright: "#5EA2FF", dark: "#1B4FA8" },
        ink: "#F2F6FF",
        muted: "#8FA3C8",
        borderSoft: "#233459",
        glow: "#3D8BFF"
      },
      boxShadow: {
        glow: "0 0 24px rgba(61, 139, 255, 0.25)",
        glowStrong: "0 0 40px rgba(61, 139, 255, 0.4)"
      },
      fontFamily: {
        sans: ["Inter", "Manrope", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"]
      }
    }
  },
  plugins: []
};
