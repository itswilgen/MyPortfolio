/**
 * Consistent section heading used across all portfolio sections.
 * @param {string} label  - small uppercase eyebrow text (gold)
 * @param {string} title  - main heading
 * @param {string} align  - "left" | "center"
 */
export default function SectionTitle({ label, title, align = "center" }) {
  const alignClass = align === "center" ? "text-center" : "text-left";

  return (
    <div className={`mb-12 ${alignClass}`}>
      <span className="section-label">{label}</span>
      <h2 className="section-title">{title}</h2>
    </div>
  );
}
