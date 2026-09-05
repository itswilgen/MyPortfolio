import {
  ArrowRight,
  BriefcaseBusiness,
  Code2,
  Download,
  Layers,
  Mail,
  Sparkles,
} from "lucide-react";
import { useRef } from "react";
import { useSiteData } from "../../contexts/SiteDataContext";
import { DEFAULT_PROFILE } from "../../data/profile";
import { scrollToSection } from "../../utils/scrollTo";

export default function Hero() {
  const { profile } = useSiteData();
  const content = profile || DEFAULT_PROFILE;
  const portraitRef = useRef(null);

  const handlePortraitMove = (event) => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)")
        .matches
    )
      return;
    const frame = portraitRef.current;
    if (!frame) return;
    const bounds = frame.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    frame.style.setProperty("--portrait-rotate-x", `${(0.5 - y) * 4.5}deg`);
    frame.style.setProperty("--portrait-rotate-y", `${(x - 0.5) * 4.5}deg`);
    frame.style.setProperty("--portrait-light-x", `${x * 100}%`);
    frame.style.setProperty("--portrait-light-y", `${y * 100}%`);
  };

  const resetPortrait = () => {
    const frame = portraitRef.current;
    if (!frame) return;
    frame.style.setProperty("--portrait-rotate-x", "0deg");
    frame.style.setProperty("--portrait-rotate-y", "0deg");
    frame.style.setProperty("--portrait-light-x", "72%");
    frame.style.setProperty("--portrait-light-y", "18%");
  };

  return (
    <section id="home" className="hero">
      <div className="section-container hero-grid">
        <div className="hero-content">
          <p className="eyebrow">
            <span className="text-gradient-shimmer">Full-Stack Developer</span>
          </p>
          <h1>
            Building useful digital products with{" "}
            <span className="text-gradient-shimmer">clarity.</span>
          </h1>
          <p className="hero-copy">
            Hi, I’m {content.name}. {content.heroIntro}
          </p>
          <div className="hero-actions">
            <button
              type="button"
              className="btn-primary"
              onClick={() => scrollToSection("projects")}
            >
              View my work <ArrowRight size={17} />
            </button>
            <a className="btn-secondary" href={`mailto:${content.email}`}>
              <Mail size={17} /> Contact me
            </a>
            {content.resumeUrl && (
              <a
                className="btn-ghost"
                href={content.resumeUrl}
                target="_blank"
                rel="noreferrer"
              >
                <Download size={17} /> Résumé
              </a>
            )}
          </div>
          <div className="hero-socials" aria-label="Social links">
            {content.socialLinks.github && (
              <a
                href={content.socialLinks.github}
                target="_blank"
                rel="noreferrer"
              >
                <Code2 size={18} /> GitHub
              </a>
            )}
            {content.socialLinks.linkedin && (
              <a
                href={content.socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                <BriefcaseBusiness size={18} /> LinkedIn
              </a>
            )}
          </div>
          {content.heroStats?.length > 0 && (
            <dl className="hero-stats">
              {content.heroStats.map((stat) => (
                <div className="hero-stat" key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </dl>
          )}
        </div>
        <div className="portrait-wrap hero-portrait">
          {/* Floating interactive badges */}
          <div
            className="hero-floating-badge hero-badge-top"
            aria-hidden="true"
          >
            <Layers size={15} className="text-cyan-500 dark:text-cyan-400" />
            <span>Full-Stack Web Dev</span>
          </div>
          <div
            className="hero-floating-badge hero-badge-bottom"
            aria-hidden="true"
          >
            <Sparkles
              size={15}
              className="text-amber-500 dark:text-amber-400"
            />
            <span>UI/UX & Product Design</span>
          </div>

          <div
            className="portrait-frame portrait-frame-interactive"
            ref={portraitRef}
            onPointerMove={handlePortraitMove}
            onPointerLeave={resetPortrait}
          >
            <img
              className="portrait-image"
              src={content.profileImageUrl}
              alt={`Portrait of ${content.name}`}
            />
            <span className="portrait-light" aria-hidden="true" />
            {content.availability && (
              <div className="portrait-caption">
                <span className="truncate">{content.availability}</span>
                <div
                  className="status-beacon-wrap"
                  aria-label="Active status indicator"
                >
                  <span className="status-beacon-ring" aria-hidden="true" />
                  <span className="status-beacon-dot" aria-hidden="true" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
