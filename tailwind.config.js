/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: "#0A1128", alt: "#0F1A3A" },
        bgAlt: "#0F1A3A", // обратная совместимость
        surface: "#16244D",
        // RGB-триплеты из :root (index.css) — так работают и сами цвета,
        // и модификаторы прозрачности вида bg-primary/10
        primary: {
          DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
          bright: "rgb(var(--color-primary-bright) / <alpha-value>)",
          dark: "rgb(var(--color-primary-dark) / <alpha-value>)"
        },
        ink: "#F2F6FF",
        muted: "#8FA3C8",
        borderSoft: "#233459",
        glow: "rgb(var(--color-glow) / <alpha-value>)",
        gradEnd: "rgb(var(--color-grad-end) / <alpha-value>)"
      },
      boxShadow: {
        glow: "0 0 24px rgb(var(--color-glow) / 0.25)",
        glowStrong: "0 0 40px rgb(var(--color-glow) / 0.4)"
      },
      fontFamily: {
        sans: ["Inter", "Manrope", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"]
      }
    }
  },
  plugins: []
};
