import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { NAV_LINKS, SOCIAL_LINKS } from "../../constants/theme";
import { useActiveSection } from "../../hooks/useActiveSection";
import { getSectionId, scrollToSection } from "../../utils/scrollTo";
import ThemeToggle from "../ui/ThemeToggle";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const active = useActiveSection(isHome);
  const current = location.pathname.startsWith("/projects") ? "projects" : active;

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    if (!isHome || !location.hash) return;
    const id = decodeURIComponent(location.hash.slice(1));
    window.setTimeout(() => scrollToSection(id), 0);
  }, [isHome, location.hash]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleNav = (label) => {
    const id = getSectionId(label);
    setMenuOpen(false);
    if (!isHome) navigate(`/#${id}`);
    else {
      navigate({ pathname: "/", hash: id });
      window.requestAnimationFrame(() => scrollToSection(id));
    }
  };

  return (
    <header className={`site-nav ${scrolled ? "site-nav-scrolled" : ""}`}>
      <div className="nav-inner">
        <Link to="/#home" className="brand-logo" onClick={(event) => { event.preventDefault(); handleNav("Home"); }}>WG<span className="brand-dot">.DEV</span></Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {NAV_LINKS.map((link) => {
            const id = getSectionId(link);
            return <button key={link} type="button" onClick={() => handleNav(link)} className={`nav-link ${current === id ? "nav-link-active" : ""}`} aria-current={current === id ? "location" : undefined}>{link}</button>;
          })}
        </nav>
        <div className="nav-actions">
          <ThemeToggle compact />
          <a href={`mailto:${SOCIAL_LINKS.email}`} className="btn-primary hidden sm:inline-flex">Hire Me</a>
          <button type="button" className="icon-button menu-button" onClick={() => setMenuOpen(true)} aria-label="Open navigation menu" aria-expanded={menuOpen}><Menu size={20} /></button>
        </div>
      </div>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} onNav={handleNav} activeSection={current} />
    </header>
  );
}
