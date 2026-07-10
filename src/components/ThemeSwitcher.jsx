import { useState, useEffect } from "react";

// Цвета — RGB-триплеты для CSS-переменных (:root в index.css);
// glowHex — для инлайн-стиля точек-переключателей
const themes = [
  {
    id: "blue",
    name: "Cobalt",
    primary: "46 124 246",
    bright: "94 162 255",
    dark: "27 79 168",
    glow: "61 139 255",
    gradEnd: "125 211 252",
    glowHex: "#3D8BFF"
  },
  {
    id: "purple",
    name: "Amethyst",
    primary: "139 92 246",
    bright: "167 139 250",
    dark: "91 33 182",
    glow: "192 132 252",
    gradEnd: "233 213 255",
    glowHex: "#C084FC"
  },
  {
    id: "emerald",
    name: "Emerald",
    primary: "16 185 129",
    bright: "52 211 153",
    dark: "6 95 70",
    glow: "110 231 183",
    gradEnd: "167 243 208",
    glowHex: "#6EE7B7"
  },
  {
    id: "amber",
    name: "Amber",
    primary: "249 115 22",
    bright: "251 146 60",
    dark: "154 52 18",
    glow: "253 186 116",
    gradEnd: "253 230 138",
    glowHex: "#FDBA74"
  }
];

export default function ThemeSwitcher() {
  const [activeTheme, setActiveTheme] = useState("blue");

  useEffect(() => {
    const saved = localStorage.getItem("portfolio-theme");
    const initialTheme = themes.find(t => t.id === saved) || themes[0];
    applyTheme(initialTheme);
  }, []);

  const applyTheme = (theme) => {
    setActiveTheme(theme.id);
    localStorage.setItem("portfolio-theme", theme.id);

    // Apply color values to root CSS variables (RGB triplets)
    document.documentElement.style.setProperty("--color-primary", theme.primary);
    document.documentElement.style.setProperty("--color-primary-bright", theme.bright);
    document.documentElement.style.setProperty("--color-primary-dark", theme.dark);
    document.documentElement.style.setProperty("--color-glow", theme.glow);
    document.documentElement.style.setProperty("--color-grad-end", theme.gradEnd);
  };

  return (
    <div className="flex items-center gap-2 border border-borderSoft bg-bgAlt/60 px-2.5 py-1.5 rounded-full shadow-sm">
      {themes.map((theme) => {
        const isActive = activeTheme === theme.id;
        return (
          <button
            key={theme.id}
            onClick={() => applyTheme(theme)}
            className={`w-3.5 h-3.5 rounded-full transition-all duration-300 hover:scale-125 focus:outline-none relative ${
              isActive ? "scale-110 ring-2 ring-ink/35" : "opacity-65 hover:opacity-100"
            }`}
            style={{
              backgroundColor: theme.glowHex,
              boxShadow: isActive ? `0 0 10px ${theme.glowHex}` : "none"
            }}
            title={theme.name}
            aria-label={`Change theme to ${theme.name}`}
          />
        );
      })}
    </div>
  );
}
