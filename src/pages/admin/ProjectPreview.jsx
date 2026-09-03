import { ArrowLeft, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import LoadingState from "../../components/ui/LoadingState";
import { getAdminProject } from "../../services/adminService";

export default function ProjectPreview() {
  const { id } = useParams();
  const [state, setState] = useState({ project: null, loading: true, error: "" });
  useEffect(() => { getAdminProject(id).then((project) => setState({ project, loading: false, error: "" })).catch((error) => setState({ project: null, loading: false, error: error.message })); }, [id]);
  if (state.loading) return <LoadingState label="Loading preview" />;
  if (state.error) return <p className="field-error" role="alert">{state.error}</p>;
  const project = state.project;
  return <><div className="breadcrumbs"><span>Admin</span><span>/</span><Link to="/admin/projects">Projects</Link><span>/</span><span>Preview</span></div><header className="admin-page-header"><div><h1>Project preview</h1><p>This protected preview includes drafts and unpublished changes.</p></div><Link className="btn-secondary" to="/admin/projects"><ArrowLeft size={17} /> Back</Link></header><article className="admin-panel overflow-hidden"><div className="p-6 sm:p-10"><div className="project-meta"><span className={`badge ${project.published ? "badge-published" : "badge-draft"}`}>{project.published ? "Published" : "Draft"}</span><span className="badge">{project.status}</span></div><h2 className="break-words font-display text-4xl font-bold">{project.title}</h2><p className="project-subtitle">{project.subtitle}</p><p className="detail-summary">{project.description}</p>{project.image && <img className="mt-8 aspect-[16/8] w-full rounded-lg border border-line object-cover object-top" src={project.image} alt={project.imageAlt} />}<section className="detail-section mt-10"><h2>Project overview</h2><p>{project.longDescription}</p></section>{project.features.length > 0 && <section className="detail-section"><h2>Key features</h2><ul className="feature-list">{project.features.map((feature) => <li key={feature}><Check size={17} className="mt-1 shrink-0" />{feature}</li>)}</ul></section>}</div></article></>;
}
