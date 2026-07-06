import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";

export default function ProjectModal({ project, onClose }) {
  const { t } = useTranslation();
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  const isPlaceholder = (text) =>
    text &&
    (text.includes("[уточнить") ||
      text.includes("[clarify") ||
      text.includes("[muallifdan"));

  useEffect(() => {
    // 1. Save currently focused element and set focus to modal close button
    const previousActiveElement = document.activeElement;
    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }

    // 2. Lock body scroll and cache original overflow style
    const originalOverflow = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    // 3. Close on Escape key press
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
      
      // Simple focus trap: tab key wraps focus inside the modal
      if (event.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      // Restore scroll and restore focus
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      if (previousActiveElement && typeof previousActiveElement.focus === "function") {
        previousActiveElement.focus();
      }
    };
  }, [onClose]);

  // Handle overlay click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative p-6 md:p-8 animate-slide-up border border-borderSoft"
      >
        {/* Close Button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 p-2 text-muted hover:text-primary rounded-lg border border-transparent hover:border-borderSoft transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
          aria-label={t("portfolio.closeModal", "Закрыть")}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Category Badge */}
        <div className="mb-3">
          <span className="text-xs font-semibold tracking-wider uppercase px-2.5 py-1 bg-primary-light text-primary rounded-full">
            {t(`portfolio.filters.${project.category}`)}
          </span>
        </div>

        {/* Title */}
        <h2
          id="modal-title"
          className="text-2xl md:text-3xl font-extrabold text-ink tracking-tight mb-6 pr-8"
        >
          {t(`portfolio.projects.${project.id}.title`)}
        </h2>

        {/* Body Content */}
        <div className="flex flex-col gap-6">
          {/* Task section */}
          <div>
            <h4 className="text-xs font-extrabold text-muted uppercase tracking-wider mb-2">
              {t("portfolio.taskLabel")}
            </h4>
            <p className="text-ink text-base leading-relaxed">
              {t(`portfolio.projects.${project.id}.task`)}
            </p>
          </div>

          {/* Solution section */}
          <div>
            <h4 className="text-xs font-extrabold text-muted uppercase tracking-wider mb-2">
              {t("portfolio.solutionLabel")}
            </h4>
            <p className="text-ink text-base leading-relaxed">
              {t(`portfolio.projects.${project.id}.solution`)}
            </p>
          </div>

          {/* Tech Stack tags */}
          <div>
            <h4 className="text-xs font-extrabold text-muted uppercase tracking-wider mb-2">
              {t("stack.title")}
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {project.stack.map((tech, index) => (
                <span
                  key={index}
                  className="text-xs bg-bgAlt text-muted px-2.5 py-1 rounded border border-borderSoft"
                >
                  {isPlaceholder(tech) ? t("portfolio.clarify") : tech}
                </span>
              ))}
            </div>
          </div>

          {/* Result section */}
          <div className="border-t border-borderSoft pt-6">
            <div className="bg-primary-light/50 border border-primary/10 rounded-xl p-5">
              <h4 className="text-xs font-extrabold text-primary uppercase tracking-wider mb-2">
                {t("portfolio.resultLabel")}
              </h4>
              <p
                className={`text-base leading-relaxed ${
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
      </div>
    </div>
  );
}
