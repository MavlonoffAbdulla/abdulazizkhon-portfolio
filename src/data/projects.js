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
    image: null
  },
  {
    id: "pots-tracking",
    category: "erp",
    stack: ["FastAPI", "PostgreSQL", "React/Vite", "Telegram Bot"],
    image: null
  },
  {
    id: "minipos-pro",
    category: "erp",
    stack: ["[уточнить у автора]"],
    image: null
  },
  {
    id: "chz-labels",
    category: "automation",
    stack: ["FastAPI", "React/Vite", "Tailwind CSS"],
    image: null
  },
  {
    id: "gym-bot",
    category: "bots",
    stack: ["aiogram", "Python"],
    image: null
  },
  {
    id: "zerotrace-bot",
    category: "bots",
    stack: ["aiogram 3.x", "AES-256-GCM"],
    image: null
  },
  {
    id: "bellissimo-bot",
    category: "bots",
    stack: ["[уточнить у автора]"],
    image: null
  }
];
