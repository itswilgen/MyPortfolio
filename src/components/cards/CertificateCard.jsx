import { Award, CalendarDays, Download, ExternalLink } from "lucide-react";
import { useTilt } from "../../hooks/useTilt";

const formatDate = (value) =>
  new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
    month: "short",
    year: "numeric",
  });

export default function CertificateCard({
  certificate,
  onView,
  revealIndex = 0,
}) {
  const tilt = useTilt({ max: 6, scale: 1.015, perspective: 1000 });

  return (
    <article
      ref={tilt.ref}
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.onPointerLeave}
      className="certificate-card tilt-card reveal-item group"
      style={{ "--reveal-index": revealIndex }}
    >
      <span className="tilt-card-glare" aria-hidden="true" />
      <button
        type="button"
        className="certificate-preview"
        onClick={() => onView(certificate)}
        aria-label={`View ${certificate.title}`}
      >
        {certificate.imageUrl ? (
          <img
            src={certificate.imageUrl}
            alt={certificate.imageAlt}
            loading="lazy"
          />
        ) : (
          <span className="certificate-file-placeholder">
            <Award size={34} aria-hidden="true" />
            PDF certificate
          </span>
        )}
      </button>
      <div className="certificate-card-body">
        <div className="certificate-card-meta">
          <span className="badge">{certificate.category}</span>
          {certificate.featured && (
            <span className="badge badge-featured">Featured</span>
          )}
        </div>
        <h3 className="group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
          {certificate.title}
        </h3>
        <p className="certificate-issuer">{certificate.issuer}</p>
        <p className="certificate-date">
          <CalendarDays size={15} aria-hidden="true" />
          {formatDate(certificate.issueDate)}
        </p>
        {certificate.description && (
          <p className="certificate-description">{certificate.description}</p>
        )}
        {certificate.skills?.length > 0 && (
          <div
            className="tag-list"
            aria-label={`${certificate.title} related skills`}
          >
            {certificate.skills.slice(0, 4).map((skill) => (
              <span
                className="tag transition-colors hover:border-cyan-500/50"
                key={skill}
              >
                {skill}
              </span>
            ))}
          </div>
        )}
        <div className="certificate-actions">
          <button
            type="button"
            className="text-link"
            onClick={() => onView(certificate)}
          >
            View certificate
          </button>
          {certificate.verificationUrl && (
            <a
              className="text-link"
              href={certificate.verificationUrl}
              target="_blank"
              rel="noreferrer"
            >
              Verify <ExternalLink size={15} aria-hidden="true" />
            </a>
          )}
          {certificate.allowDownload && certificate.pdfUrl && (
            <a
              className="text-link"
              href={certificate.pdfUrl}
              target="_blank"
              rel="noreferrer"
              download={`${certificate.slug}.pdf`}
            >
              <Download size={15} aria-hidden="true" /> Download
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
