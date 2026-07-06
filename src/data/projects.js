// Единственный источник данных по кейсам портфолио.
// Добавление нового кейса = добавление объекта в этот массив (см. WORKFLOW.md).
// category: 'erp' | 'bots' | 'ai' | 'automation'
// Тексты — черновые (RU), см. CONTENT.md. Поля result помечены [уточнить] — заменить перед публикацией.

export const projects = [
  {
    id: "warehouse-system",
    category: "erp",
    title: "Warehouse-система для швейного производства",
    stack: ["React", "Vite", "FastAPI", "PostgreSQL", "Docker Compose"],
    description:
      "Учёт складских остатков и комплектующих на производстве. Штрихкод/QR-сканирование, печать этикеток с поддержкой кириллицы, автоматические уведомления о низких остатках.",
    result: "[уточнить у автора]",
    image: null
  },
  {
    id: "pots-tracking",
    category: "erp",
    title: "POTS — система отслеживания производственных заказов",
    stack: ["FastAPI", "PostgreSQL", "React/Vite", "Telegram Bot"],
    description:
      "Контроль этапов производства одежды от заказа до отгрузки. Kanban-доска, Telegram-уведомления, умный парсинг Excel-файлов заказов с автоподбором фото по артикулу.",
    result: "[уточнить у автора]",
    image: null
  },
  {
    id: "minipos-pro",
    category: "erp",
    title: "MiniPOS Pro",
    stack: ["[уточнить у автора]"],
    description: "Облачная автоматизация розничной торговли для магазинов одежды.",
    result: "[уточнить у автора]",
    image: null
  },
  {
    id: "chz-labels",
    category: "automation",
    title: "chz_labels — маркировка «Честный знак»",
    stack: ["FastAPI", "React/Vite", "Tailwind CSS"],
    description:
      "Веб-приложение для генерации PDF-этикеток (300 DPI) со штрихкодами EAN-13 и DataMatrix, с визуальным редактором шаблонов и live-превью.",
    result: "[уточнить у автора]",
    image: null
  },
  {
    id: "gym-bot",
    category: "bots",
    title: "Telegram-бот для фитнес-клуба",
    stack: ["aiogram", "Python"],
    description:
      "Перевод бумажных абонементов в цифровой формат с QR-учётом посещений, двуязычный интерфейс (RU/UZ).",
    result: "[уточнить у автора]",
    image: null
  },
  {
    id: "zerotrace-bot",
    category: "bots",
    title: "ZeroTrace — бот шифрования сообщений",
    stack: ["aiogram 3.x", "AES-256-GCM"],
    description:
      "Telegram-бот для защищённой переписки с шифрованием AES-256-GCM, построен на конечных автоматах (FSM).",
    result: "[уточнить у автора]",
    image: null
  },
  {
    id: "bellissimo-bot",
    category: "bots",
    title: "Bellissimo — бот доставки еды",
    stack: ["[уточнить у автора]"],
    description: "Бот с каталогом, оформлением заказа и уведомлениями для доставки еды.",
    result: "Первый коммерческий проект автора, реализован с полным договором и ТЗ.",
    image: null
  }
];
