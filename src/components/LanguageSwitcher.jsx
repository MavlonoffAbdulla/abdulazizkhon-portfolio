import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const languages = [
    { code: "ru", label: "RU" },
    { code: "uz", label: "UZ" },
    { code: "en", label: "EN" }
  ];

  const handleLanguageChange = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem("lang", code);
  };

  return (
    <div className="flex items-center gap-1.5 border border-borderSoft rounded-lg p-1 bg-bgAlt">
      {languages.map((lang) => {
        const isActive = i18n.language === lang.code;
        return (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`px-2 py-1 rounded text-xs font-bold transition-all duration-200 focus:outline-none ${
              isActive
                ? "bg-primary text-white shadow-glow"
                : "text-muted hover:text-ink hover:bg-surface/50"
            }`}
          >
            {lang.label}
          </button>
        );
      })}
    </div>
  );
}
