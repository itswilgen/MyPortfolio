import AnimatedBar from "../ui/AnimatedBar";
import { COLORS } from "../../constants/theme";

export default function SkillCard({ skill, inView }) {
  const logos = skill.logos || [];

  return (
    <div className="glass-card skill-card p-5 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3 min-w-0">
          <div className="skill-logo-stack">
            {logos.map((logo, index) => (
              <span
                key={logo.label}
                className="skill-logo-item"
                style={{
                  zIndex: logos.length - index,
                  "--logo-tilt": index % 2 === 0 ? "-4deg" : "4deg",
                }}
                title={logo.label}
              >
                <img
                  src={logo.src}
                  alt={`${logo.label} logo`}
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              </span>
            ))}
          </div>
          <span className="text-sm font-semibold text-white">{skill.name}</span>
        </div>
        <span
          className="text-sm font-bold tabular-nums"
          style={{ color: COLORS.accent }}
        >
          {skill.level}%
        </span>
      </div>
      <AnimatedBar level={skill.level} inView={inView} />
    </div>
  );
}
