import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { NAV_LINKS, SOCIAL_LINKS } from "../../constants/theme";
import { getSectionId } from "../../utils/scrollTo";
import ThemeToggle from "../ui/ThemeToggle";

export default function MobileMenu({ open, onClose, onNav, activeSection }) {
  const panelRef = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement;
    panelRef.current?.focus();
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeAtDesktop = (event) => { if (event.matches) onClose(); };
    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;
      const focusable = panelRef.current?.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", handleKey);
    desktop.addEventListener("change", closeAtDesktop);
    return () => {
      document.removeEventListener("keydown", handleKey);
      desktop.removeEventListener("change", closeAtDesktop);
      previous?.focus();
    };
  }, [onClose, open]);
  if (!open) return null;
  return createPortal(
    <>
      <button type="button" className="mobile-menu-backdrop" onClick={onClose} aria-label="Close navigation menu" />
      <aside className="mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation menu" ref={panelRef} tabIndex={-1}>
        <div className="mobile-menu-header">
          <span className="brand-logo">WG<span className="brand-dot">.DEV</span></span>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close menu"><X size={20} /></button>
        </div>
        <nav className="mobile-menu-links">
          {NAV_LINKS.map((link) => (
            <button key={link} type="button" onClick={() => onNav(link)} className={`nav-link ${activeSection === getSectionId(link) ? "nav-link-active" : ""}`} aria-current={activeSection === getSectionId(link) ? "location" : undefined}>{link}</button>
          ))}
        </nav>
        <div className="mobile-menu-footer">
          <div className="flex items-center justify-between text-sm font-semibold"><span>Appearance</span><ThemeToggle compact /></div>
          <a href={`mailto:${SOCIAL_LINKS.email}`} className="btn-primary">Hire Me</a>
        </div>
      </aside>
    </>,
    document.body
  );
}
