import { useTranslation } from "react-i18next";
import useScrollReveal from "../hooks/useScrollReveal";
import SectionNumber from "../components/SectionNumber";

export default function About() {
  const { t } = useTranslation();
  const revealRef = useScrollReveal();

  return (
    <section
      id="about"
      className="bg-bgAlt py-16 md:py-24 scroll-mt-20 border-t border-borderSoft"
    >
      <div ref={revealRef} className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7">
            <SectionNumber value="01" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-6 tracking-tight">
              {t("about.title")}
            </h2>
            <p className="text-muted text-lg leading-relaxed mb-6">
              {t("about.text")}
            </p>
            {/* Detailed Approach */}
            <div className="border-l-4 border-primary-bright pl-4 py-3 my-6 bg-bg/45 rounded-r-lg">
              <p className="text-ink font-medium italic text-base leading-relaxed">
                {t(
                  "about.approach",
                  "Мой подход: сначала — чёткое техническое задание и архитектура, затем — разработка с регулярными демонстрациями прогресса, и в конце — сдача с поддержкой."
                )}
              </p>
            </div>
          </div>

          {/* Stats / Info Grid */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Stat 1 */}
            <div className="bg-bg border border-borderSoft rounded-xl p-5 shadow-sm hover:bg-surface hover:border-primary/45 hover:shadow-glow transition-all duration-300">
              <span className="text-xs font-bold uppercase tracking-wider text-primary-bright block mb-2">
                {t("about.stats.focus.label", "Специализация")}
              </span>
              <p className="text-ink font-semibold text-lg">
                {t("about.stats.focus.value", "Автоматизация")}
              </p>
              <p className="text-muted text-sm mt-1">
                {t("about.stats.focus.desc", "ERP/CRM & Боты")}
              </p>
            </div>

            {/* Stat 2 */}
            <div className="bg-bg border border-borderSoft rounded-xl p-5 shadow-sm hover:bg-surface hover:border-primary/45 hover:shadow-glow transition-all duration-300">
              <span className="text-xs font-bold uppercase tracking-wider text-primary-bright block mb-2">
                {t("about.stats.location.label", "Локация")}
              </span>
              <p className="text-ink font-semibold text-lg">
                {t("about.stats.location.value", "Узбекистан")}
              </p>
              <p className="text-muted text-sm mt-1">
                {t("about.stats.location.desc", "Ташкент / Удалённо")}
              </p>
            </div>

            {/* Stat 3 */}
            <div className="bg-bg border border-borderSoft rounded-xl p-5 shadow-sm hover:bg-surface hover:border-primary/45 hover:shadow-glow transition-all duration-300">
              <span className="text-xs font-bold uppercase tracking-wider text-primary-bright block mb-2">
                {t("about.stats.sectors.label", "Сферы")}
              </span>
              <p className="text-ink font-semibold text-lg">
                {t("about.stats.sectors.value", "B2B Сегмент")}
              </p>
              <p className="text-muted text-sm mt-1">
                {t("about.stats.sectors.desc", "Ритейл, Логистика, HoReCa")}
              </p>
            </div>

            {/* Stat 4 */}
            <div className="bg-bg border border-borderSoft rounded-xl p-5 shadow-sm hover:bg-surface hover:border-primary/45 hover:shadow-glow transition-all duration-300">
              <span className="text-xs font-bold uppercase tracking-wider text-primary-bright block mb-2">
                {t("about.stats.model.label", "Сотрудничество")}
              </span>
              <p className="text-ink font-semibold text-lg">
                {t("about.stats.model.value", "Под ключ")}
              </p>
              <p className="text-muted text-sm mt-1">
                {t("about.stats.model.desc", "От ТЗ до поддержки")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
