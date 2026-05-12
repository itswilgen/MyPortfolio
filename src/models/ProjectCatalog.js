import Project from "./Project";

export default class ProjectCatalog {
  constructor(projectRecords) {
    this.projects = Object.freeze(projectRecords.map(Project.from));
    Object.freeze(this);
  }

  getFeaturedProjects() {
    return [...this.projects];
  }

  findById(id) {
    return this.projects.find((project) => project.matchesId(id)) ?? null;
  }
}
