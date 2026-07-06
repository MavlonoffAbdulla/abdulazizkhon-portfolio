import { useTranslation } from "react-i18next";
import useTilt from "../hooks/useTilt";

export default function ProjectCard({ project, onClick }) {
  const { t } = useTranslation();
  const cardRef = useTilt();

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

  return (
    <div
      ref={cardRef}
      role="button"
      tabIndex={0}
      aria-haspopup="dialog"
      aria-label={t(`portfolio.projects.${project.id}.title`)}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className="bg-white border border-borderSoft rounded-xl p-6 transition-all duration-300 hover:shadow-md flex flex-col justify-between h-full text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
    >
      <div>
        {/* Category Badge */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold tracking-wider uppercase px-2.5 py-1 bg-primary-light text-primary rounded-full">
            {t(`portfolio.filters.${project.category}`)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-ink mb-2">
          {t(`portfolio.projects.${project.id}.title`)}
        </h3>

        {/* Description */}
        <p className="text-muted text-sm leading-relaxed mb-6">
          {t(`portfolio.projects.${project.id}.description`)}
        </p>
      </div>

      <div>
        {/* Tech Stack */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {project.stack.map((tech, index) => (
            <span
              key={index}
              className="text-xs bg-bgAlt text-muted px-2 py-1 rounded border border-borderSoft"
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
              isPlaceholder(t(`portfolio.projects.${project.id}.result`))
                ? "text-muted italic"
                : "text-ink font-medium"
            }`}
          >
            {t(`portfolio.projects.${project.id}.result`)}
          </p>
        </div>
      </div>
    </div>
  );
}
