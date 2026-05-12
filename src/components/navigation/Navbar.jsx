import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { NAV_LINKS } from "../../constants/theme";
import { scrollToSection } from "../../utils/scrollTo";
import { useActiveSection } from "../../hooks/useActiveSection";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const activeSection = useActiveSection();
  const location = useLocation();
  const navigate = useNavigate();
  const currentSection = location.pathname.startsWith("/projects")
    ? "projects"
    : activeSection;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNav = (link) => {
    const scroll = () => scrollToSection(link);

    if (location.pathname !== "/") {
      navigate("/");
      window.setTimeout(scroll, 60);
    } else {
      scroll();
    }

    setMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`site-nav ${scrolled ? "site-nav-scrolled" : ""}`}
      >
        <div className="section-container flex items-center justify-between h-[68px]">
          {/* Logo */}
          <Link
            to="/"
            className="brand-logo"
            onClick={() => handleNav("Home")}
          >
            WG<span className="brand-dot">.DEV</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                onClick={() => handleNav(link)}
                className={`nav-link ${
                  currentSection === link.toLowerCase() ? "nav-link-active" : ""
                }`}
              >
                {link}
              </button>
            ))}
            <a
              href={`mailto:wilgen@example.com`}
              className="btn-primary text-sm py-2 px-5 rounded-lg"
            >
              Hire Me
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span
              className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNav={handleNav}
        activeSection={currentSection}
      />
    </>
  );
}
