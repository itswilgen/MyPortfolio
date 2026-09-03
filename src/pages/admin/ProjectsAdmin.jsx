import { Eye, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../../components/ui/EmptyState";
import LoadingState from "../../components/ui/LoadingState";
import Modal from "../../components/ui/Modal";
import { useToast } from "../../contexts/ToastContext";
import { useSiteData } from "../../contexts/SiteDataContext";
import { deleteProject, getAdminProjects, setProjectState } from "../../services/adminService";

export default function ProjectsAdmin() {
  const [state, setState] = useState({ items: [], loading: true, error: "" });
  const [remove, setRemove] = useState(null);
  const { notify } = useToast();
  const { refresh } = useSiteData();
  const load = useCallback(() => { setState((value) => ({ ...value, loading: true })); getAdminProjects().then((items) => setState({ items, loading: false, error: "" })).catch((error) => setState({ items: [], loading: false, error: error.message })); }, []);
  useEffect(() => { load(); }, [load]);
  const toggle = async (project, key) => {
    try { await setProjectState(project.databaseId, { [key]: !project[key] }); await refresh(); notify(`${project.title} updated.`); load(); } catch (error) { notify(error.message, "error"); }
  };
  const confirmDelete = async () => {
    try { await deleteProject(remove.databaseId); await refresh(); notify(`${remove.title} deleted.`); setRemove(null); load(); } catch (error) { notify(error.message, "error"); }
  };
  return <><div className="breadcrumbs"><span>Admin</span><span>/</span><span>Projects</span></div><header className="admin-page-header"><div><h1>Projects</h1><p>Create, order, preview, and publish portfolio case studies.</p></div><Link className="btn-primary" to="/admin/projects/new"><Plus size={17} /> Add project</Link></header>
    {state.loading ? <LoadingState label="Loading projects" /> : state.error ? <p className="field-error" role="alert">{state.error}</p> : !state.items.length ? <EmptyState title="No projects yet" description="Create your first project case study." action={<Link className="btn-primary" to="/admin/projects/new">Add project</Link>} /> : <div className="admin-panel"><div className="responsive-table"><table><thead><tr><th>Project</th><th>Status</th><th>Order</th><th>Published</th><th>Featured</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{state.items.map((project) => <tr key={project.databaseId}><td><div className="table-title">{project.title}</div><div className="text-xs text-muted">/{project.slug}</div></td><td><span className={`badge badge-${project.status?.toLowerCase().replace(/\s+/g, "-")}`}>{project.status}</span></td><td>{project.displayOrder}</td><td><button type="button" className={`badge ${project.published ? "badge-published" : "badge-draft"}`} onClick={() => toggle(project, "published")}>{project.published ? "Published" : "Draft"}</button></td><td><button type="button" className="badge" onClick={() => toggle(project, "featured")}>{project.featured ? "Featured" : "Standard"}</button></td><td><div className="table-actions"><Link to={`/admin/projects/${project.databaseId}/preview`} aria-label={`Preview ${project.title}`}><Eye size={15} /></Link><Link to={`/admin/projects/${project.databaseId}/edit`}>Edit</Link><button type="button" onClick={() => setRemove(project)} aria-label={`Delete ${project.title}`}><Trash2 size={15} /></button></div></td></tr>)}</tbody></table></div></div>}
    <Modal open={Boolean(remove)} title="Delete project?" onClose={() => setRemove(null)} actions={<><button className="btn-secondary" type="button" onClick={() => setRemove(null)}>Cancel</button><button className="btn-danger" type="button" onClick={confirmDelete}>Delete project</button></>}><p>This permanently removes <strong>{remove?.title}</strong>. Uploaded files are retained so they can be recovered manually.</p></Modal>
  </>;
}
