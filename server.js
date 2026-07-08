import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve static assets from Vite's build output folder
app.use(express.static(path.join(__dirname, "dist")));

// API Endpoint to send contact details to Telegram Bot (from React form)
app.post("/api/contact", async (req, res) => {
  const { name, contact, message } = req.body;

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error("TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing on the server env");
    return res.status(500).json({ error: "Server credentials error" });
  }

  const text = `📬 *Новая заявка с сайта-портфолио*:\n\n👤 *Имя*: ${name}\n📞 *Контакты*: ${contact}\n💬 *Описание*: ${message}`;

  try {
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: "Markdown"
      })
    });

    const data = await response.json();

    if (response.ok && data.ok) {
      return res.status(200).json({ success: true });
    } else {
      console.error("Telegram API Error response:", data);
      return res.status(500).json({ error: "Telegram API error", details: data.description });
    }
  } catch (error) {
    console.error("Internal Server Error forwarding request to Telegram:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// API Endpoint for Telegram Bot webhook updates
app.post("/api/telegram-webhook", async (req, res) => {
  const update = req.body;

  // Acknowledge update immediately to prevent Telegram retries
  res.status(200).json({ ok: true });

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const adminChatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !update.message) return;

  const { chat, text, from } = update.message;
  const chatId = chat.id;

  // Resolve WebApp URL dynamically (fallback to configured PUBLIC_URL or request origin)
  const publicUrl = process.env.PUBLIC_URL || `${req.protocol}://${req.get("host")}`;

  if (text === "/start") {
    // Reply with a neat welcome message containing the Mini App launch button
    const welcomeText = `👋 *Здравствуйте, ${from.first_name || "гость"}!*\n\nЯ официальный бот-ассистент разработчика *Абдулазизхона (A.M.)*.\n\nВы можете запустить моё интерактивное 3D-портфолио прямо в Telegram, нажав на кнопку ниже. Внутри вы сможете посмотреть выполненные проекты, скриншоты систем и оставить заявку в один клик.`;

    try {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: welcomeText,
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "💻 Открыть портфолио",
                  web_app: { url: publicUrl }
                }
              ]
            ]
          }
        })
      });
    } catch (e) {
      console.error("Error sending welcome message inside webhook:", e);
    }
  } else if (adminChatId && chatId.toString() !== adminChatId.toString()) {
    // Forward direct chat messages to the admin so they can reply
    const forwardText = `✉️ *Новое сообщение от пользователя в боте*:\n\n👤 *Имя*: ${from.first_name} ${from.last_name || ""}\n🔗 *Юзернейм*: ${from.username ? `@${from.username}` : "нет"}\n🆔 *ID*: \`${from.id}\`\n\n💬 *Сообщение*: ${text}`;

    try {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: adminChatId,
          text: forwardText,
          parse_mode: "Markdown"
        })
      });
    } catch (e) {
      console.error("Error forwarding message to admin inside webhook:", e);
    }
  }
});

// Fallback all SPA routing back to index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);

  // Auto register webhook on startup if PUBLIC_URL is configured
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const publicUrl = process.env.PUBLIC_URL;

  if (botToken && publicUrl) {
    const webhookUrl = `${publicUrl}/api/telegram-webhook`;
    console.log(`[Telegram] Registering webhook for bot to: ${webhookUrl}`);
    fetch(`https://api.telegram.org/bot${botToken}/setWebhook?url=${webhookUrl}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("[Telegram] Webhook registration status:", data);
      })
      .catch((err) => {
        console.error("[Telegram] Webhook registration error:", err);
      });
  } else {
    console.log("[Telegram] Webhook auto-registration skipped (PUBLIC_URL is not set)");
  }
});
