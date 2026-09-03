import { ArrowLeft, ArrowUpRight, Check, Code2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EmptyState from "../components/ui/EmptyState";
import LoadingState from "../components/ui/LoadingState";
import { getPublicProject } from "../services/contentService";

export default function ProjectDetail() {
  const { id } = useParams();
  const [state, setState] = useState({ project: null, loading: true, error: "" });
  useEffect(() => {
    let active = true;
    setState({ project: null, loading: true, error: "" });
    getPublicProject(id).then((project) => {
      if (active) setState({ project, loading: false, error: "" });
    }).catch((error) => {
      if (active) setState({ project: null, loading: false, error: error.message });
    });
    return () => { active = false; };
  }, [id]);

  if (state.loading) return <div className="detail-page section-container"><LoadingState label="Loading project" /></div>;
  if (!state.project) return <div className="detail-page section-container"><EmptyState title={state.error ? "Could not load this project" : "Project not found"} description={state.error || "This project may be unpublished or the link may be incorrect."} action={<Link className="btn-primary" to="/#projects">Back to projects</Link>} /></div>;
  const project = state.project;
  return (
    <article className="detail-page">
      <div className="section-container">
        <Link className="back-link" to="/#projects"><ArrowLeft size={18} /> Back to projects</Link>
        <header className="detail-hero">
          <div><div className="project-meta"><span className={`badge badge-${project.status?.toLowerCase().replace(/\s+/g, "-")}`}>{project.status}</span>{project.category && <span className="badge">{project.category}</span>}</div><h1>{project.title}</h1>{project.subtitle && <p className="project-subtitle">{project.subtitle}</p>}<p className="detail-summary">{project.description}</p></div>
          <div className="flex flex-wrap gap-3 lg:justify-end">{project.demo && <a className="btn-primary" href={project.demo} target="_blank" rel="noreferrer">Live demo <ArrowUpRight size={17} /></a>}{project.github && <a className="btn-secondary" href={project.github} target="_blank" rel="noreferrer"><Code2 size={17} /> GitHub</a>}</div>
        </header>
        {project.image && <figure className="detail-image"><img src={project.image} alt={project.imageAlt || `${project.title} interface`} /></figure>}
        <div className="detail-content">
          <div>
            {(project.problem || project.purpose) && <section className="detail-section"><h2>Problem and purpose</h2>{project.problem && <p>{project.problem}</p>}{project.purpose && <p className="mt-4">{project.purpose}</p>}</section>}
            <section className="detail-section"><h2>Project overview</h2><p>{project.longDescription}</p></section>
            {project.features?.length > 0 && <section className="detail-section"><h2>Key features</h2><ul className="feature-list">{project.features.map((feature) => <li key={feature}><Check size={18} className="mt-1 shrink-0 text-cyan-600 dark:text-cyan-300" />{feature}</li>)}</ul></section>}
            {project.screenshots?.length > 0 && <section className="detail-section"><h2>Screenshots</h2><div className="screenshot-grid">{project.screenshots.map((shot) => <img key={shot.url} src={shot.url} alt={shot.alt || `${project.title} screenshot`} loading="lazy" />)}</div></section>}
          </div>
          <aside className="detail-aside" aria-label="Technology stack"><h2 className="mb-5 font-display text-lg font-bold">Technology stack</h2>{Object.entries(project.stack).filter(([, values]) => values.length).map(([group, values]) => <div className="stack-group" key={group}><h3>{group}</h3><div className="tag-list mt-0">{values.map((value) => <span className="tag" key={value}>{value}</span>)}</div></div>)}</aside>
        </div>
      </div>
    </article>
  );
}
