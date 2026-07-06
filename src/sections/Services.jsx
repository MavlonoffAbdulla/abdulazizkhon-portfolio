import { useTranslation } from "react-i18next";
import { Database, Bot, Cpu, FileText, Code } from "lucide-react";

export default function Services() {
  const { t } = useTranslation();

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
      className="bg-white py-16 md:py-24 scroll-mt-20 border-t border-borderSoft"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-ink tracking-tight mb-4">
            {t("services.title")}
          </h2>
          <div className="w-12 h-1.5 bg-primary mx-auto rounded-full"></div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesList.map((service) => {
            const IconComponent = service.icon;
            return (
              <div
                key={service.key}
                className="bg-white border border-borderSoft rounded-xl p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group"
              >
                {/* Icon Wrapper */}
                <div className="w-12 h-12 rounded-lg bg-primary-light flex items-center justify-center text-primary mb-6 transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                  <IconComponent className="w-6 h-6" />
                </div>

                {/* Service Title */}
                <h3 className="text-xl font-bold text-ink mb-3 group-hover:text-primary transition-colors duration-200">
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
