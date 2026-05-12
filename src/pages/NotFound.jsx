import { Link } from "react-router-dom";
import { COLORS } from "../constants/theme";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center px-6">
      <div
        className="font-display font-extrabold select-none"
        style={{
          fontSize: "clamp(80px, 20vw, 160px)",
          background: `linear-gradient(135deg, ${COLORS.accent}22, ${COLORS.gold}22)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          lineHeight: 1,
        }}
      >
        404
      </div>

      <h1 className="font-display text-3xl font-extrabold text-white">
        Page not found
      </h1>

      <p style={{ color: "rgba(232,244,253,0.55)" }} className="max-w-sm text-base leading-relaxed">
        Looks like this page doesn't exist. Head back home and explore the
        portfolio.
      </p>

      <Link to="/" className="btn-primary glow-accent">
        ← Back to Home
      </Link>
    </div>
  );
}
