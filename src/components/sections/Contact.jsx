import { ArrowUpRight, BriefcaseBusiness, Code2, Mail, UsersRound } from "lucide-react";
import { useSiteData } from "../../contexts/SiteDataContext";
import { DEFAULT_PROFILE } from "../../data/profile";
import PageWrapper from "../../layouts/PageWrapper";

export default function Contact() {
  const { profile } = useSiteData();
  const content = profile || DEFAULT_PROFILE;
  const links = [
    ["GitHub", content.socialLinks.github, Code2],
    ["LinkedIn", content.socialLinks.linkedin, BriefcaseBusiness],
    ["Facebook", content.socialLinks.facebook, UsersRound],
  ].filter(([, href]) => href);
  return (
    <PageWrapper id="contact" className="section-block">
      <div className="section-container">
        <div className="contact-panel">
          <div className="contact-copy">
            <span className="section-kicker">Contact</span>
            <h2>Have a product, system, or interface to build?</h2>
            <p>{content.availability || "I’m open to discussing thoughtful web projects and collaborations."} Tell me what you’re working on and where you need help.</p>
            <div className="contact-actions"><a className="btn-primary" href={`mailto:${content.email}`}><Mail size={18} /> Email {content.name.split(" ")[0]}</a></div>
          </div>
          <div className="contact-links">
            <a className="contact-link" href={`mailto:${content.email}`}><span><Mail className="mr-3 inline" size={18} />{content.email}</span><ArrowUpRight size={17} /></a>
            {links.map(([label, href, Icon]) => <a className="contact-link" key={label} href={href} target="_blank" rel="noreferrer"><span><Icon className="mr-3 inline" size={18} />{label}</span><ArrowUpRight size={17} /></a>)}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
