import { ArrowDown, ArrowUp, Award, Eye, Plus, Search, Star, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CertificateViewer from "../../components/certificates/CertificateViewer";
import EmptyState from "../../components/ui/EmptyState";
import LoadingState from "../../components/ui/LoadingState";
import Modal from "../../components/ui/Modal";
import { useSiteData } from "../../contexts/SiteDataContext";
import { useToast } from "../../contexts/ToastContext";
import {
  deleteCertificate,
  getAdminCertificates,
  reorderCertificates,
  setCertificateState,
} from "../../services/adminService";

const formatDate = (value, options = { month: "short", year: "numeric" }) => value
  ? new Date(value.includes("T") ? value : `${value}T00:00:00`).toLocaleDateString(undefined, options)
  : "—";

function CertificateActions({ certificate, onView, onToggle, onDelete }) {
  return (
    <div className="certificate-admin-actions">
      <button type="button" onClick={() => onView(certificate)} aria-label={`View ${certificate.title}`}><Eye size={16} aria-hidden="true" /> View</button>
      <Link to={`/admin/certificates/${certificate.databaseId}/edit`}>Edit</Link>
      <button type="button" onClick={() => onToggle(certificate, "published")}>{certificate.published ? "Unpublish" : "Publish"}</button>
      <button type="button" onClick={() => onToggle(certificate, "featured")}><Star size={15} aria-hidden="true" /> {certificate.featured ? "Unfeature" : "Feature"}</button>
      <button type="button" className="danger-action" onClick={() => onDelete(certificate)} aria-label={`Delete ${certificate.title}`}><Trash2 size={16} aria-hidden="true" /> Delete</button>
    </div>
  );
}

export default function CertificatesAdmin() {
  const [state, setState] = useState({ items: [], loading: true, error: "" });
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("order");
  const [selected, setSelected] = useState(null);
  const [remove, setRemove] = useState(null);
  const [busyId, setBusyId] = useState("");
  const { notify } = useToast();
  const { refresh } = useSiteData();

  const load = useCallback(() => {
    setState((current) => ({ ...current, loading: true, error: "" }));
    getAdminCertificates()
      .then((items) => setState({ items, loading: false, error: "" }))
      .catch((error) => setState({ items: [], loading: false, error: error.message }));
  }, []);

  useEffect(() => { load(); }, [load]);

  const categories = useMemo(() => ["All", ...new Set(state.items.map((item) => item.category).filter(Boolean))], [state.items]);
  const ordered = useMemo(() => [...state.items].sort((a, b) => a.displayOrder - b.displayOrder || new Date(b.issueDate) - new Date(a.issueDate)), [state.items]);
  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const filtered = state.items
      .filter((item) => !normalized || `${item.title} ${item.issuer}`.toLowerCase().includes(normalized))
      .filter((item) => category === "All" || item.category === category)
      .filter((item) => status === "All" || (status === "Published" ? item.published : !item.published));
    return [...filtered].sort((a, b) => {
      if (sort === "newest") return new Date(b.issueDate) - new Date(a.issueDate);
      if (sort === "oldest") return new Date(a.issueDate) - new Date(b.issueDate);
      if (sort === "updated") return new Date(b.updatedAt) - new Date(a.updatedAt);
      return a.displayOrder - b.displayOrder || new Date(b.issueDate) - new Date(a.issueDate);
    });
  }, [category, query, sort, state.items, status]);

  const toggle = async (certificate, key) => {
    setBusyId(certificate.databaseId);
    try {
      await setCertificateState(certificate.databaseId, { [key]: !certificate[key] });
      await refresh();
      notify(`${certificate.title} ${key === "published" ? (certificate.published ? "unpublished" : "published") : (certificate.featured ? "removed from featured" : "featured")}.`);
      load();
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setBusyId("");
    }
  };

  const move = async (certificate, direction) => {
    const index = ordered.findIndex((item) => item.databaseId === certificate.databaseId);
    const adjacent = ordered[index + direction];
    if (!adjacent) return;
    const nextOrder = ordered.map((item) => item.databaseId);
    [nextOrder[index], nextOrder[index + direction]] = [nextOrder[index + direction], nextOrder[index]];
    setBusyId(certificate.databaseId);
    try {
      await reorderCertificates(nextOrder);
      await refresh();
      notify(`${certificate.title} reordered.`);
      load();
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setBusyId("");
    }
  };

  const confirmDelete = async () => {
    if (!remove) return;
    setBusyId(remove.databaseId);
    try {
      const result = await deleteCertificate(remove);
      await refresh();
      notify(`${remove.title} was deleted.`);
      if (result.cleanupWarning) notify(result.cleanupWarning, "error");
      setRemove(null);
      load();
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setBusyId("");
    }
  };

  const clearFilters = () => { setQuery(""); setCategory("All"); setStatus("All"); setSort("order"); };
  const reorderControls = (certificate) => {
    const index = ordered.findIndex((item) => item.databaseId === certificate.databaseId);
    return <div className="reorder-controls" aria-label={`Reorder ${certificate.title}`}><button type="button" className="icon-button" disabled={index <= 0 || Boolean(busyId)} onClick={() => move(certificate, -1)} aria-label={`Move ${certificate.title} earlier`} title="Move earlier"><ArrowUp size={16} /></button><span>{certificate.displayOrder}</span><button type="button" className="icon-button" disabled={index < 0 || index >= ordered.length - 1 || Boolean(busyId)} onClick={() => move(certificate, 1)} aria-label={`Move ${certificate.title} later`} title="Move later"><ArrowDown size={16} /></button></div>;
  };

  return (
    <>
      <div className="breadcrumbs"><span>Admin</span><span>/</span><span>Certificates</span></div>
      <header className="admin-page-header"><div><h1>Certificates</h1><p>Organize, review, and publish verified learning credentials.</p></div><Link className="btn-primary" to="/admin/certificates/new"><Plus size={17} /> Add certificate</Link></header>
      <div className="certificate-admin-filters">
        <label className="search-control"><span className="sr-only">Search certificates</span><Search size={18} aria-hidden="true" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title or issuer" /></label>
        <label><span className="sr-only">Category</span><select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label><span className="sr-only">Publication status</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option>All</option><option>Published</option><option>Draft</option></select></label>
        <label><span className="sr-only">Sort certificates</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="order">Display order</option><option value="updated">Recently updated</option><option value="newest">Newest issued</option><option value="oldest">Oldest issued</option></select></label>
      </div>

      {state.loading ? <LoadingState label="Loading certificates" /> : state.error ? (
        <EmptyState title="Certificates could not be loaded" description={state.error} action={<button className="btn-secondary" type="button" onClick={load}>Try again</button>} />
      ) : !state.items.length ? (
        <EmptyState title="No certificates yet" description="Add your first genuine certificate or learning credential." action={<Link className="btn-primary" to="/admin/certificates/new">Add certificate</Link>} />
      ) : !visible.length ? (
        <EmptyState title="No certificates match" description="Try another search, category, or publication status." action={<button className="btn-secondary" type="button" onClick={clearFilters}>Clear filters</button>} />
      ) : (
        <div className="certificate-admin-panel">
          <div className="certificate-table-wrap">
            <table className="certificate-table"><thead><tr><th>Certificate</th><th>Category / issue date</th><th>Status</th><th>Order</th><th>Updated</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{visible.map((certificate) => (
              <tr key={certificate.databaseId} aria-busy={busyId === certificate.databaseId}>
                <td><div className="certificate-table-title">{certificate.imageUrl ? <img src={certificate.imageUrl} alt="" /> : <span><Award size={20} aria-hidden="true" /></span>}<div><strong>{certificate.title}</strong><small>{certificate.issuer}</small></div></div></td>
                <td><span>{certificate.category}</span><small className="block text-muted">{formatDate(certificate.issueDate)}</small></td>
                <td><div className="flex flex-wrap gap-2"><span className={`badge ${certificate.published ? "badge-published" : "badge-draft"}`}>{certificate.published ? "Published" : "Draft"}</span>{certificate.featured && <span className="badge badge-featured">Featured</span>}</div></td>
                <td>{reorderControls(certificate)}</td>
                <td>{formatDate(certificate.updatedAt, { dateStyle: "medium" })}</td>
                <td><CertificateActions certificate={certificate} onView={setSelected} onToggle={toggle} onDelete={setRemove} /></td>
              </tr>
            ))}</tbody></table>
          </div>
          <div className="certificate-mobile-list">{visible.map((certificate) => (
            <article className="certificate-admin-card" key={certificate.databaseId} aria-busy={busyId === certificate.databaseId}>
              <div className="certificate-admin-card-head">{certificate.imageUrl ? <img src={certificate.imageUrl} alt="" /> : <span><Award size={22} aria-hidden="true" /></span>}<div><h2>{certificate.title}</h2><p>{certificate.issuer}</p></div></div>
              <dl><div><dt>Category</dt><dd>{certificate.category}</dd></div><div><dt>Issued</dt><dd>{formatDate(certificate.issueDate)}</dd></div><div><dt>Status</dt><dd><span className={`badge ${certificate.published ? "badge-published" : "badge-draft"}`}>{certificate.published ? "Published" : "Draft"}</span>{certificate.featured && <span className="badge badge-featured ml-2">Featured</span>}</dd></div><div><dt>Display order</dt><dd>{reorderControls(certificate)}</dd></div><div><dt>Updated</dt><dd>{formatDate(certificate.updatedAt, { dateStyle: "medium" })}</dd></div></dl>
              <CertificateActions certificate={certificate} onView={setSelected} onToggle={toggle} onDelete={setRemove} />
            </article>
          ))}</div>
        </div>
      )}

      <CertificateViewer certificate={selected} onClose={() => setSelected(null)} />
      <Modal open={Boolean(remove)} title="Delete certificate?" onClose={() => setRemove(null)} actions={<><button className="btn-secondary" type="button" onClick={() => setRemove(null)}>Cancel</button><button className="btn-danger" type="button" disabled={Boolean(busyId)} onClick={confirmDelete}>{busyId ? "Deleting…" : "Delete certificate"}</button></>}><p>This permanently removes <strong>{remove?.title}</strong> and attempts to delete its certificate image and PDF from storage. This action cannot be undone.</p></Modal>
    </>
  );
}
