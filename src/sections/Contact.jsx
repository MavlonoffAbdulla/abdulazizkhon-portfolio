import { useTranslation } from "react-i18next";
import Send from "lucide-react/dist/esm/icons/send";
import Mail from "lucide-react/dist/esm/icons/mail";
import Phone from "lucide-react/dist/esm/icons/phone";
import { contacts } from "../data/contacts";

import useScrollReveal from "../hooks/useScrollReveal";

export default function Contact() {
  const { t } = useTranslation();
  const revealRef = useScrollReveal();

  const isPlaceholder = (text) => text && text.includes("placeholder");

  return (
    <section
      id="contact"
      className="bg-bgAlt py-16 md:py-24 scroll-mt-20 border-t border-borderSoft"
    >
      <div ref={revealRef} className="max-w-6xl mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-ink tracking-tight mb-4">
            {t("contact.title")}
          </h2>
          <div className="w-12 h-1.5 bg-primary-bright mx-auto rounded-full shadow-glow"></div>
          <p className="max-w-xl mx-auto text-muted text-base mt-6">
            {t("contact.text")}
          </p>
        </div>

        {/* Contacts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Telegram */}
          <a
            href={contacts.telegramDeepLink(t("nav.cta"))}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-bg border border-borderSoft rounded-xl p-6 flex flex-col items-center text-center transition-all duration-300 hover:bg-surface hover:border-primary/45 hover:shadow-glow group focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary-bright mb-4 transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:border-primary group-hover:shadow-glow">
              <Send className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-ink mb-1">
              Telegram
            </span>
            <span className="text-sm text-primary-bright font-semibold">
              {isPlaceholder(contacts.telegramUsername) ? t("portfolio.clarify") : `@${contacts.telegramUsername}`}
            </span>
          </a>

          {/* Email */}
          <a
            href={`mailto:${contacts.email}`}
            className="bg-bg border border-borderSoft rounded-xl p-6 flex flex-col items-center text-center transition-all duration-300 hover:bg-surface hover:border-primary/45 hover:shadow-glow group focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary-bright mb-4 transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:border-primary group-hover:shadow-glow">
              <Mail className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-ink mb-1">
              Email
            </span>
            <span className="text-sm text-primary-bright font-semibold break-all">
              {isPlaceholder(contacts.email) ? t("portfolio.clarify") : contacts.email}
            </span>
          </a>

          {/* Phone */}
          <a
            href={`tel:${contacts.phone}`}
            className="bg-bg border border-borderSoft rounded-xl p-6 flex flex-col items-center text-center transition-all duration-300 hover:bg-surface hover:border-primary/45 hover:shadow-glow group focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary-bright mb-4 transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:border-primary group-hover:shadow-glow">
              <Phone className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-ink mb-1">
              {t("contact.phone")}
            </span>
            <span className="text-sm text-primary-bright font-semibold">
              {contacts.phone === "+998000000000" ? t("portfolio.clarify") : contacts.phone}
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
