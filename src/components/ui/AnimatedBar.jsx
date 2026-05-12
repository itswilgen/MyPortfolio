import { COLORS } from "../../constants/theme";

/**
 * Animated skill progress bar.
 * @param {number} level   - 0–100
 * @param {boolean} inView - triggers animation when true
 * @param {string} color   - bar fill color (default: accent)
 */
export default function AnimatedBar({ level, inView, color = COLORS.accent }) {
  return (
    <div
      className="h-1.5 rounded-full overflow-hidden"
      style={{ background: "rgba(255,255,255,0.08)" }}
    >
      <div
        className="h-full rounded-full transition-all duration-[1200ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          width: inView ? `${level}%` : "0%",
          background: `linear-gradient(90deg, ${color}, ${color}cc)`,
          boxShadow: `0 0 8px ${color}55`,
        }}
      />
    </div>
  );
}
