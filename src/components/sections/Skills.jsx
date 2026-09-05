import {
  Code2,
  Database,
  Layout,
  Server,
  Sparkles,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { SKILLS } from "../../data/skills";
import PageWrapper from "../../layouts/PageWrapper";

const categoryIcons = {
  All: Sparkles,
  Frontend: Layout,
  Backend: Server,
  Database: Database,
  Tools: Wrench,
  "UI/UX": Code2,
};

const displayNames = {
  All: "All Skills",
  Frontend: "Frontend",
  Backend: "Backend",
  Database: "Databases",
  Tools: "Tools & DevOps",
  "UI/UX": "UI/UX Design",
};

const UI_UX_SKILLS = [
  {
    name: "Figma & Prototyping",
    level: 88,
    category: "UI/UX",
    logos: [
      {
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg",
        label: "Figma",
      },
    ],
  },
  {
    name: "Responsive & Mobile-First",
    level: 94,
    category: "UI/UX",
    logos: [
      {
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
        label: "HTML5",
      },
    ],
  },
  {
    name: "Design Systems & Tailwind",
    level: 90,
    category: "UI/UX",
    logos: [
      {
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
        label: "Tailwind",
      },
    ],
  },
  {
    name: "Web Accessibility (a11y)",
    level: 85,
    category: "UI/UX",
    logos: [
      {
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/chrome/chrome-original.svg",
        label: "Web Standards",
      },
    ],
  },
];

export default function Skills() {
  const [activeTab, setActiveTab] = useState("All");

  const allSkillsList = [
    ...Object.entries(SKILLS).flatMap(([group, items]) =>
      items.map((item) => ({ ...item, category: group })),
    ),
    ...UI_UX_SKILLS,
  ];

  const displayedSkills =
    activeTab === "All"
      ? allSkillsList
      : allSkillsList.filter((item) => item.category === activeTab);

  const tabs = ["All", ...Object.keys(SKILLS), "UI/UX"];

  return (
    <PageWrapper id="skills" className="section-block">
      <div className="section-container">
        <div
          className="section-heading-row reveal-item"
          style={{ "--reveal-index": 0 }}
        >
          <div>
            <span className="section-kicker">Capabilities & Stack</span>
            <h2 className="section-heading">Engineered with precision.</h2>
          </div>
          <p className="section-intro">
            A comprehensive, battle-tested full-stack toolkit spanning interface
            architecture, responsive design, backend microservices, and reliable
            cloud deployments.
          </p>
        </div>

        {/* Filter Tabs */}
        <div
          className="skills-tab-bar reveal-item"
          style={{ "--reveal-index": 1 }}
          role="tablist"
          aria-label="Skills categories"
        >
          {tabs.map((tab) => {
            const Icon = categoryIcons[tab] || Code2;
            const isSelected = activeTab === tab;
            return (
              <button
                type="button"
                role="tab"
                key={tab}
                aria-selected={isSelected}
                className={`skills-tab-btn ${isSelected ? "is-active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                <Icon size={16} aria-hidden="true" />
                <span>{displayNames[tab] || tab}</span>
              </button>
            );
          })}
        </div>

        {/* Modern Skills Grid */}
        <div className="skills-modern-grid">
          {displayedSkills.map((skill, index) => {
            const logo = skill.logos?.[0];
            return (
              <div
                key={skill.name}
                className="skill-card-modern reveal-item group"
                style={{ "--reveal-index": (index % 8) + 2 }}
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="skill-logo-wrap">
                      {logo?.src ? (
                        <img
                          src={logo.src}
                          alt={`${logo.label || skill.name} icon`}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <Code2 size={20} className="text-cyan-500" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display text-sm font-bold truncate text-ink">
                        {skill.name}
                      </h3>
                      <span className="text-[11px] font-semibold text-muted block truncate">
                        {displayNames[skill.category] || skill.category}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400">
                    {skill.level}%
                  </span>
                </div>

                <div className="skill-bar-track mt-auto">
                  <div
                    className="skill-bar-fill"
                    style={{ width: `${skill.level}%` }}
                    aria-valuenow={skill.level}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PageWrapper>
  );
}
