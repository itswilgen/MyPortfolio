import AnimatedBar from "../ui/AnimatedBar";
import { COLORS } from "../../constants/theme";

const getLogoInitials = (label) =>
  label
    .split(/\s|\.|-/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

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
                  className={`skill-logo-image ${
                    logo.label === "MariaDB" ? "skill-logo-image--mariadb" : ""
                  }`}
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.hidden = true;
                    event.currentTarget.nextElementSibling.hidden = false;
                  }}
                />
                <span className="skill-logo-fallback" hidden>
                  {getLogoInitials(logo.label)}
                </span>
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
