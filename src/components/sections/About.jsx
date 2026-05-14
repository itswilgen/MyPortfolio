import PageWrapper from "../../layouts/PageWrapper";
import SectionTitle from "../ui/SectionTitle";
import { COLORS, SOCIAL_LINKS } from "../../constants/theme";
import aboutPhoto from "../images/profile 2.png";

export default function About() {
  return (
    <PageWrapper id="about" className="py-24 lg:min-h-screen lg:flex lg:items-center">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(280px,420px)_1fr] gap-12 lg:gap-20 items-center">
          {/* About photo */}
          <div className="order-2 lg:order-1 w-full max-w-[340px] justify-self-center lg:max-w-[420px]">
            <div className="portrait-motion portrait-motion--about mx-auto">
              <div className="portrait-frame">
                <img
                  src={aboutPhoto}
                  alt="Wilgen"
                  className="portrait-image h-[460px] sm:h-[540px] lg:h-[620px]"
                />
                <div
                  className="portrait-vignette"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(0,31,63,0) 58%, rgba(0,31,63,0.5) 100%)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Copy */}
          <div className="order-1 lg:order-2 max-w-3xl">
            <SectionTitle
              label="About Me"
              title={
                <>
                  Turning ideas into{" "}
                  <span style={{ color: COLORS.accent }}>scalable reality</span>
                </>
              }
              align="left"
            />

            <p
              className="text-[15px] leading-[1.85] mb-4"
              style={{ color: "rgba(232,244,253,0.65)" }}
            >
              I'm a self-driven full-stack developer based in{" "}
              <strong style={{ color: COLORS.accent }}>
                Tanjay City, Philippines
              </strong>
              , passionate about building modern, scalable, and user-focused web
              applications using Laravel, React, JavaScript, Node.js, and modern
              database technologies.
            </p>
            <p
              className="text-[15px] leading-[1.85] mb-4"
              style={{ color: "rgba(232,244,253,0.65)" }}
            >
              Currently pursuing a{" "}
              <strong className="text-white">
                Bachelor of Science in Information Technology (BSIT)
              </strong>{" "}
              at Negros Oriental State University – Bais Campus, where I
              continuously enhance my skills in full-stack web development,
              software engineering, database management, and modern application
              design.
            </p>
            <p
              className="text-[15px] leading-[1.85] mb-8"
              style={{ color: "rgba(232,244,253,0.65)" }}
            >
              Beyond web development, I have a strong passion for{" "}
              <strong style={{ color: COLORS.gold }}>music and DJing</strong>,
              where creativity and rhythm influence the way I approach UI/UX
              design, problem-solving, and interactive digital experiences.
            </p>

            {/* Meta info */}
            <div className="flex flex-wrap gap-8 mb-8">
              {[
                ["Location", "Tanjay City, PH"],
                ["Focus", "Full Stack Dev"],
                ["Available", "Freelance / Projects"],
              ].map(([key, val]) => (
                <div key={key}>
                  <div
                    className="text-[11px] font-bold uppercase tracking-widest mb-1"
                    style={{ color: "rgba(232,244,253,0.35)" }}
                  >
                    {key}
                  </div>
                  <div className="text-sm font-semibold text-white">{val}</div>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div className="flex gap-4">
              <a
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noreferrer"
                className="btn-outline text-sm py-2.5 px-5"
              >
                GitHub
              </a>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noreferrer"
                className="btn-outline text-sm py-2.5 px-5"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
