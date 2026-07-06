import { useTranslation } from "react-i18next";

// СТАБ: заменить на полноценную сборку секций согласно PLAN.md (Этап 1).
// Порядок секций: Header → Hero → About → Services → Portfolio → TechStack → Contact → Footer
// Каждая секция — отдельный компонент в src/sections/, импортируется и собирается здесь.

export default function App() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="text-muted text-lg">
        {t("hero.title")} — сборка секций ещё не начата (см. PLAN.md, Этап 1)
      </p>
    </main>
  );
}
