import { NAV_LINKS } from "../../constants/theme";

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
            onClick={() => onNav(link)}
            className={`text-left py-3 px-4 rounded-lg text-sm font-semibold transition-colors duration-200
                        ${
                          activeSection === link.toLowerCase()
                            ? "text-accent bg-accent/10"
                            : "text-white/70 hover:text-white hover:bg-white/5"
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
