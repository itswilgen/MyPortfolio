import { useEffect, useState } from "react";
import { NAV_LINKS } from "../constants/theme";
import { getSectionId } from "../utils/scrollTo";

/**
 * Tracks which portfolio section is currently in the viewport.
 * Returns the active section id string (e.g. "about").
 */
export function useActiveSection(enabled = true) {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    if (!enabled) return undefined;

    const sectionIds = NAV_LINKS.map(getSectionId);
    let frameId = null;

    const updateActiveSection = () => {
      const marker = window.scrollY + 120 + window.innerHeight * 0.28;
      let nextSection = sectionIds[0];

      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= marker) {
          nextSection = id;
        }
      });

      setActiveSection(nextSection);
    };

    const requestUpdate = () => {
      if (frameId !== null) return;

      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        updateActiveSection();
      });
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [enabled]);

  return activeSection;
}
