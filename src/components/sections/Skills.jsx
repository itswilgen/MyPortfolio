import { SKILLS } from "../../data/skills";
import PageWrapper from "../../layouts/PageWrapper";

const displayNames = { Database: "Databases", Tools: "Tools & Platforms" };

export default function Skills() {
  return (
    <PageWrapper id="skills" className="section-block">
      <div className="section-container">
        <div className="section-heading-row">
          <div><span className="section-kicker">Capabilities</span><h2 className="section-heading">Tools chosen for the problem.</h2></div>
          <p className="section-intro">A focused full-stack toolkit spanning interface design, application logic, data, and dependable delivery.</p>
        </div>
        <div className="skill-groups">
          {Object.entries(SKILLS).map(([group, skills]) => (
            <section className="skill-group" key={group} aria-labelledby={`skills-${group.toLowerCase()}`}>
              <h3 id={`skills-${group.toLowerCase()}`}>{displayNames[group] || group}</h3>
              <div className="skill-list">{skills.map((skill) => <span className="skill-chip" key={skill.name}>{skill.name}</span>)}</div>
            </section>
          ))}
          <section className="skill-group" aria-labelledby="skills-design">
            <h3 id="skills-design">UI/UX & Design</h3>
            <div className="skill-list"><span className="skill-chip">Figma</span><span className="skill-chip">Responsive design</span><span className="skill-chip">Accessibility</span><span className="skill-chip">Interface systems</span></div>
          </section>
        </div>
      </div>
    </PageWrapper>
  );
}
