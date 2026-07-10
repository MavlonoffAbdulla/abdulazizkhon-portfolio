import { useTranslation } from "react-i18next";
import useTilt from "../hooks/useTilt";

export default function ProjectCard({ project, onClick }) {
  const { t, i18n } = useTranslation();
  const cardRef = useTilt();

  const lang = i18n.language || "ru";
  const localized = project[lang] || project.ru || {};
  const title = localized.title || "";
  const description = localized.description || "";
  const result = localized.result || "";

  const isPlaceholder = (text) =>
    text &&
    (text.includes("[уточнить") ||
      text.includes("[clarify") ||
      text.includes("[muallifdan"));

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  // Позиция курсора в CSS-переменных — для glow, следующего за мышью
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={cardRef}
      role="button"
      tabIndex={0}
      aria-haspopup="dialog"
      aria-label={title}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      onMouseMove={handleMouseMove}
      className="group relative overflow-hidden bg-bg border border-borderSoft rounded-xl p-6 transition-all duration-300 hover:bg-surface hover:border-primary/45 hover:shadow-glow flex flex-col justify-between h-full text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40"
    >
      {/* Glow, следующий за курсором */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(420px circle at var(--mx, 50%) var(--my, 0%), rgb(var(--color-glow) / 0.13), transparent 45%)"
        }}
      />
      <div>
        {/* Category Badge */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold tracking-wider uppercase px-2.5 py-1 bg-primary/10 text-primary-bright border border-primary/20 rounded-full">
            {t(`portfolio.filters.${project.category}`)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-ink mb-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-muted text-sm leading-relaxed mb-6">
          {description}
        </p>
      </div>

      <div>
        {/* Tech Stack */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {project.stack.map((tech, index) => (
            <span
              key={index}
              className="font-mono text-xs bg-primary/10 text-primary-bright px-2 py-1 rounded border border-primary/20"
            >
              {isPlaceholder(tech) ? t("portfolio.clarify") : tech}
            </span>
          ))}
        </div>

        {/* Result Summary */}
        <div className="border-t border-borderSoft pt-4">
          <span className="text-xs font-bold text-ink block mb-1">
            {t("portfolio.resultLabel")}
          </span>
          <p
            className={`text-sm ${
              isPlaceholder(result)
                ? "text-muted italic"
                : "text-ink font-medium"
            }`}
          >
            {result}
          </p>
        </div>
      </div>
    </div>
  );
}
