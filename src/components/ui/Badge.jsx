/**
 * Small pill badge for tags and statuses.
 * @param {string} color - hex color (used for text and border tint)
 */
export default function Badge({ children, color = "#00d4ff", className = "" }) {
  return (
    <span
      className={`inline-block text-[11px] font-semibold tracking-wide px-2.5 py-0.5 rounded-full border ${className}`}
      style={{
        color: color,
        borderColor: `${color}44`,
        background: `${color}12`,
      }}
    >
      {children}
    </span>
  );
}
