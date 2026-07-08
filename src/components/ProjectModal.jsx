import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import X from "lucide-react/dist/esm/icons/x";
import Maximize2 from "lucide-react/dist/esm/icons/maximize-2";

export default function ProjectModal({ project, onClose }) {
  const { t } = useTranslation();
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  const [activeScreenshot, setActiveScreenshot] = useState(
    project.screenshots && project.screenshots.length > 0 ? project.screenshots[0] : null
  );
  const [zoomImage, setZoomImage] = useState(null);

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
        if (zoomImage) {
          setZoomImage(null);
        } else {
          onClose();
        }
      }

      // Simple focus trap
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
  }, [onClose, zoomImage]);

  // Handle overlay click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-bg/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
        onClick={handleBackdropClick}
      >
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="bg-bgAlt rounded-xl shadow-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto relative p-6 md:p-8 animate-scale-up border border-borderSoft"
        >
          {/* Close Button */}
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="absolute top-4 right-4 md:top-6 md:right-6 p-2 text-muted hover:text-primary-bright rounded-lg border border-transparent hover:border-borderSoft transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 z-10"
            aria-label={t("portfolio.closeModal", "Закрыть")}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Category Badge */}
          <div className="mb-3">
            <span className="text-xs font-semibold tracking-wider uppercase px-2.5 py-1 bg-primary/10 text-primary-bright border border-primary/20 rounded-full">
              {t(`portfolio.filters.${project.category}`)}
            </span>
          </div>

          {/* Title */}
          <h2
            id="modal-title"
            className="text-2xl md:text-3xl font-extrabold text-ink tracking-tight mb-6 pr-8 text-left"
          >
            {t(`portfolio.projects.${project.id}.title`)}
          </h2>

          {/* Screenshot Carousel/Viewer */}
          {activeScreenshot && (
            <div className="mb-6 flex flex-col gap-3">
              {/* Main Active Screenshot */}
              <div
                onClick={() => setZoomImage(activeScreenshot)}
                className="w-full rounded-xl overflow-hidden border border-borderSoft bg-bg cursor-zoom-in relative group shadow-sm flex items-center justify-center"
              >
                <img
                  src={activeScreenshot}
                  alt={t(`portfolio.projects.${project.id}.title`)}
                  className="w-full h-auto object-contain max-h-[280px] md:max-h-[340px] hover:scale-[1.015] transition-all duration-300"
                />
                {/* Zoom Badge overlay */}
                <div className="absolute bottom-3 right-3 bg-bg/85 backdrop-blur-sm border border-borderSoft p-2 rounded-lg text-muted group-hover:text-primary-bright transition-colors shadow">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>

              {/* Thumbnail Navigator (only if multiple screenshots exist) */}
              {project.screenshots && project.screenshots.length > 1 && (
                <div className="flex gap-2 items-center overflow-x-auto pb-1">
                  {project.screenshots.map((scr, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveScreenshot(scr)}
                      className={`w-16 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                        activeScreenshot === scr
                          ? "border-primary-bright shadow-glow"
                          : "border-borderSoft hover:border-muted"
                      }`}
                    >
                      <img src={scr} alt="thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Body Content */}
          <div className="flex flex-col gap-6 text-left">
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
                    className="text-xs bg-primary/10 text-primary-bright px-2.5 py-1 rounded border border-primary/20"
                  >
                    {isPlaceholder(tech) ? t("portfolio.clarify") : tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Result section */}
            <div className="border-t border-borderSoft pt-6">
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-5 shadow-glow">
                <h4 className="text-xs font-extrabold text-primary-bright uppercase tracking-wider mb-2">
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

      {/* Fullscreen Zoom Portal Overlay */}
      {zoomImage && (
        <div
          className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 cursor-zoom-out animate-fade-in"
          onClick={() => setZoomImage(null)}
        >
          <button
            onClick={() => setZoomImage(null)}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white rounded-lg border border-transparent hover:border-white/10 transition-colors z-[101]"
            aria-label={t("portfolio.closeModal", "Закрыть")}
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={zoomImage}
            alt="Screenshot Zoomed"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-scale-up"
          />
        </div>
      )}
    </>
  );
}
