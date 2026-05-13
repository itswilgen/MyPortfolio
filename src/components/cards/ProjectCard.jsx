import { Link } from "react-router-dom";
import Badge from "../ui/Badge";

export default function ProjectCard({ project }) {
  const { title, subtitle, description, tags, icon, image, color, status } =
    project;
  const detailPath = project.getDetailPath();
  const previewHref = project.getPreviewHref();
  const previewLabel = project.getPreviewLabel();
  const previewAlt = project.getPreviewAlt();

  return (
    <div
      className="glass-card overflow-hidden flex flex-col group transition-all duration-300 hover:-translate-y-1.5"
      style={{
        borderColor: `${color}22`,
        "--hover-shadow": `0 20px 40px ${color}15`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${color}44`;
        e.currentTarget.style.boxShadow = `0 20px 40px ${color}15`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = `${color}22`;
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {project.hasPreviewImage() ? (
        <a
          href={previewHref}
          target="_blank"
          rel="noreferrer"
          className="relative h-52 overflow-hidden border-b border-white/10"
          aria-label={`Open ${title} demo preview`}
        >
          <img
            src={image}
            alt={previewAlt}
            className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/10 to-transparent" />
          <span
            className="absolute right-4 top-4 text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-md uppercase backdrop-blur"
            style={{
              background: `${color}22`,
              color,
              border: `1px solid ${color}44`,
            }}
          >
            {status}
          </span>
        </a>
      ) : (
        <div className="flex justify-between items-start p-7 pb-0">
          <span className="text-4xl">{icon}</span>
          <span
            className="text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-md uppercase"
            style={{
              background: `${color}18`,
              color,
              border: `1px solid ${color}33`,
            }}
          >
            {status}
          </span>
        </div>
      )}

      <div className="p-7 flex flex-col gap-5 flex-1">
        {/* Title */}
        <div>
          <h3 className="font-display text-xl font-extrabold text-white">
            {title}
          </h3>
          <p className="text-xs font-semibold mt-0.5" style={{ color }}>
            {subtitle}
          </p>
        </div>

        {/* Description */}
        <p
          className="text-sm leading-relaxed flex-1"
          style={{ color: "rgba(232,244,253,0.6)" }}
        >
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Badge key={tag} color={color}>
              {tag}
            </Badge>
          ))}
        </div>

        {/* Footer links */}
        <div className="flex gap-3 pt-1 border-t border-white/5">
          <Link
            to={detailPath}
            className="text-xs font-semibold transition-colors duration-200"
            style={{ color: `${color}bb` }}
          >
            View Details →
          </Link>
          {project.hasGithub() && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold transition-colors duration-200"
              style={{ color: "rgba(232,244,253,0.35)" }}
              onMouseEnter={(e) =>
                (e.target.style.color = "rgba(232,244,253,0.8)")
              }
              onMouseLeave={(e) =>
                (e.target.style.color = "rgba(232,244,253,0.35)")
              }
            >
              GitHub
            </a>
          )}
          {previewHref && (
            <a
              href={previewHref}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold transition-colors duration-200"
              style={{ color: "rgba(232,244,253,0.35)" }}
              onMouseEnter={(e) =>
                (e.target.style.color = "rgba(232,244,253,0.8)")
              }
              onMouseLeave={(e) =>
                (e.target.style.color = "rgba(232,244,253,0.35)")
              }
            >
              {previewLabel}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
