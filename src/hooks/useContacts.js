import { useState, useEffect } from "react";
import { contacts as staticContacts } from "../data/contacts";

// Контакты с сервера (редактируются в админке, /api/contacts).
// Пока грузятся или при ошибке — статичные значения из src/data/contacts.js.
export default function useContacts() {
  const [remote, setRemote] = useState(null);

  useEffect(() => {
    fetch("/api/contacts")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && (data.telegramUsername || data.email || data.phone)) {
          setRemote(data);
        }
      })
      .catch(() => {});
  }, []);

  const sanitizeTelegram = (username) => {
    if (!username) return "";
    let clean = String(username).trim();
    clean = clean.replace(/^@/, "");
    clean = clean.replace(/^https?:\/\/t\.me\//i, "");
    clean = clean.replace(/^t\.me\//i, "");
    clean = clean.split(/[/?#]/)[0];
    return clean;
  };

  const sanitizeEmail = (email) => {
    if (!email) return "";
    let clean = String(email).trim();
    clean = clean.replace(/^mailto:/i, "");
    return clean;
  };

  const sanitizePhone = (phone) => {
    if (!phone) return "";
    let clean = String(phone).trim();
    clean = clean.replace(/^tel:/i, "");
    clean = clean.replace(/[^\d+]/g, "");
    return clean;
  };

  const rawTelegram = (remote && remote.telegramUsername) || staticContacts.telegramUsername;
  const telegramUsername = sanitizeTelegram(rawTelegram);

  const rawEmail = (remote && remote.email) || staticContacts.email;
  const email = sanitizeEmail(rawEmail);

  const rawPhone = (remote && remote.phone) || staticContacts.phone;
  const phone = sanitizePhone(rawPhone);

  return {
    telegramUsername,
    email,
    phone,
    telegramDeepLink: (text = "") =>
      `https://t.me/${telegramUsername}${text ? `?text=${encodeURIComponent(text)}` : ""}`
  };
}
