import { useTranslation } from "react-i18next";
import { Send, Mail, Phone } from "lucide-react";
import { contacts } from "../data/contacts";

export default function Contact() {
  const { t } = useTranslation();

  const isPlaceholder = (text) => text && text.includes("placeholder");

  return (
    <section
      id="contact"
      className="bg-bgAlt py-16 md:py-24 scroll-mt-20 border-t border-borderSoft"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-ink tracking-tight mb-4">
            {t("contact.title")}
          </h2>
          <div className="w-12 h-1.5 bg-primary mx-auto rounded-full"></div>
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
            className="bg-white border border-borderSoft rounded-xl p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group"
          >
            <div className="w-12 h-12 rounded-lg bg-primary-light flex items-center justify-center text-primary mb-4 transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
              <Send className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-ink mb-1">
              Telegram
            </span>
            <span className="text-sm text-primary font-semibold">
              {isPlaceholder(contacts.telegramUsername) ? t("portfolio.clarify", "[уточнить у автора]") : `@${contacts.telegramUsername}`}
            </span>
          </a>

          {/* Email */}
          <a
            href={`mailto:${contacts.email}`}
            className="bg-white border border-borderSoft rounded-xl p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group"
          >
            <div className="w-12 h-12 rounded-lg bg-primary-light flex items-center justify-center text-primary mb-4 transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
              <Mail className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-ink mb-1">
              Email
            </span>
            <span className="text-sm text-primary font-semibold break-all">
              {isPlaceholder(contacts.email) ? t("portfolio.clarify", "[уточнить у автора]") : contacts.email}
            </span>
          </a>

          {/* Phone */}
          <a
            href={`tel:${contacts.phone}`}
            className="bg-white border border-borderSoft rounded-xl p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group"
          >
            <div className="w-12 h-12 rounded-lg bg-primary-light flex items-center justify-center text-primary mb-4 transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
              <Phone className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-ink mb-1">
              {t("contact.phone")}
            </span>
            <span className="text-sm text-primary font-semibold">
              {contacts.phone === "+998000000000" ? t("portfolio.clarify", "[уточнить у автора]") : contacts.phone}
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
