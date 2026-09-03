import { ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useSiteData } from "../../contexts/SiteDataContext";
import { DEFAULT_PROFILE } from "../../data/profile";

export default function Footer() {
  const { profile } = useSiteData();
  const content = profile || DEFAULT_PROFILE;
  return (
    <footer className="site-footer">
      <div className="section-container">
        <div className="footer-grid">
          <div><span className="brand-logo">WG<span className="brand-dot">.DEV</span></span><p className="footer-copy">{content.professionalTitle}. Building clear, accessible, and dependable experiences for the web.</p></div>
          <div className="footer-links">{content.socialLinks.github && <a href={content.socialLinks.github} target="_blank" rel="noreferrer">GitHub</a>}{content.socialLinks.linkedin && <a href={content.socialLinks.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}<a href={`mailto:${content.email}`}>Email</a><button type="button" className="inline-flex min-h-11 items-center gap-2" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Back to top <ArrowUp size={16} /></button></div>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} Wilgen Rivas. All rights reserved.</span><Link className="admin-link" to="/admin/login">Admin</Link></div>
      </div>
    </footer>
  );
}
