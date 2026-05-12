import { STATS } from "../../data/experiences";
import { COLORS } from "../../constants/theme";
import { useInView } from "../../hooks/useInView";

export default function Stats() {
  const [ref, inView] = useInView(0.2);

  return (
    <div ref={ref} className="section-container py-0 pb-16">
      <div
        className="grid grid-cols-2 md:grid-cols-4 overflow-hidden rounded-2xl border"
        style={{ borderColor: "rgba(0,212,255,0.12)", gap: "1px", background: "rgba(0,212,255,0.08)" }}
      >
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className="flex flex-col items-center justify-center py-7 px-6 text-center"
            style={{ background: "rgba(0,31,63,0.85)" }}
          >
            <span
              className="font-display text-4xl font-extrabold transition-all duration-700"
              style={{
                color: inView ? COLORS.accent : "transparent",
                transitionDelay: `${i * 120}ms`,
              }}
            >
              {stat.value}
            </span>
            <span
              className="text-xs font-medium mt-1.5"
              style={{ color: "rgba(232,244,253,0.45)" }}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
