import { Award, FolderKanban, Home, LogOut, Menu, ReceiptText, Settings, UserRound, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ui/ThemeToggle";
import { useAuth } from "../contexts/AuthContext";

const links = [
  ["Dashboard", "/admin", Home, true],
  ["Projects", "/admin/projects", FolderKanban],
  ["Certificates", "/admin/certificates", Award],
  ["Profile", "/admin/profile", UserRound],
  ["Payment proofs", "/admin/payment-proofs", ReceiptText],
  ["Settings", "/admin/settings", Settings],
];

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const logout = async () => { await signOut(); navigate("/admin/login", { replace: true }); };
  return (
    <div className="admin-shell">
      {open && <button className="admin-overlay" aria-label="Close admin navigation" onClick={() => setOpen(false)} />}
      <aside className={`admin-sidebar ${open ? "is-open" : ""}`}>
        <div className="admin-sidebar-header"><Link to="/admin" className="brand-logo">WG<span className="brand-dot">.DEV</span></Link><button className="icon-button lg:hidden" type="button" aria-label="Close navigation" onClick={() => setOpen(false)}><X size={19} /></button></div>
        <nav aria-label="Admin navigation">{links.map(([label, to, Icon, end]) => <NavLink end={end} key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => `admin-nav-link ${isActive ? "active" : ""}`}><Icon size={18} />{label}</NavLink>)}</nav>
        <div className="admin-sidebar-footer"><p className="truncate px-3 text-xs text-muted" title={user?.email}>{user?.email}</p><Link to="/" className="btn-ghost">View portfolio</Link><button type="button" className="btn-ghost" onClick={logout}><LogOut size={17} /> Sign out</button></div>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar"><button type="button" className="icon-button lg:hidden" onClick={() => setOpen(true)} aria-label="Open admin navigation"><Menu size={20} /></button><span className="text-sm font-bold">Portfolio CMS</span><ThemeToggle compact /></header>
        <main className="admin-content"><Outlet /></main>
      </div>
    </div>
  );
}
