import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Menu, X } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { key: "about", href: "#about" },
    { key: "services", href: "#services" },
    { key: "portfolio", href: "#portfolio" },
    { key: "stack", href: "#stack" },
    { key: "contact", href: "#contact" }
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-borderSoft transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-2 group">
          <svg
            className="w-8 h-8 text-primary transition-transform duration-300 group-hover:scale-105"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M50 15L85 80H15L50 15Z"
              stroke="currentColor"
              strokeWidth="10"
              strokeLinejoin="round"
            />
            <path
              d="M35 60H65"
              stroke="currentColor"
              strokeWidth="10"
              strokeLinecap="round"
            />
          </svg>
          <span className="font-sans font-extrabold text-xl tracking-tight text-ink">
            A.M.
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className="text-muted hover:text-primary font-medium transition-colors duration-200"
            >
              {t(`nav.${item.key}`)}
            </a>
          ))}
          <LanguageSwitcher />
          <a
            href="#contact"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium transition-colors duration-200"
          >
            {t("nav.cta")}
          </a>
        </nav>

        {/* Mobile Menu Button & Switcher wrapper */}
        <div className="flex items-center gap-4 md:hidden">
          <LanguageSwitcher />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-ink hover:text-primary focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isOpen && (
        <nav className="md:hidden border-t border-borderSoft bg-white px-4 py-4 flex flex-col gap-4 shadow-lg animate-fade-in">
          {navItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="text-muted hover:text-primary font-medium py-1 transition-colors duration-200"
            >
              {t(`nav.${item.key}`)}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setIsOpen(false)}
            className="w-full text-center px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium transition-colors duration-200 block"
          >
            {t("nav.cta")}
          </a>
        </nav>
      )}
    </header>
  );
}
