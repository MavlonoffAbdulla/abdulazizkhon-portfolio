import { useState } from "react";
import { useTranslation } from "react-i18next";
import Menu from "lucide-react/dist/esm/icons/menu";
import X from "lucide-react/dist/esm/icons/x";
import LanguageSwitcher from "./LanguageSwitcher";
import Logo from "./Logo";

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
    <header className="sticky top-0 z-50 w-full bg-bg/90 backdrop-blur-md border-b border-borderSoft transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and initials */}
        <a href="#hero" className="flex items-center gap-2 group focus:outline-none">
          <Logo className="w-8 h-8 transition-transform duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_12px_rgba(61,139,255,0.45)]" />
          <span className="font-sans font-extrabold text-xl tracking-tight text-ink group-hover:text-primary-bright transition-colors duration-200">
            A.M.
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className="text-muted hover:text-primary-bright font-medium transition-colors duration-200 focus:outline-none focus:text-primary-bright"
            >
              {t(`nav.${item.key}`)}
            </a>
          ))}
          <LanguageSwitcher />
          <a
            href="#contact"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-bright hover:shadow-glow font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            {t("nav.cta")}
          </a>
        </nav>

        {/* Mobile Menu Button & Switcher wrapper */}
        <div className="flex items-center gap-4 md:hidden">
          <LanguageSwitcher />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-ink hover:text-primary-bright focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isOpen && (
        <nav className="md:hidden border-t border-borderSoft bg-bgAlt px-4 py-4 flex flex-col gap-4 shadow-lg animate-fade-in">
          {navItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="text-muted hover:text-primary-bright font-medium py-1.5 transition-colors duration-200"
            >
              {t(`nav.${item.key}`)}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setIsOpen(false)}
            className="w-full text-center px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-bright hover:shadow-glow font-medium transition-all duration-200 block"
          >
            {t("nav.cta")}
          </a>
        </nav>
      )}
    </header>
  );
}
