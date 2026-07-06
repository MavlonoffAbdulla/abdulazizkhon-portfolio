// Единая точка правды по контактам — не хардкодить эти значения в компонентах.
// Заполнить перед стартом разработки (см. CONTENT.md).

export const contacts = {
  telegramUsername: "author_username_placeholder", // без @, используется в t.me/<username>
  telegramDeepLink: (text = "") =>
    `https://t.me/author_username_placeholder${text ? `?text=${encodeURIComponent(text)}` : ""}`,
  email: "author_email_placeholder@example.com",
  phone: "+998000000000" // международный формат, без пробелов, для tel:
};
