import { useTranslation } from "react-i18next";
import useScrollReveal from "../hooks/useScrollReveal";
import SectionNumber from "../components/SectionNumber";

export default function Timeline() {
  const { t } = useTranslation();
  const revealRef = useScrollReveal();

  const steps = [
    {
      year: "2021",
      titleKey: "timeline.step1.title",
      descKey: "timeline.step1.desc"
    },
    {
      year: "2022",
      titleKey: "timeline.step2.title",
      descKey: "timeline.step2.desc"
    },
    {
      year: "2023 – 2024",
      titleKey: "timeline.step3.title",
      descKey: "timeline.step3.desc"
    },
    {
      year: "2025 – " + t("timeline.present", "Наст. время"),
      titleKey: "timeline.step4.title",
      descKey: "timeline.step4.desc"
    }
  ];

  return (
    <section
      id="journey"
      className="bg-bg py-16 md:py-24 scroll-mt-20 border-t border-borderSoft"
    >
      <div ref={revealRef} className="max-w-4xl mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-16">
          <SectionNumber value="02" />
          <h2 className="text-3xl md:text-4xl font-extrabold text-ink tracking-tight mb-4">
            {t("timeline.title", "Мой путь")}
          </h2>
          <div className="w-12 h-1.5 bg-gradient-to-r from-primary via-primary-bright to-gradEnd mx-auto rounded-full shadow-glow"></div>
        </div>

        {/* Vertical Timeline container */}
        <div className="relative border-l-2 border-borderSoft md:border-l-0 md:before:absolute md:before:left-1/2 md:before:top-0 md:before:bottom-0 md:before:w-0.5 md:before:bg-gradient-to-b md:before:from-primary md:before:via-primary-bright md:before:to-glow md:before:-translate-x-1/2 ml-4 md:ml-0">
          
          {steps.map((step, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <div
                key={idx}
                className={`relative mb-12 last:mb-0 pl-8 md:pl-0 md:grid md:grid-cols-2 md:gap-8 items-center ${
                  isLeft ? "" : "md:flex-row-reverse"
                }`}
              >
                {/* Node dot (centered on desktop, left-aligned on mobile) */}
                <div className="absolute left-0 top-1.5 md:left-1/2 -translate-x-[5px] md:-translate-x-1/2 w-3.5 h-3.5 rounded-full bg-bg border-2 border-primary-bright shadow-glow scale-110 z-10" />

                {/* Left Column Content */}
                {isLeft ? (
                  <div className="md:text-right pr-0 md:pr-8">
                    <span className="inline-block px-3 py-1 text-xs font-bold font-mono tracking-wider text-primary-bright bg-primary/10 border border-primary/20 rounded-full mb-3 uppercase">
                      {step.year}
                    </span>
                    <h4 className="text-lg font-bold text-ink mb-2">
                      {t(step.titleKey)}
                    </h4>
                    <p className="text-muted text-sm leading-relaxed">
                      {t(step.descKey)}
                    </p>
                  </div>
                ) : (
                  <div className="hidden md:block" />
                )}

                {/* Right Column Content */}
                {!isLeft ? (
                  <div className="md:text-left pl-0 md:pl-8">
                    <span className="inline-block px-3 py-1 text-xs font-bold font-mono tracking-wider text-primary-bright bg-primary/10 border border-primary/20 rounded-full mb-3 uppercase">
                      {step.year}
                    </span>
                    <h4 className="text-lg font-bold text-ink mb-2">
                      {t(step.titleKey)}
                    </h4>
                    <p className="text-muted text-sm leading-relaxed">
                      {t(step.descKey)}
                    </p>
                  </div>
                ) : (
                  <div className="hidden md:block" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
