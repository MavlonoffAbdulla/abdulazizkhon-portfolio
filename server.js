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

// API Endpoint to send contact details to Telegram Bot
app.post("/api/contact", async (req, res) => {
  const { name, contact, message } = req.body;

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error("TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing on the server env");
    return res.status(500).json({ error: "Server credentials error" });
  }

  // Build Markdown formatted message
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

// Fallback all SPA routing back to index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});
