import { ArrowRight, BriefcaseBusiness, Code2, Download, Mail } from "lucide-react";
import { useSiteData } from "../../contexts/SiteDataContext";
import { DEFAULT_PROFILE } from "../../data/profile";
import { scrollToSection } from "../../utils/scrollTo";

export default function Hero() {
  const { profile } = useSiteData();
  const content = profile || DEFAULT_PROFILE;
  return (
    <section id="home" className="hero">
      <div className="section-container hero-grid">
        <div>
          <p className="eyebrow">Full-Stack Developer</p>
          <h1>Building useful digital products with <span>clarity.</span></h1>
          <p className="hero-copy">Hi, I’m {content.name}. {content.heroIntro}</p>
          <div className="hero-actions">
            <button type="button" className="btn-primary" onClick={() => scrollToSection("projects")}>
              View my work <ArrowRight size={17} />
            </button>
            <a className="btn-secondary" href={`mailto:${content.email}`}><Mail size={17} /> Contact me</a>
            {content.resumeUrl && <a className="btn-ghost" href={content.resumeUrl} target="_blank" rel="noreferrer"><Download size={17} /> Résumé</a>}
          </div>
          <div className="hero-socials" aria-label="Social links">
            {content.socialLinks.github && <a href={content.socialLinks.github} target="_blank" rel="noreferrer"><Code2 size={18} /> GitHub</a>}
            {content.socialLinks.linkedin && <a href={content.socialLinks.linkedin} target="_blank" rel="noreferrer"><BriefcaseBusiness size={18} /> LinkedIn</a>}
          </div>
          {content.heroStats?.length > 0 && (
            <dl className="hero-stats">
              {content.heroStats.map((stat) => <div className="hero-stat" key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}
            </dl>
          )}
        </div>
        <div className="portrait-wrap">
          <div className="portrait-frame">
            <img className="portrait-image" src={content.profileImageUrl} alt={`Portrait of ${content.name}`} />
            {content.availability && <div className="portrait-caption"><span>{content.availability}</span><span className="availability-dot" aria-hidden="true" /></div>}
          </div>
        </div>
      </div>
    </section>
  );
}
