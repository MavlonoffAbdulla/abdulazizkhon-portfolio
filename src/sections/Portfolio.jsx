import { useState } from "react";
import { useTranslation } from "react-i18next";
import { projects } from "../data/projects";
import ProjectCard from "../components/ProjectCard";
import ProjectModal from "../components/ProjectModal";

import useScrollReveal from "../hooks/useScrollReveal";

export default function Portfolio() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);
  const revealRef = useScrollReveal();

  const filters = ["all", "erp", "bots", "ai", "automation"];

  const filteredProjects = activeFilter === "all"
    ? projects
    : projects.filter((p) => p.category === activeFilter);

  return (
    <section
      id="portfolio"
      className="bg-bgAlt py-16 md:py-24 scroll-mt-20 border-t border-borderSoft"
    >
      <div ref={revealRef} className="max-w-6xl mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-ink tracking-tight mb-4">
            {t("portfolio.title")}
          </h2>
          <div className="w-12 h-1.5 bg-primary-bright mx-auto rounded-full shadow-glow"></div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {filters.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/45 ${
                  isActive
                    ? "bg-primary text-white shadow-glow"
                    : "bg-bg text-muted hover:text-ink hover:bg-surface border border-borderSoft"
                }`}
              >
                {t(`portfolio.filters.${filter}`)}
              </button>
            );
          })}
        </div>

        {/* Grid of projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>

      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}
