// Единственный источник данных по кейсам портфолио.
// Добавление нового кейса = добавление объекта в этот массив (см. WORKFLOW.md).
// Тексты полностью вынесены в файлы локализации locales/*.json.
// Здесь хранятся только непереводимые структурные данные.
// category: 'erp' | 'bots' | 'ai' | 'automation'

export const projects = [
  {
    id: "warehouse-system",
    category: "erp",
    stack: ["React", "Vite", "FastAPI", "PostgreSQL", "Docker Compose"],
    image: null,
    screenshots: ["/img/screenshots/warehouse.png"]
  },
  {
    id: "pots-tracking",
    category: "erp",
    stack: ["FastAPI", "PostgreSQL", "React/Vite", "Telegram Bot"],
    image: null,
    screenshots: ["/img/screenshots/pots.png"]
  },
  {
    id: "minipos-pro",
    category: "erp",
    stack: ["[уточнить у автора]"],
    image: null,
    screenshots: []
  },
  {
    id: "chz-labels",
    category: "automation",
    stack: ["FastAPI", "React/Vite", "Tailwind CSS"],
    image: null,
    screenshots: []
  },
  {
    id: "gym-bot",
    category: "bots",
    stack: ["aiogram", "Python"],
    image: null,
    screenshots: ["/img/screenshots/gym.png"]
  },
  {
    id: "zerotrace-bot",
    category: "bots",
    stack: ["aiogram 3.x", "AES-256-GCM"],
    image: null,
    screenshots: []
  },
  {
    id: "bellissimo-bot",
    category: "bots",
    stack: ["[уточнить у автора]"],
    image: null,
    screenshots: []
  }
];
