import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { NAV_LINKS } from "../../constants/theme";
import { getSectionId, scrollToSection } from "../../utils/scrollTo";
import { useActiveSection } from "../../hooks/useActiveSection";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";
  const activeSection = useActiveSection(isHomePage);
  const [clickedSection, setClickedSection] = useState(null);
  const currentSection =
    clickedSection ||
    (location.pathname.startsWith("/projects")
      ? "projects"
      : isHomePage
        ? activeSection
        : null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isHomePage || !location.hash) return undefined;

    const sectionId = decodeURIComponent(location.hash.replace("#", ""));
    const isKnownSection = NAV_LINKS.map(getSectionId).includes(sectionId);
    if (!isKnownSection) return undefined;

    setClickedSection(sectionId);

    const scrollId = window.setTimeout(() => {
      scrollToSection(sectionId);
    }, 0);

    return () => window.clearTimeout(scrollId);
  }, [isHomePage, location.hash]);

  useEffect(() => {
    if (!clickedSection) return undefined;

    if (activeSection === clickedSection) {
      setClickedSection(null);
      return undefined;
    }

    const clearId = window.setTimeout(() => {
      setClickedSection((section) =>
        section === clickedSection ? null : section
      );
    }, 1200);

    return () => window.clearTimeout(clearId);
  }, [activeSection, clickedSection]);

  const handleNav = (link) => {
    const sectionId = getSectionId(link);
    const hash = `#${sectionId}`;

    setClickedSection(sectionId);
    setMenuOpen(false);

    if (!isHomePage) {
      navigate({ pathname: "/", hash });
      return;
    }

    if (location.hash !== hash) {
      navigate({ pathname: "/", hash });
    }

    window.requestAnimationFrame(() => scrollToSection(sectionId));
  };

  return (
    <>
      <nav
        className={`site-nav ${scrolled ? "site-nav-scrolled" : ""}`}
      >
        <div className="section-container flex items-center justify-between h-[68px]">
          {/* Logo */}
          <Link
            to="/#home"
            className="brand-logo"
            onClick={(event) => {
              event.preventDefault();
              handleNav("Home");
            }}
          >
            WG<span className="brand-dot">.DEV</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                type="button"
                onClick={() => handleNav(link)}
                aria-current={
                  currentSection === getSectionId(link) ? "location" : undefined
                }
                className={`nav-link ${
                  currentSection === getSectionId(link) ? "nav-link-active" : ""
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
