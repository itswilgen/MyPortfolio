import { COLORS, SOCIAL_LINKS } from "../../constants/theme";
import { scrollToSection } from "../../utils/scrollTo";

export default function Footer() {
  return (
    <footer
      className="relative z-10 border-t py-10 text-center"
      style={{ borderColor: "rgba(0,212,255,0.08)" }}
    >
      <div className="section-container">
        <button
          onClick={() => scrollToSection("home")}
          className="font-display font-extrabold text-2xl mb-3 block mx-auto"
          style={{
            color: COLORS.accent,
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          WG<span style={{ color: COLORS.gold }}>.DEV</span>
        </button>

        <div className="flex justify-center gap-6 mb-4">
          <a
            href={SOCIAL_LINKS.github}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium transition-colors duration-200"
            style={{ color: "rgba(232,244,253,0.45)" }}
            onMouseEnter={(e) => (e.target.style.color = COLORS.accent)}
            onMouseLeave={(e) =>
              (e.target.style.color = "rgba(232,244,253,0.45)")
            }
          >
            GitHub
          </a>
          <a
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium transition-colors duration-200"
            style={{ color: "rgba(232,244,253,0.45)" }}
            onMouseEnter={(e) => (e.target.style.color = COLORS.accent)}
            onMouseLeave={(e) =>
              (e.target.style.color = "rgba(232,244,253,0.45)")
            }
          >
            LinkedIn
          </a>
          <a
            href={`mailto:${SOCIAL_LINKS.email}`}
            className="text-sm font-medium transition-colors duration-200"
            style={{ color: "rgba(232,244,253,0.45)" }}
            onMouseEnter={(e) => (e.target.style.color = COLORS.accent)}
            onMouseLeave={(e) =>
              (e.target.style.color = "rgba(232,244,253,0.45)")
            }
          >
            Email
          </a>
        </div>

        <p className="text-xs" style={{ color: "rgba(232,244,253,0.3)" }}>
          © {new Date().getFullYear()} Wilgen Rivas · Tanjay City, Negros
          Oriental Philippines
        </p>
      </div>
    </footer>
  );
}
