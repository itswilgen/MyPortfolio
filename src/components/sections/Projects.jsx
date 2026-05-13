import { useMemo, useState } from "react";
import PageWrapper from "../../layouts/PageWrapper";
import SectionTitle from "../ui/SectionTitle";
import ProjectCard from "../cards/ProjectCard";
import { projectController } from "../../controllers/ProjectController";
import { COLORS } from "../../constants/theme";

export default function Projects() {
  const [activeStatus, setActiveStatus] = useState("All");
  const [query, setQuery] = useState("");
  const statuses = projectController.getProjectStatuses();
  const projects = useMemo(
    () =>
      projectController.getFilteredProjects({
        status: activeStatus,
        query,
      }),
    [activeStatus, query]
  );

  return (
    <PageWrapper
      id="projects"
      className="min-h-screen flex items-center py-24 lg:py-28"
    >
      <div className="w-full px-4 sm:px-5 lg:px-6">
        <div className="w-full">
          <SectionTitle label="Portfolio" title="Featured Projects" />

          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => {
                const isActive = activeStatus === status;

                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setActiveStatus(status)}
                    className="rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors duration-200"
                    style={{
                      background: isActive
                        ? COLORS.accent
                        : "rgba(255,255,255,0.05)",
                      color: isActive ? COLORS.navy : "rgba(232,244,253,0.64)",
                      border: isActive
                        ? "1px solid transparent"
                        : "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {status}
                  </button>
                );
              })}
            </div>

            <label className="relative w-full lg:max-w-sm">
              <span className="sr-only">Search projects</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by stack, title, or status"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-colors duration-200 focus:border-accent/50"
              />
            </label>
          </div>

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="glass-card p-8 text-center">
              <p
                className="text-sm font-medium"
                style={{ color: "rgba(232,244,253,0.65)" }}
              >
                No projects match that search yet.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveStatus("All");
                  setQuery("");
                }}
                className="mt-4 text-sm font-bold text-accent"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
