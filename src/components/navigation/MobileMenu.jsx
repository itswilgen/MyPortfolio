import { NAV_LINKS } from "../../constants/theme";
import { getSectionId } from "../../utils/scrollTo";

export default function MobileMenu({ open, onClose, onNav, activeSection }) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Slide-in panel */}
      <div
        className={`mobile-nav-panel ${
          open ? "mobile-nav-panel-open" : ""
        }`}
      >
        {NAV_LINKS.map((link) => (
          <button
            key={link}
            type="button"
            onClick={() => onNav(link)}
            aria-current={
              activeSection === getSectionId(link) ? "location" : undefined
            }
            className={`border-l-2 text-left py-3 px-4 rounded-lg text-sm font-semibold transition-colors duration-200
                        ${
                          activeSection === getSectionId(link)
                            ? "border-accent text-accent bg-accent/10"
                            : "border-transparent text-white/70 hover:text-white hover:bg-white/5"
                        }`}
          >
            {link}
          </button>
        ))}

        <div className="mt-6 pt-6 border-t border-white/10">
          <a
            href="mailto:wilgen@example.com"
            className="btn-primary block text-center text-sm"
          >
            Hire Me
          </a>
        </div>
      </div>
    </>
  );
}
