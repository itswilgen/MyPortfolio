import { FolderPlus, ImagePlus, UserRoundPen } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingState from "../../components/ui/LoadingState";
import { getDashboardData } from "../../services/adminService";

export default function Dashboard() {
  const [state, setState] = useState({ data: null, loading: true, error: "" });
  useEffect(() => { getDashboardData().then((data) => setState({ data, loading: false, error: "" })).catch((error) => setState({ data: null, loading: false, error: error.message })); }, []);
  if (state.loading) return <LoadingState label="Loading dashboard" />;
  if (state.error) return <p role="alert" className="field-error">{state.error}</p>;
  const metrics = [["Total projects", state.data.totalProjects], ["Published", state.data.publishedProjects], ["Drafts", state.data.draftProjects], ["Featured", state.data.featuredProjects], ["Published proofs", state.data.publishedProofs]];
  return <><div className="breadcrumbs"><span>Admin</span><span>/</span><span>Dashboard</span></div><header className="admin-page-header"><div><h1>Dashboard</h1><p>Manage the content that appears across your portfolio.</p></div><Link to="/admin/projects/new" className="btn-primary"><FolderPlus size={17} /> Add project</Link></header><div className="metric-grid">{metrics.map(([label, value]) => <div className="metric" key={label}><strong>{value}</strong><span>{label}</span></div>)}</div><p className="mt-4 text-xs text-muted">Last updated: {state.data.lastUpdated ? new Date(state.data.lastUpdated).toLocaleString() : "No content yet"}</p><div className="quick-actions"><Link className="quick-action" to="/admin/projects/new"><FolderPlus size={22} /><div><strong>Add a project</strong><span className="block">Create and publish a new case study.</span></div></Link><Link className="quick-action" to="/admin/profile"><UserRoundPen size={22} /><div><strong>Edit biography</strong><span className="block">Update your public profile and availability.</span></div></Link><Link className="quick-action" to="/admin/payment-proofs"><ImagePlus size={22} /><div><strong>Add payment proof</strong><span className="block">Upload a reviewed, privacy-safe record.</span></div></Link></div></>;
}
