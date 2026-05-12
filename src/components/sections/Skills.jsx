import { useState } from "react";
import PageWrapper from "../../layouts/PageWrapper";
import SectionTitle from "../ui/SectionTitle";
import SkillCard from "../cards/SkillCard";
import { SKILLS, SKILL_TABS } from "../../data/skills";
import { COLORS } from "../../constants/theme";
import { useInView } from "../../hooks/useInView";

export default function Skills() {
  const [activeTab, setActiveTab] = useState(SKILL_TABS[0]);
  const [barsRef, barsInView] = useInView(0.2);

  return (
    <PageWrapper
      id="skills"
      className="py-24"
      style={{ background: "rgba(0,212,255,0.015)" }}
    >
      <div className="section-container">
        <SectionTitle label="Technical Skills" title="What I work with" />

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {SKILL_TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-5 py-2 rounded-lg text-sm font-bold tracking-wide transition-all duration-200"
                style={{
                  background: isActive ? COLORS.accent : "rgba(255,255,255,0.05)",
                  color: isActive ? COLORS.navy : "rgba(232,244,253,0.6)",
                  border: isActive
                    ? "none"
                    : "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Skill cards grid */}
        <div
          ref={barsRef}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {SKILLS[activeTab].map((skill) => (
            <SkillCard key={skill.name} skill={skill} inView={barsInView} />
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
