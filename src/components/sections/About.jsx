import { Download } from "lucide-react";
import { useSiteData } from "../../contexts/SiteDataContext";
import { DEFAULT_PROFILE } from "../../data/profile";
import PageWrapper from "../../layouts/PageWrapper";

export default function About() {
  const { profile } = useSiteData();
  const content = profile || DEFAULT_PROFILE;
  const paragraphs = content.biography?.split(/\n\s*\n/).filter(Boolean) || [];
  const facts = [
    ["Professional title", content.professionalTitle],
    ["Current focus", content.currentFocus],
    ["Location", content.location],
    ["Education", content.education],
  ].filter(([, value]) => value);
  return (
    <PageWrapper id="about" className="section-block">
      <div className="section-container about-grid">
        <figure className="about-photo"><img src={content.aboutImageUrl || content.profileImageUrl} alt={`Portrait of ${content.name}`} loading="lazy" /></figure>
        <div>
          <span className="section-kicker">About me</span>
          <h2 className="section-heading">A practical builder with a designer’s eye.</h2>
          <div className="prose-copy mt-6">{paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
          <dl className="profile-facts">{facts.map(([label, value]) => <div className="profile-fact" key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
          {content.resumeUrl && <a href={content.resumeUrl} target="_blank" rel="noreferrer" className="btn-secondary mt-6"><Download size={17} /> Download résumé</a>}
        </div>
      </div>
    </PageWrapper>
  );
}
