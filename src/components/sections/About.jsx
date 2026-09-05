import {
  Briefcase,
  Compass,
  Download,
  GraduationCap,
  MapPin,
} from "lucide-react";
import { useSiteData } from "../../contexts/SiteDataContext";
import { DEFAULT_PROFILE } from "../../data/profile";
import { useTilt } from "../../hooks/useTilt";
import PageWrapper from "../../layouts/PageWrapper";

const factIcons = {
  "Professional title": Briefcase,
  "Current focus": Compass,
  Location: MapPin,
  Education: GraduationCap,
};

export default function About() {
  const { profile } = useSiteData();
  const content = profile || DEFAULT_PROFILE;
  const paragraphs = content.biography?.split(/\n\s*\n/).filter(Boolean) || [];
  const tilt = useTilt({ max: 5, scale: 1.015, perspective: 1000 });

  const facts = [
    ["Professional title", content.professionalTitle],
    ["Current focus", content.currentFocus],
    ["Location", content.location],
    ["Education", content.education],
  ].filter(([, value]) => value);

  return (
    <PageWrapper id="about" className="section-block">
      <div className="section-container about-grid">
        <figure
          ref={tilt.ref}
          onPointerMove={tilt.onPointerMove}
          onPointerLeave={tilt.onPointerLeave}
          className="about-photo tilt-card reveal-item group relative overflow-hidden"
          style={{ "--reveal-index": 0 }}
        >
          <span className="tilt-card-glare" aria-hidden="true" />
          <img
            src={content.aboutImageUrl || content.profileImageUrl}
            alt={`Portrait of ${content.name}`}
            loading="lazy"
            className="transition-transform duration-700 group-hover:scale-105"
          />
        </figure>
        <div className="reveal-item" style={{ "--reveal-index": 1 }}>
          <span className="section-kicker">About me</span>
          <h2 className="section-heading">
            A practical builder with a designer’s eye.
          </h2>
          <div className="prose-copy mt-6">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <dl className="profile-facts mt-8">
            {facts.map(([label, value]) => {
              const Icon = factIcons[label] || Compass;
              return (
                <div className="profile-fact group/fact" key={label}>
                  <dt className="flex items-center gap-1.5">
                    <Icon
                      size={14}
                      className="text-cyan-600 dark:text-cyan-400 shrink-0"
                      aria-hidden="true"
                    />
                    <span>{label}</span>
                  </dt>
                  <dd>{value}</dd>
                </div>
              );
            })}
          </dl>
          {content.resumeUrl && (
            <a
              href={content.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary mt-6"
            >
              <Download size={17} /> Download résumé
            </a>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
