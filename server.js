import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import fs from "fs";
import multer from "multer";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Ensure dynamic database and screenshots directories exist
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Write default empty projects array if file doesn't exist
const projectsPath = path.join(dataDir, "projects.json");
if (!fs.existsSync(projectsPath)) {
  fs.writeFileSync(projectsPath, "[]", "utf8");
}

// Все загрузки живут в data/uploads — единый persistent volume (Railway
// поддерживает только один volume на сервис). Отдаются по /img/screenshots.
const screenshotsDir = path.join(dataDir, "uploads");

// Первый запуск на пустом volume: переносим стартовые данные из seed/
// (папка попадает в образ при сборке — см. Dockerfile)
const seedDir = path.join(__dirname, "seed");
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
  const seedUploads = path.join(seedDir, "uploads");
  if (fs.existsSync(seedUploads)) {
    for (const file of fs.readdirSync(seedUploads)) {
      fs.copyFileSync(path.join(seedUploads, file), path.join(screenshotsDir, file));
    }
    console.log(`[seed] Copied ${fs.readdirSync(seedUploads).length} screenshots to data/uploads`);
  }
}
const seedProjects = path.join(seedDir, "projects.json");
if (fs.readFileSync(projectsPath, "utf8").trim() === "[]" && fs.existsSync(seedProjects)) {
  fs.copyFileSync(seedProjects, projectsPath);
  console.log("[seed] Seeded projects.json from seed data");
}

const seedContactsPath = path.join(dataDir, "contacts.json");
if (!fs.existsSync(seedContactsPath)) {
  const defaultContacts = {
    telegramUsername: "Athletic_A",
    email: "abdulazizmavlonxonov@gmail.com",
    phone: "+998911772609"
  };
  fs.writeFileSync(seedContactsPath, JSON.stringify(defaultContacts, null, 2), "utf8");
  console.log("[seed] Seeded default contacts.json");
}

// --- Analytics flat-file storage (lives in data/ volume, survives rebuilds) ---
const analyticsPath = path.join(dataDir, "analytics.json");

const emptyAnalytics = () => ({
  totals: { visits: 0, projectViews: 0, contacts: 0 },
  daily: {},
  projects: {},
  languages: {}
});

function readAnalytics() {
  try {
    if (fs.existsSync(analyticsPath)) {
      return { ...emptyAnalytics(), ...JSON.parse(fs.readFileSync(analyticsPath, "utf8")) };
    }
  } catch (err) {
    console.error("Error reading analytics.json:", err);
  }
  return emptyAnalytics();
}

function writeAnalytics(analytics) {
  fs.writeFileSync(analyticsPath, JSON.stringify(analytics, null, 2), "utf8");
}

function bumpDaily(analytics, field) {
  const day = new Date().toISOString().slice(0, 10);
  if (!analytics.daily[day]) {
    analytics.daily[day] = { visits: 0, projectViews: 0, contacts: 0 };
  }
  analytics.daily[day][field] += 1;

  // Храним не больше 90 дней истории, чтобы файл не разрастался
  const keys = Object.keys(analytics.daily).sort();
  while (keys.length > 90) {
    delete analytics.daily[keys.shift()];
  }
}

// Multer Config for screenshots upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, screenshotsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// --- Admin auth: логин/пароль хранятся в data/users.json ---
const usersPath = path.join(dataDir, "users.json");

function hashPassword(password, salt) {
  return crypto.scryptSync(String(password), String(salt), 64).toString("hex");
}

function readUsers() {
  try {
    if (fs.existsSync(usersPath)) {
      return JSON.parse(fs.readFileSync(usersPath, "utf8"));
    }
  } catch (err) {
    console.error("Error reading users.json:", err);
  }
  
  // Попытка миграции старого admin.json
  const oldAdminPath = path.join(dataDir, "admin.json");
  let defaultUser;
  if (fs.existsSync(oldAdminPath)) {
    try {
      const stored = JSON.parse(fs.readFileSync(oldAdminPath, "utf8"));
      if (stored.username && stored.salt && stored.passwordHash) {
        defaultUser = {
          username: stored.username,
          salt: stored.salt,
          passwordHash: stored.passwordHash,
          isSuperAdmin: true
        };
      }
      fs.unlinkSync(oldAdminPath);
      console.log("[migration] Migrated admin.json to users.json");
    } catch (err) {
      console.error("Error migrating admin.json:", err);
    }
  }
  
  if (!defaultUser) {
    const salt = crypto.randomBytes(16).toString("hex");
    const password = process.env.ADMIN_PASSWORD || "admin123";
    defaultUser = {
      username: "admin",
      salt,
      passwordHash: hashPassword(password, salt),
      isSuperAdmin: true
    };
  }

  const users = [defaultUser];
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2), "utf8");
  return users;
}

function writeUsers(users) {
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2), "utf8");
}

function adminToken(user) {
  return crypto
    .createHash("sha256")
    .update(`${user.username}:${user.passwordHash}`)
    .digest("hex");
}

function safeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
}

// Find user by token
function findUserByToken(authHeader) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.substring(7);
  const users = readUsers();
  return users.find(u => safeEqual(adminToken(u), token));
}

// Admin verification middleware
const verifyAdmin = (req, res, next) => {
  const user = findUserByToken(req.headers.authorization);
  if (user) {
    req.user = user;
    return next();
  }
  res.status(403).json({ error: "Unauthorized" });
};

// Super Admin verification middleware
const verifySuperAdmin = (req, res, next) => {
  verifyAdmin(req, res, () => {
    if (req.user && req.user.isSuperAdmin) {
      return next();
    }
    res.status(403).json({ error: "Only super admin can perform this action" });
  });
};

// Загруженные скриншоты — из persistent volume (приоритет над dist)
app.use("/img/screenshots", express.static(screenshotsDir));

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
      // Счётчик заявок для аналитики (ошибка записи не должна ломать ответ)
      try {
        const analytics = readAnalytics();
        analytics.totals.contacts += 1;
        bumpDaily(analytics, "contacts");
        writeAnalytics(analytics);
      } catch (err) {
        console.error("Analytics contact increment failed:", err);
      }
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
  } else if (text === "/app") {
    const appText = `💻 *Интерактивное 3D-портфолио*\n\nНажмите на кнопку ниже, чтобы запустить интерактивное приложение прямо в Telegram.`;

    try {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: appText,
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
      console.error("Error sending app message inside webhook:", e);
    }
  } else if (text === "/contacts") {
    const contacts = readContacts();
    const telegram = contacts.telegramUsername ? contacts.telegramUsername.replace("@", "") : "Athletic_A";
    const email = contacts.email || "abdulazizmavlonxonov@gmail.com";
    const phone = contacts.phone || "+998911772609";

    const contactsText = `📞 *Контакты разработчика Абдулазизхона (A.M.):*\n\n` +
      `✈️ *Telegram:* [${telegram}](https://t.me/${telegram})\n` +
      `📧 *Email:* [${email}](mailto:${email})\n` +
      `📞 *Телефон:* [${phone}](tel:${phone.replace(/\s+/g, "")})\n\n` +
      `Вы также можете запустить 3D-портфолио и отправить быструю заявку!`;

    try {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: contactsText,
          parse_mode: "Markdown",
          disable_web_page_preview: true
        })
      });
    } catch (e) {
      console.error("Error sending contacts message inside webhook:", e);
    }
  } else if (text === "/help") {
    const helpText = `⚙️ *Справка по боту-ассистенту:*\n\n` +
      `🤖 Этот бот помогает вам взаимодействовать с портфолио разработчика *Абдулазизхона (A.M.)*.\n\n` +
      `*Доступные команды:* \n` +
      `• /start — Запустить приветствие бота\n` +
      `• /app — Открыть интерактивное 3D-портфолио\n` +
      `• /contacts — Показать прямые контактные данные\n` +
      `• /help — Показать эту справку\n\n` +
      `Вы можете нажать синюю кнопку *Портфолио* в левом нижнем углу, чтобы запустить Mini App в любой момент!`;

    try {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: helpText,
          parse_mode: "Markdown"
        })
      });
    } catch (e) {
      console.error("Error sending help message inside webhook:", e);
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

// --- CONTACTS (управляются из админки, хранятся в data/ volume) ---
const contactsPath = path.join(dataDir, "contacts.json");

function readContacts() {
  try {
    if (fs.existsSync(contactsPath)) {
      return JSON.parse(fs.readFileSync(contactsPath, "utf8"));
    }
  } catch (err) {
    console.error("Error reading contacts.json:", err);
  }
  return {};
}

// Public: актуальные контакты для секции Contact и кнопок Telegram
app.get("/api/contacts", (req, res) => {
  res.json(readContacts());
});

// Admin: обновление контактов
app.post("/api/contacts", verifyAdmin, (req, res) => {
  try {
    const { telegramUsername, email, phone } = req.body || {};
    const clean = {
      telegramUsername: String(telegramUsername || "").replace(/^@/, "").trim().slice(0, 64),
      email: String(email || "").trim().slice(0, 128),
      phone: String(phone || "").replace(/\s+/g, "").trim().slice(0, 32)
    };
    fs.writeFileSync(contactsPath, JSON.stringify(clean, null, 2), "utf8");
    res.json({ success: true, contacts: clean });
  } catch (err) {
    console.error("Error saving contacts:", err);
    res.status(500).json({ error: "Failed to save contacts" });
  }
});

// --- ANALYTICS API ENDPOINTS ---

// Public event tracking: visit / project_view
app.post("/api/track", (req, res) => {
  const { type, projectId, lang } = req.body || {};

  if (type !== "visit" && type !== "project_view") {
    return res.status(400).json({ error: "Unknown event type" });
  }

  try {
    const analytics = readAnalytics();

    if (type === "visit") {
      analytics.totals.visits += 1;
      bumpDaily(analytics, "visits");
      if (typeof lang === "string" && /^[a-z]{2}$/i.test(lang)) {
        const key = lang.toLowerCase();
        analytics.languages[key] = (analytics.languages[key] || 0) + 1;
      }
    } else {
      analytics.totals.projectViews += 1;
      bumpDaily(analytics, "projectViews");
      if (typeof projectId === "string" && projectId.length > 0 && projectId.length <= 64) {
        analytics.projects[projectId] = (analytics.projects[projectId] || 0) + 1;
      }
    }

    writeAnalytics(analytics);
    res.json({ success: true });
  } catch (err) {
    console.error("Error tracking event:", err);
    res.status(500).json({ error: "Failed to track event" });
  }
});

// Admin-only: full analytics snapshot
app.get("/api/admin/stats", verifyAdmin, (req, res) => {
  try {
    res.json(readAnalytics());
  } catch (err) {
    console.error("Error reading analytics:", err);
    res.status(500).json({ error: "Failed to read analytics" });
  }
});

// --- ADMIN PANEL CMS API ENDPOINTS ---

// 1. Admin login verification (логин + пароль)
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body || {};
  const users = readUsers();
  const user = users.find(u => safeEqual(String(username || "admin").trim(), u.username));
  if (!user) {
    return res.status(401).json({ error: "Неверный логин или пароль" });
  }
  const okPass = safeEqual(hashPassword(password || "", user.salt), user.passwordHash);
  if (okPass) {
    return res.json({ 
      success: true, 
      token: adminToken(user), 
      username: user.username,
      isSuperAdmin: !!user.isSuperAdmin 
    });
  }
  res.status(401).json({ error: "Неверный логин или пароль" });
});

// 1a. Проверка живости токена (при открытии админки)
app.get("/api/admin/verify", verifyAdmin, (req, res) => {
  res.json({ ok: true, username: req.user.username, isSuperAdmin: !!req.user.isSuperAdmin });
});

// 1b. Смена логина и/или пароля текущего пользователя
app.post("/api/admin/credentials", verifyAdmin, (req, res) => {
  try {
    const { currentPassword, newUsername, newPassword } = req.body || {};
    const users = readUsers();
    const userIndex = users.findIndex(u => u.username === req.user.username);
    if (userIndex === -1) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }
    const user = users[userIndex];

    if (!safeEqual(hashPassword(currentPassword || "", user.salt), user.passwordHash)) {
      return res.status(401).json({ error: "Текущий пароль неверен" });
    }

    const username = String(newUsername || user.username).trim().slice(0, 32) || user.username;
    
    // Проверка уникальности логина при смене
    if (username !== user.username && users.some(u => u.username === username)) {
      return res.status(400).json({ error: "Имя пользователя уже занято" });
    }

    if (newPassword && String(newPassword).length < 6) {
      return res.status(400).json({ error: "Новый пароль должен быть не короче 6 символов" });
    }

    const effectivePassword = newPassword ? String(newPassword) : String(currentPassword);
    const salt = crypto.randomBytes(16).toString("hex");
    
    users[userIndex] = {
      ...user,
      username,
      salt,
      passwordHash: hashPassword(effectivePassword, salt)
    };

    writeUsers(users);
    res.json({ success: true, token: adminToken(users[userIndex]), username });
  } catch (err) {
    console.error("Error updating credentials:", err);
    res.status(500).json({ error: "Failed to update credentials" });
  }
});

// 1c. Управление пользователями (только для Super Admin)
app.get("/api/admin/users", verifySuperAdmin, (req, res) => {
  try {
    const users = readUsers();
    const safeUsers = users.map(u => ({ username: u.username, isSuperAdmin: !!u.isSuperAdmin }));
    res.json(safeUsers);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.post("/api/admin/users", verifySuperAdmin, (req, res) => {
  try {
    const { username, password, isSuperAdmin } = req.body || {};
    const cleanUsername = String(username || "").trim().slice(0, 32);
    if (!cleanUsername) {
      return res.status(400).json({ error: "Имя пользователя обязательно" });
    }
    if (!password || String(password).length < 6) {
      return res.status(400).json({ error: "Пароль должен быть не короче 6 символов" });
    }

    const users = readUsers();
    if (users.some(u => u.username === cleanUsername)) {
      return res.status(400).json({ error: "Имя пользователя уже занято" });
    }

    const salt = crypto.randomBytes(16).toString("hex");
    const newUser = {
      username: cleanUsername,
      salt,
      passwordHash: hashPassword(password, salt),
      isSuperAdmin: !!isSuperAdmin
    };

    users.push(newUser);
    writeUsers(users);
    res.json({ success: true, user: { username: cleanUsername, isSuperAdmin: !!isSuperAdmin } });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Failed to create user" });
  }
});

app.put("/api/admin/users/:username", verifySuperAdmin, (req, res) => {
  try {
    const { username } = req.params;
    const { newUsername, password, isSuperAdmin } = req.body || {};
    
    const users = readUsers();
    const userIndex = users.findIndex(u => u.username === username);
    if (userIndex === -1) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }
    const user = users[userIndex];

    const cleanNewUsername = String(newUsername || username).trim().slice(0, 32);
    if (!cleanNewUsername) {
      return res.status(400).json({ error: "Имя пользователя обязательно" });
    }

    if (cleanNewUsername !== username && users.some(u => u.username === cleanNewUsername)) {
      return res.status(400).json({ error: "Имя пользователя уже занято" });
    }

    // Если меняется роль супер-администратора на обычного
    if (user.isSuperAdmin && !isSuperAdmin) {
      const otherSuperAdmins = users.filter((u, idx) => idx !== userIndex && u.isSuperAdmin);
      if (otherSuperAdmins.length === 0) {
        return res.status(400).json({ error: "Нельзя лишить прав последнего главного администратора" });
      }
    }

    const salt = password ? crypto.randomBytes(16).toString("hex") : user.salt;
    const passwordHash = password ? hashPassword(password, salt) : user.passwordHash;

    users[userIndex] = {
      ...user,
      username: cleanNewUsername,
      salt,
      passwordHash,
      isSuperAdmin: !!isSuperAdmin
    };

    writeUsers(users);
    res.json({ success: true, user: { username: cleanNewUsername, isSuperAdmin: !!isSuperAdmin } });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Failed to update user" });
  }
});

app.delete("/api/admin/users/:username", verifySuperAdmin, (req, res) => {
  try {
    const { username } = req.params;
    if (username === req.user.username) {
      return res.status(400).json({ error: "Вы не можете удалить самого себя" });
    }

    const users = readUsers();
    const userIndex = users.findIndex(u => u.username === username);
    if (userIndex === -1) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }
    const user = users[userIndex];

    // Если удаляется супер-администратор, проверим, есть ли другие
    if (user.isSuperAdmin) {
      const otherSuperAdmins = users.filter((u, idx) => idx !== userIndex && u.isSuperAdmin);
      if (otherSuperAdmins.length === 0) {
        return res.status(400).json({ error: "Нельзя удалить последнего главного администратора" });
      }
    }

    users.splice(userIndex, 1);
    writeUsers(users);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// 2. Fetch all projects
app.get("/api/projects", (req, res) => {
  try {
    const dataPath = path.join(__dirname, "data", "projects.json");
    if (!fs.existsSync(dataPath)) {
      return res.json([]);
    }
    const raw = fs.readFileSync(dataPath, "utf8");
    res.json(JSON.parse(raw));
  } catch (err) {
    console.error("Error reading projects.json:", err);
    res.status(500).json({ error: "Failed to read database" });
  }
});

// 3. Save/Update project
app.post("/api/projects", verifyAdmin, (req, res) => {
  try {
    const newProject = req.body;
    const dataPath = path.join(__dirname, "data", "projects.json");
    let projects = [];
    if (fs.existsSync(dataPath)) {
      projects = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    }
    
    const existingIndex = projects.findIndex(p => p.id === newProject.id);
    if (existingIndex > -1) {
      projects[existingIndex] = newProject;
    } else {
      projects.push(newProject);
    }
    
    fs.writeFileSync(dataPath, JSON.stringify(projects, null, 2), "utf8");
    res.json({ success: true, project: newProject });
  } catch (err) {
    console.error("Error saving project:", err);
    res.status(500).json({ error: "Failed to save project" });
  }
});

// 4. Delete project
app.delete("/api/projects/:id", verifyAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const dataPath = path.join(__dirname, "data", "projects.json");
    if (!fs.existsSync(dataPath)) {
      return res.status(404).json({ error: "Database not found" });
    }
    let projects = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    const filtered = projects.filter(p => p.id !== id);
    
    fs.writeFileSync(dataPath, JSON.stringify(filtered, null, 2), "utf8");
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).json({ error: "Failed to delete project" });
  }
});

// 5. Upload screenshot image
app.post("/api/upload", verifyAdmin, upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const relativePath = `/img/screenshots/${req.file.filename}`;
  res.json({ success: true, path: relativePath });
});

// 6. Get contacts
app.get("/api/contacts", (req, res) => {
  try {
    const dataPath = path.join(__dirname, "data", "contacts.json");
    if (!fs.existsSync(dataPath)) {
      return res.json({});
    }
    const raw = fs.readFileSync(dataPath, "utf8");
    res.json(JSON.parse(raw));
  } catch (err) {
    console.error("Error reading contacts.json:", err);
    res.status(500).json({ error: "Failed to read contacts" });
  }
});

// 7. Save/Update contacts
app.post("/api/contacts", verifyAdmin, (req, res) => {
  try {
    const newContacts = req.body;
    const dataPath = path.join(__dirname, "data", "contacts.json");
    fs.writeFileSync(dataPath, JSON.stringify(newContacts, null, 2), "utf8");
    res.json({ success: true, contacts: newContacts });
  } catch (err) {
    console.error("Error saving contacts:", err);
    res.status(500).json({ error: "Failed to save contacts" });
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
