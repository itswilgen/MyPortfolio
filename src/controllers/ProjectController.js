import { PROJECT_RECORDS } from "../data/projects";
import ProjectCatalog from "../models/ProjectCatalog";

export class ProjectController {
  constructor(projectCatalog) {
    this.projectCatalog = projectCatalog;
  }

  getFeaturedProjects() {
    return this.projectCatalog.getFeaturedProjects();
  }

  getProjectById(id) {
    return this.projectCatalog.findById(id);
  }
}

export const projectController = new ProjectController(
  new ProjectCatalog(PROJECT_RECORDS)
);
