/**
 * Converts a nav label into the matching section id.
 *
 * @param {string} label - e.g. "About", "My Projects"
 */
export function getSectionId(label) {
  return label.toLowerCase().replace(/\s+/g, "-");
}

/**
 * Smoothly scrolls to a section by its id.
 * The id is derived from the nav label (lowercase, spaces → hyphens).
 *
 * @param {string} label - e.g. "About", "My Projects"
 * @param {number} offset - px offset from top (default 80 = navbar height)
 */
export function scrollToSection(label, offset = 80) {
  const id = getSectionId(label);
  const el = document.getElementById(id);
  if (!el) return;

  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: "smooth" });
}
