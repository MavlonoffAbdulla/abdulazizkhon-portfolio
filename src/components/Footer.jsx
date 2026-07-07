import { useTranslation } from "react-i18next";
import Logo from "./Logo";

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-bg border-t border-borderSoft py-12 relative overflow-hidden">
      {/* Background Circuit Pattern (opacity 0.06) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-6">
        <svg className="w-full h-full text-primary-bright" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="footer-circuit" width="200" height="200" patternUnits="userSpaceOnUse">
              <path d="M 10 10 L 70 10 L 90 30 L 140 30" stroke="currentColor" strokeWidth="1" fill="none" />
              <circle cx="10" cy="10" r="3" fill="currentColor" />
              <circle cx="140" cy="30" r="3" fill="currentColor" />
              <path d="M 40 110 L 60 130 L 120 130 L 140 150" stroke="currentColor" strokeWidth="1" fill="none" />
              <circle cx="40" cy="110" r="3" fill="currentColor" />
              <circle cx="140" cy="150" r="3" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-circuit)" />
        </svg>
      </div>

      {/* Large background watermark logo */}
      <div className="absolute right-4 bottom-4 opacity-10 pointer-events-none select-none z-0 filter drop-shadow-[0_0_15px_rgba(61,139,255,0.25)]">
        <Logo className="w-32 h-32" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 z-10">
        {/* Logo and Name */}
        <div className="flex items-center gap-3">
          <Logo className="w-6 h-6" />
          <span className="font-sans font-bold text-base tracking-tight text-ink">
            Abdulazizkhon Mavlonkhonov
          </span>
        </div>

        {/* Copyright */}
        <div className="text-muted text-sm text-center md:text-right">
          &copy; {currentYear} Abdulazizkhon Mavlonkhonov. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}
