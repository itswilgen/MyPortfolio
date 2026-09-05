import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useSiteData } from "../../contexts/SiteDataContext";
import PageWrapper from "../../layouts/PageWrapper";
import ProjectCard from "../cards/ProjectCard";
import EmptyState from "../ui/EmptyState";
import LoadingState from "../ui/LoadingState";

export default function Projects() {
  const { projects, loading } = useSiteData();
  const [status, setStatus] = useState("All");
  const [query, setQuery] = useState("");
  const statuses = useMemo(() => ["All", ...new Set(projects.map((item) => item.status).filter(Boolean))], [projects]);
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesStatus = status === "All" || project.status === status;
      const haystack = [project.title, project.subtitle, project.description, project.category, ...project.tags].join(" ").toLowerCase();
      return matchesStatus && (!normalized || haystack.includes(normalized));
    });
  }, [projects, query, status]);

  return (
    <PageWrapper id="projects" className="section-block">
      <div className="section-container">
        <div className="section-heading-row reveal-item" style={{ "--reveal-index": 0 }}>
          <div><span className="section-kicker">Selected work</span><h2 className="section-heading">Projects built around real needs.</h2></div>
          <p className="section-intro">Full-stack systems and product experiments, with the decisions and technology behind each build.</p>
        </div>
        <div className="project-tools reveal-item" style={{ "--reveal-index": 1 }}>
          <div className="filter-tabs" aria-label="Filter projects by status">
            {statuses.map((item) => <button type="button" key={item} className={`filter-button ${status === item ? "is-active" : ""}`} aria-pressed={status === item} onClick={() => setStatus(item)}>{item}</button>)}
          </div>
          <label className="search-control"><span className="sr-only">Search projects</span><Search size={18} /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects" /></label>
        </div>
        {loading ? <LoadingState label="Loading projects" /> : filtered.length ? (
          <div className="project-grid">{filtered.map((project, index) => <ProjectCard key={project.databaseId || project.id} project={project} revealIndex={index + 2} />)}</div>
        ) : <EmptyState title="No projects found" description="Try a different status or search term." action={<button type="button" className="btn-secondary" onClick={() => { setStatus("All"); setQuery(""); }}>Clear filters</button>} />}
      </div>
    </PageWrapper>
  );
}
