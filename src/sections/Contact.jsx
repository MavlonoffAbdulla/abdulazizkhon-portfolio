import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Send from "lucide-react/dist/esm/icons/send";
import Mail from "lucide-react/dist/esm/icons/mail";
import Phone from "lucide-react/dist/esm/icons/phone";
import { contacts } from "../data/contacts";

import useScrollReveal from "../hooks/useScrollReveal";

export default function Contact() {
  const { t } = useTranslation();
  const revealRef = useScrollReveal();

  const [formData, setFormData] = useState({ name: "", contact: "", message: "" });
  const [status, setStatus] = useState("idle"); // 'idle' | 'loading' | 'success' | 'error'

  // Auto-fill fields if running inside Telegram WebApp (Mini App)
  useEffect(() => {
    try {
      if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand(); // Expand webview to full height

        const user = tg.initDataUnsafe?.user;
        if (user) {
          const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ");
          const userContact = user.username
            ? `@${user.username}`
            : user.id
            ? `TG ID: ${user.id}`
            : "";

          setFormData((prev) => ({
            ...prev,
            name: fullName || prev.name,
            contact: userContact || prev.contact
          }));
        }
      }
    } catch (e) {
      console.warn("Telegram WebApp initialization error:", e);
    }
  }, []);

  const isPlaceholder = (text) => text && text.includes("placeholder");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", contact: "", message: "" });
        setTimeout(() => setStatus("idle"), 5000); // Reset state after 5 seconds
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error("Failed to submit contact form:", err);
      setStatus("error");
    }
  };

  return (
    <section
      id="contact"
      className="bg-bgAlt py-16 md:py-24 scroll-mt-20 border-t border-borderSoft"
    >
      <div ref={revealRef} className="max-w-6xl mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-ink tracking-tight mb-4">
            {t("contact.title")}
          </h2>
          <div className="w-12 h-1.5 bg-primary-bright mx-auto rounded-full shadow-glow"></div>
          <p className="max-w-xl mx-auto text-muted text-base mt-6">
            {t("contact.text")}
          </p>
        </div>

        {/* Contacts Layout Grid (Left: Cards, Right: Feedback Form) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto items-start">
          {/* Left Column: Direct Contact Links */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Telegram Card */}
            <a
              href={contacts.telegramDeepLink(t("nav.cta"))}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-bg border border-borderSoft rounded-xl p-5 flex items-center gap-4 transition-all duration-300 hover:bg-surface hover:border-primary/45 hover:shadow-glow group focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <div className="w-12 h-12 shrink-0 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary-bright transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:border-primary group-hover:shadow-glow">
                <Send className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-base font-bold text-ink mb-0.5">Telegram</span>
                <span className="text-sm text-primary-bright font-semibold">
                  {isPlaceholder(contacts.telegramUsername) ? t("portfolio.clarify") : `@${contacts.telegramUsername}`}
                </span>
              </div>
            </a>

            {/* Email Card */}
            <a
              href={`mailto:${contacts.email}`}
              className="bg-bg border border-borderSoft rounded-xl p-5 flex items-center gap-4 transition-all duration-300 hover:bg-surface hover:border-primary/45 hover:shadow-glow group focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <div className="w-12 h-12 shrink-0 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary-bright transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:border-primary group-hover:shadow-glow">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-left break-all">
                <span className="text-base font-bold text-ink mb-0.5">Email</span>
                <span className="text-sm text-primary-bright font-semibold">
                  {isPlaceholder(contacts.email) ? t("portfolio.clarify") : contacts.email}
                </span>
              </div>
            </a>

            {/* Phone Card */}
            <a
              href={`tel:${contacts.phone}`}
              className="bg-bg border border-borderSoft rounded-xl p-5 flex items-center gap-4 transition-all duration-300 hover:bg-surface hover:border-primary/45 hover:shadow-glow group focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <div className="w-12 h-12 shrink-0 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary-bright transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:border-primary group-hover:shadow-glow">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-base font-bold text-ink mb-0.5">{t("contact.phone")}</span>
                <span className="text-sm text-primary-bright font-semibold">
                  {contacts.phone === "+998000000000" ? t("portfolio.clarify") : contacts.phone}
                </span>
              </div>
            </a>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-bg border border-borderSoft rounded-xl p-6 md:p-8 hover:border-primary/20 transition-all duration-300 shadow-sm">
            <h3 className="text-xl font-bold text-ink mb-6 text-left">
              {t("contact.form.title")}
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
              <div>
                <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-2">
                  {t("contact.form.name")}
                </label>
                <input
                  type="text"
                  required
                  placeholder={t("contact.form.namePlaceholder")}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-bgAlt border border-borderSoft rounded-lg px-4 py-3 text-ink placeholder:text-muted/65 focus:outline-none focus:border-primary-bright focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-2">
                  {t("contact.form.contact")}
                </label>
                <input
                  type="text"
                  required
                  placeholder={t("contact.form.contactPlaceholder")}
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full bg-bgAlt border border-borderSoft rounded-lg px-4 py-3 text-ink placeholder:text-muted/65 focus:outline-none focus:border-primary-bright focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-2">
                  {t("contact.form.message")}
                </label>
                <textarea
                  rows="4"
                  required
                  placeholder={t("contact.form.messagePlaceholder")}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-bgAlt border border-borderSoft rounded-lg px-4 py-3 text-ink placeholder:text-muted/65 focus:outline-none focus:border-primary-bright focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-4 bg-primary text-white rounded-lg hover:bg-primary-bright hover:shadow-glow font-semibold text-base transition-all duration-200 text-center disabled:opacity-50"
              >
                {status === "loading" ? t("contact.form.sending") : t("contact.form.send")}
              </button>

              {status === "success" && (
                <p className="text-sm font-semibold text-green-400 mt-2">
                  {t("contact.form.success")}
                </p>
              )}

              {status === "error" && (
                <p className="text-sm font-semibold text-red-400 mt-2">
                  {t("contact.form.error")}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
