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

  const telegramUsername =
    (remote && remote.telegramUsername) || staticContacts.telegramUsername;

  return {
    telegramUsername,
    email: (remote && remote.email) || staticContacts.email,
    phone: (remote && remote.phone) || staticContacts.phone,
    telegramDeepLink: (text = "") =>
      `https://t.me/${telegramUsername}${text ? `?text=${encodeURIComponent(text)}` : ""}`
  };
}
