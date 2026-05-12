import { COLORS } from "../../constants/theme";
import { scrollToSection } from "../../utils/scrollTo";
import profilePhoto from "../images/profile 1.png";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-20 pb-16"
    >
      <div className="section-container w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Left — copy */}
          <div className="flex flex-col gap-6 max-w-2xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <div
                className="h-0.5 w-9 rounded-full"
                style={{ background: COLORS.accent }}
              />
              <span
                className="text-xs font-bold uppercase tracking-[0.1em]"
                style={{ color: COLORS.accent }}
              >
                Full Stack Developer
              </span>
            </div>

            {/* Headline */}
            <h1
              className="font-display font-extrabold leading-[1.05] tracking-tight"
              style={{ fontSize: "clamp(40px, 6vw, 72px)" }}
            >
              <span className="text-white">Hi, I'm </span>
              <span className="text-gradient">Wilgen</span>
              <br />
              <span
                className="font-bold"
                style={{
                  fontSize: "0.72em",
                  color: "rgba(232,244,253,0.65)",
                }}
              >
                I build things for the web.
              </span>
            </h1>

            {/* Sub-copy */}
            <p
              className="text-lg leading-[1.75] max-w-xl"
              style={{ color: "rgba(232,244,253,0.6)" }}
            >
              I design and develop modern full-stack applications focused on
              performance, clean architecture, and user experience. Passionate
              about transforming ideas into scalable and impactful digital
              solutions.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                className="btn-primary glow-accent"
                onClick={() => scrollToSection("projects")}
              >
                View My Work →
              </button>
              <button
                className="btn-outline"
                onClick={() => scrollToSection("contact")}
              >
                Get In Touch
              </button>
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-8 pt-4">
              {[
                ["3+", "Years Learning"],
                ["10+", "Projects Built"],
                ["15+", "Technologies"],
              ].map(([num, label]) => (
                <div key={label}>
                  <div
                    className="font-display text-2xl font-extrabold"
                    style={{ color: COLORS.accent }}
                  >
                    {num}
                  </div>
                  <div
                    className="text-xs font-medium mt-0.5"
                    style={{ color: "rgba(232,244,253,0.45)" }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — portrait */}
          <div className="w-full flex justify-center lg:flex-1">
            <div className="portrait-motion portrait-motion--hero w-full max-w-[360px] lg:max-w-[380px] xl:max-w-[430px]">
              <div className="portrait-frame">
                <img
                  src={profilePhoto}
                  alt="Wilgen"
                  className="portrait-image h-[420px] sm:h-[500px] lg:h-[560px]"
                />
                <div
                  className="portrait-vignette"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(0,31,63,0) 58%, rgba(0,31,63,0.46) 100%)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-40 animate-bounce"
      >
        <span className="text-xs font-medium text-white/60">Scroll</span>
        <div
          className="w-0.5 h-8 rounded-full"
          style={{ background: "linear-gradient(to bottom, rgba(0,212,255,0.6), transparent)" }}
        />
      </div>
    </section>
  );
}
