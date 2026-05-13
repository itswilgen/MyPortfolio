import Project from "./Project";

export default class ProjectCatalog {
  constructor(projectRecords) {
    this.projects = Object.freeze(projectRecords.map(Project.from));
    Object.freeze(this);
  }

  getFeaturedProjects() {
    return [...this.projects];
  }

  getStatuses() {
    return ["All", ...new Set(this.projects.map((project) => project.status))];
  }

  filter({ status = "All", query = "" } = {}) {
    return this.projects.filter(
      (project) => project.matchesStatus(status) && project.matchesQuery(query)
    );
  }

  findById(id) {
    return this.projects.find((project) => project.matchesId(id)) ?? null;
  }
}
