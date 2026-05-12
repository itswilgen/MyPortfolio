import PageWrapper from "../../layouts/PageWrapper";
import SectionTitle from "../ui/SectionTitle";
import ProjectCard from "../cards/ProjectCard";
import { projectController } from "../../controllers/ProjectController";

export default function Projects() {
  const projects = projectController.getFeaturedProjects();

  return (
    <PageWrapper
      id="projects"
      className="min-h-screen flex items-center py-24 lg:py-28"
    >
      <div className="w-full px-4 sm:px-5 lg:px-6">
        <div className="w-full">
          <SectionTitle label="Portfolio" title="Featured Projects" />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
