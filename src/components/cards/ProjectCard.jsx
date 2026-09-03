import { ArrowUpRight, Code2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <Link className="project-image-link" to={`/projects/${project.slug || project.id}`} aria-label={`Read the ${project.title} case study`}>
        {project.image ? <img src={project.image} alt={project.imageAlt || `${project.title} project preview`} loading="lazy" /> : <div className="grid h-full place-items-center text-sm text-muted">No preview available</div>}
      </Link>
      <div className="project-card-body">
        <div className="project-meta">
          <span className={`badge badge-${project.status?.toLowerCase().replace(/\s+/g, "-")}`}>{project.status}</span>
          {project.featured && <span className="badge">Featured</span>}
          {project.category && <span className="text-xs font-semibold text-muted">{project.category}</span>}
        </div>
        <h3>{project.title}</h3>
        {project.subtitle && <p className="project-subtitle">{project.subtitle}</p>}
        <p className="project-description">{project.description}</p>
        <div className="tag-list" aria-label={`${project.title} technologies`}>{project.tags.slice(0, 6).map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
        <div className="project-card-actions">
          <Link className="text-link" to={`/projects/${project.slug || project.id}`}>View details <ArrowUpRight size={15} /></Link>
          {project.github && <a className="text-link" href={project.github} target="_blank" rel="noreferrer"><Code2 size={15} /> GitHub</a>}
          {project.demo && <a className="text-link" href={project.demo} target="_blank" rel="noreferrer">Live demo <ArrowUpRight size={15} /></a>}
        </div>
      </div>
    </article>
  );
}
