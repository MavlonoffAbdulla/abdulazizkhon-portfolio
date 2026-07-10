import { useState } from "react";
import { useTranslation } from "react-i18next";
import Menu from "lucide-react/dist/esm/icons/menu";
import X from "lucide-react/dist/esm/icons/x";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeSwitcher from "./ThemeSwitcher";
import Logo from "./Logo";

export default function Header() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { key: "about", href: "#about" },
    { key: "journey", href: "#journey" },
    { key: "services", href: "#services" },
    { key: "portfolio", href: "#portfolio" },
    { key: "stack", href: "#stack" },
    { key: "process", href: "#process" },
    { key: "contact", href: "#contact" }
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-bg/90 backdrop-blur-md border-b border-borderSoft transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo and initials */}
        <a href="#hero" className="flex items-center gap-2 group focus:outline-none shrink-0">
          <Logo className="w-8 h-8 transition-transform duration-300 group-hover:scale-105" />
          <span className="font-sans font-extrabold text-xl tracking-tight text-ink group-hover:text-primary-bright transition-colors duration-200">
            A.M.
          </span>
        </a>

        {/* Desktop Navigation (полное меню — только на широких экранах) */}
        <nav className="hidden lg:flex items-center">
          {navItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className="relative px-3 py-2 text-sm font-medium text-muted hover:text-ink whitespace-nowrap transition-colors duration-200 focus:outline-none focus-visible:text-primary-bright group"
            >
              {t(`nav.${item.key}`)}
              {/* Градиентное подчёркивание, выезжающее при hover */}
              <span
                aria-hidden="true"
                className="absolute left-3 right-3 bottom-1 h-px bg-gradient-to-r from-primary via-primary-bright to-gradEnd scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"
              />
            </a>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <span className="h-5 w-px bg-borderSoft" aria-hidden="true" />
          <LanguageSwitcher />
          <ThemeSwitcher />
          <a
            href="#contact"
            className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-bright hover:shadow-glow font-semibold whitespace-nowrap transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            {t("nav.cta")}
          </a>
        </div>

        {/* Tablet/Mobile: язык + бургер */}
        <div className="flex items-center gap-3 lg:hidden">
          <LanguageSwitcher />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-10 h-10 grid place-items-center rounded-lg border border-borderSoft text-ink hover:text-primary-bright hover:border-primary/40 transition-colors focus:outline-none"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Tablet/Mobile Navigation Dropdown */}
      {isOpen && (
        <nav className="lg:hidden border-t border-borderSoft bg-bg/95 backdrop-blur-xl px-4 py-5 shadow-lg animate-fade-in">
          <div className="max-w-6xl mx-auto flex flex-col gap-1">
            {navItems.map((item, idx) => (
              <a
                key={item.key}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-muted hover:text-ink hover:bg-surface font-medium transition-colors duration-200"
              >
                <span className="font-mono text-[11px] text-primary-bright w-6">
                  0{idx + 1}
                </span>
                {t(`nav.${item.key}`)}
              </a>
            ))}

            <div className="flex justify-between items-center px-3 py-3 mt-2 border-t border-borderSoft">
              <span className="text-muted text-sm font-medium">{t("theme.label", "Цвет темы:")}</span>
              <ThemeSwitcher />
            </div>

            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="mt-2 w-full text-center px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-bright hover:shadow-glow font-semibold transition-all duration-200 block"
            >
              {t("nav.cta")}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
