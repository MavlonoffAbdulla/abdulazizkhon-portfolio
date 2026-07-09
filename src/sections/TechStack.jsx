import { useTranslation } from "react-i18next";
import useScrollReveal from "../hooks/useScrollReveal";
import SectionNumber from "../components/SectionNumber";

export default function TechStack() {
  const { t } = useTranslation();
  const revealRef = useScrollReveal();

  const techs = ["react", "fastapi", "postgres", "docker", "python", "telegram", "ai"];

  return (
    <section
      id="stack"
      className="bg-bg py-16 md:py-24 scroll-mt-20 border-t border-borderSoft"
    >
      <div ref={revealRef} className="max-w-6xl mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-12">
          <SectionNumber value="04" />
          <h2 className="text-3xl md:text-4xl font-extrabold text-ink tracking-tight mb-4">
            {t("stack.title")}
          </h2>
          <div className="w-12 h-1.5 bg-gradient-to-r from-primary via-primary-bright to-[#7DD3FC] mx-auto rounded-full shadow-glow"></div>
        </div>

        {/* Tech Grid */}
        <div className="flex flex-wrap items-center justify-center gap-4 max-w-4xl mx-auto">
          {techs.map((tech) => (
            <div
              key={tech}
              className="bg-bgAlt border border-borderSoft hover:border-primary/45 rounded-xl px-6 py-4 transition-all duration-300 hover:bg-surface hover:shadow-glow flex items-center justify-center text-center font-sans font-bold text-lg text-ink"
            >
              {t(`stack.items.${tech}`)}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
