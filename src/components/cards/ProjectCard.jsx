import { ArrowUpRight, Code2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useTilt } from "../../hooks/useTilt";

export default function ProjectCard({ project, revealIndex = 0 }) {
  const tilt = useTilt({ max: 6, scale: 1.015, perspective: 1000 });

  return (
    <article
      ref={tilt.ref}
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.onPointerLeave}
      className="project-card tilt-card reveal-item group"
      style={{ "--reveal-index": revealIndex }}
    >
      <span className="tilt-card-glare" aria-hidden="true" />
      <Link
        className="project-image-link"
        to={`/projects/${project.slug || project.id}`}
        aria-label={`Read the ${project.title} case study`}
      >
        {project.image ? (
          <img
            src={project.image}
            alt={project.imageAlt || `${project.title} project preview`}
            loading="lazy"
            className="transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center text-sm text-muted">
            No preview available
          </div>
        )}
      </Link>
      <div className="project-card-body">
        <div className="project-meta">
          <span
            className={`badge badge-${project.status?.toLowerCase().replace(/\s+/g, "-")}`}
          >
            {project.status}
          </span>
          {project.featured && (
            <span className="badge badge-featured">Featured</span>
          )}
          {project.category && (
            <span className="text-xs font-semibold text-muted">
              {project.category}
            </span>
          )}
        </div>
        <h3 className="group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
          {project.title}
        </h3>
        {project.subtitle && (
          <p className="project-subtitle">{project.subtitle}</p>
        )}
        <p className="project-description">{project.description}</p>
        <div className="tag-list" aria-label={`${project.title} technologies`}>
          {project.tags.slice(0, 6).map((tag) => (
            <span
              className="tag transition-colors hover:border-cyan-500/50"
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="project-card-actions">
          <Link
            className="text-link group/link"
            to={`/projects/${project.slug || project.id}`}
          >
            View details{" "}
            <ArrowUpRight
              size={15}
              className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
            />
          </Link>
          {project.github && (
            <a
              className="text-link"
              href={project.github}
              target="_blank"
              rel="noreferrer"
            >
              <Code2 size={15} /> GitHub
            </a>
          )}
          {project.demo && (
            <a
              className="text-link group/demo"
              href={project.demo}
              target="_blank"
              rel="noreferrer"
            >
              Live demo{" "}
              <ArrowUpRight
                size={15}
                className="transition-transform group-hover/demo:translate-x-0.5 group-hover/demo:-translate-y-0.5"
              />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
