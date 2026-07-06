import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-bgAlt border-t border-borderSoft py-12 relative overflow-hidden">
      {/* Background Watermark */}
      <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none select-none">
        <svg
          className="w-32 h-32 text-primary"
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
      </div>

      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo and Name */}
        <div className="flex items-center gap-2">
          <svg
            className="w-6 h-6 text-primary"
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
