import { useState } from "react";
import { useTranslation } from "react-i18next";
import ClipboardList from "lucide-react/dist/esm/icons/clipboard-list";
import Layers from "lucide-react/dist/esm/icons/layers";
import GitFork from "lucide-react/dist/esm/icons/git-fork";
import ShieldCheck from "lucide-react/dist/esm/icons/shield-check";
import Rocket from "lucide-react/dist/esm/icons/rocket";

import useScrollReveal from "../hooks/useScrollReveal";
import SectionNumber from "../components/SectionNumber";

export default function Process() {
  const { t } = useTranslation();
  const revealRef = useScrollReveal();
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { id: 0, icon: ClipboardList, key: "step1" },
    { id: 1, icon: Layers, key: "step2" },
    { id: 2, icon: GitFork, key: "step3" },
    { id: 3, icon: ShieldCheck, key: "step4" },
    { id: 4, icon: Rocket, key: "step5" }
  ];

  return (
    <section id="process" className="py-20 bg-bg border-b border-borderSoft scroll-mt-16">
      <div ref={revealRef} className="max-w-4xl mx-auto px-4">
        {/* Section Heading */}
        <div className="flex items-center gap-3 mb-2">
          <SectionNumber value="06" />
          <span className="text-sm font-semibold tracking-wider text-primary uppercase font-mono mb-4">
            {t("process.tagline")}
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-12">
          {t("process.title")}
        </h2>

        {/* Process Flowchart Track */}
        <div className="relative mb-12 py-4">
          {/* Horizontal Line for Desktop */}
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-borderSoft transform -translate-y-1/2 hidden md:block" />
          
          {/* Glowing Active Track Segment */}
          <div 
            className="absolute top-1/2 left-0 h-[2px] bg-primary shadow-glow transform -translate-y-1/2 transition-all duration-500 hidden md:block"
            style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
          />

          {/* Steps Circle Row */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = activeStep === idx;
              const isPast = idx < activeStep;

              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(idx)}
                  className={`flex flex-col items-center gap-2 group focus:outline-none w-full md:w-auto`}
                >
                  {/* Circle Node */}
                  <div 
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-between justify-content-center justify-items-center transition-all duration-300 ${
                      isActive 
                        ? "border-primary bg-bg shadow-glow scale-110" 
                        : isPast 
                          ? "border-primary bg-primary text-white" 
                          : "border-borderSoft bg-bgAlt text-muted hover:border-muted"
                    }`}
                  >
                    <Icon className={`w-5 h-5 mx-auto transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-primary" : isPast ? "text-white" : "text-muted"}`} />
                  </div>

                  {/* Title Label */}
                  <span 
                    className={`text-xs font-bold uppercase tracking-wider font-mono text-center transition-colors duration-200 ${
                      isActive ? "text-primary-bright" : "text-muted group-hover:text-ink"
                    }`}
                  >
                    {t(`process.steps.${step.key}.title`)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Card for Active Step */}
        <div className="bg-bgAlt/50 border border-borderSoft p-6 md:p-8 rounded-xl shadow-lg relative overflow-hidden transition-all duration-300 hover:border-primary/20">
          {/* Subtle Decorative glow background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Step Icon Large */}
            <div className="w-16 h-16 rounded-xl border border-borderSoft bg-bg/70 flex items-center justify-center text-primary-bright shrink-0 shadow-md">
              {(() => {
                const ActiveIcon = steps[activeStep].icon;
                return <ActiveIcon className="w-8 h-8" />;
              })()}
            </div>

            {/* Content block */}
            <div className="flex-1">
              <span className="text-xs font-extrabold text-primary uppercase font-mono tracking-wider mb-1 block">
                {t("process.stepLabel", { current: activeStep + 1, total: steps.length })}
              </span>
              <h3 className="text-xl font-bold text-ink mb-3">
                {t(`process.steps.${steps[activeStep].key}.title`)}
              </h3>
              <p className="text-muted leading-relaxed text-sm mb-6">
                {t(`process.steps.${steps[activeStep].key}.desc`)}
              </p>

              {/* Deliverables Checklist */}
              <div className="border-t border-borderSoft pt-5">
                <h4 className="text-xs font-bold text-ink uppercase tracking-wider font-mono mb-3">
                  {t("process.deliverablesLabel")}
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[1, 2, 3].map((num) => {
                    const label = t(`process.steps.${steps[activeStep].key}.deliverable${num}`);
                    if (!label || label.startsWith("process.steps")) return null;
                    return (
                      <li key={num} className="flex items-center gap-2.5 text-xs text-muted">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span>{label}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
