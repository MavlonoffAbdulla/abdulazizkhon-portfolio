import { useTranslation } from "react-i18next";
import Database from "lucide-react/dist/esm/icons/database";
import Bot from "lucide-react/dist/esm/icons/bot";
import Cpu from "lucide-react/dist/esm/icons/cpu";
import FileText from "lucide-react/dist/esm/icons/file-text";
import Code from "lucide-react/dist/esm/icons/code";

import useScrollReveal from "../hooks/useScrollReveal";

export default function Services() {
  const { t } = useTranslation();
  const revealRef = useScrollReveal();

  const servicesList = [
    { key: "erp", icon: Database },
    { key: "bots", icon: Bot },
    { key: "ai", icon: Cpu },
    { key: "automation", icon: FileText },
    { key: "custom", icon: Code }
  ];

  return (
    <section
      id="services"
      className="bg-bg py-16 md:py-24 scroll-mt-20 border-t border-borderSoft"
    >
      <div ref={revealRef} className="max-w-6xl mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-ink tracking-tight mb-4">
            {t("services.title")}
          </h2>
          <div className="w-12 h-1.5 bg-primary-bright mx-auto rounded-full shadow-glow"></div>
        </div>

        {/* Grid of service cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesList.map((service) => {
            const IconComponent = service.icon;
            return (
              <div
                key={service.key}
                className="bg-bgAlt border border-borderSoft rounded-xl p-6 transition-all duration-300 hover:bg-surface hover:border-primary/45 hover:shadow-glow group"
              >
                {/* Icon Wrapper */}
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary-bright mb-6 transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:border-primary group-hover:shadow-glow">
                  <IconComponent className="w-6 h-6" />
                </div>

                {/* Service Title */}
                <h3 className="text-xl font-bold text-ink mb-3 group-hover:text-primary-bright transition-colors duration-200">
                  {t(`services.items.${service.key}.title`)}
                </h3>

                {/* Service Text */}
                <p className="text-muted text-sm leading-relaxed">
                  {t(`services.items.${service.key}.text`)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
