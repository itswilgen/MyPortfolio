import { useEffect, useState } from "react";
import { NAV_LINKS } from "../constants/theme";

/**
 * Tracks which portfolio section is currently in the viewport.
 * Returns the active section id string (e.g. "about").
 */
export function useActiveSection() {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const sectionIds = NAV_LINKS.map((n) => n.toLowerCase());

    const observers = sectionIds.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { threshold: 0.4, rootMargin: "-80px 0px 0px 0px" }
      );

      observer.observe(el);
      return observer;
    });

    return () => {
      observers.forEach((obs) => obs && obs.disconnect());
    };
  }, []);

  return activeSection;
}
