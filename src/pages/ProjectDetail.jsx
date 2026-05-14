import { useParams, Link } from "react-router-dom";
import { projectController } from "../controllers/ProjectController";
import Badge from "../components/ui/Badge";
import { COLORS } from "../constants/theme";

export default function ProjectDetail() {
  const { id } = useParams();
  const project = projectController.getProjectById(id);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="font-display text-4xl font-extrabold text-white">
          Project not found
        </h1>
        <Link to="/" className="btn-primary">
          ← Back Home
        </Link>
      </div>
    );
  }

  const {
    title,
    subtitle,
    longDescription,
    tags,
    icon,
    color,
    status,
    github,
  } = project;
  const stackEntries = project.getStackEntries();

  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="section-container">
        <div className="mx-auto w-full max-w-[1440px]">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
            <div className="flex items-center gap-4">
              {project.hasIcon() && <span className="text-5xl">{icon}</span>}
              <div>
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                  {title}
                </h1>
                <p className="text-sm font-semibold mt-1" style={{ color }}>
                  {subtitle}
                </p>
              </div>
            </div>
            <span
              className="text-[11px] font-bold tracking-wider px-3 py-1.5 rounded-md uppercase mt-2"
              style={{
                background: `${color}18`,
                color,
                border: `1px solid ${color}33`,
              }}
            >
              {status}
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {tags.map((tag) => (
              <Badge key={tag} color={color}>
                {tag}
              </Badge>
            ))}
          </div>

          {/* Description */}
          <div
            className="glass-card p-6 md:p-8 mb-10 text-[15px] md:text-base leading-[1.9]"
            style={{
              color: "rgba(232,244,253,0.7)",
              borderColor: `${color}22`,
            }}
          >
            {longDescription}
          </div>

          {/* Features */}
          {project.hasFeatures() && (
            <div className="mb-10">
              <h2 className="font-display text-xl font-bold text-white mb-4">
                Key Features
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3">
                {project.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm"
                    style={{ color: "rgba(232,244,253,0.65)" }}
                  >
                    <span
                      style={{ color: COLORS.accent }}
                      className="mt-0.5 flex-shrink-0"
                    >
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech stack */}
          <div className="mb-8">
            <h2 className="font-display text-xl font-bold text-white mb-4">
              Tech Stack
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {stackEntries.map(([layer, techs]) => (
                <div key={layer} className="glass-card p-4">
                  <div
                    className="text-[11px] font-bold uppercase tracking-widest mb-3"
                    style={{ color: "rgba(232,244,253,0.35)" }}
                  >
                    {layer}
                  </div>
                  <ul className="flex flex-col gap-1">
                    {techs.map((tech) => (
                      <li
                        key={tech}
                        className="text-sm font-medium"
                        style={{ color: "rgba(232,244,253,0.8)" }}
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-4">
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
              >
                View on GitHub
              </a>
            )}
            <Link to="/" className="btn-outline">
              Back to Portfolio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
