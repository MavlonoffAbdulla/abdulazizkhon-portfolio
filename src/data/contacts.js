// Единая точка правды по контактам — не хардкодить эти значения в компонентах.
// Заполнить перед стартом разработки (см. CONTENT.md).

export const contacts = {
  telegramUsername: "your_username", // без @, используется в t.me/<username>
  telegramDeepLink: (text = "") =>
    `https://t.me/your_username${text ? `?text=${encodeURIComponent(text)}` : ""}`,
  email: "your@email.com",
  phone: "+998000000000" // международный формат, без пробелов, для tel:
};
