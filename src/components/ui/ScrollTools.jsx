import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

const getScrollProgress = () => {
  if (typeof document === "undefined") return 0;
  const scrollHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  if (scrollHeight <= 0) return 0;
  return Math.min(100, (window.scrollY / scrollHeight) * 100);
};

export default function ScrollTools() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frameId = null;

    const updateScrollState = () => {
      setProgress(getScrollProgress());
      setVisible(window.scrollY > 380);
      frameId = null;
    };

    const requestUpdate = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(updateScrollState);
    };

    updateScrollState();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  const circumference = 2 * Math.PI * 21;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <>
      {/* Top scroll glowing progress bar */}
      <div className="scroll-progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      {/* Floating circular progress button */}
      <button
        type="button"
        className={`back-to-top ${visible ? "back-to-top-visible" : ""}`}
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
              .matches
              ? "auto"
              : "smooth",
          })
        }
        aria-label="Back to top"
        title="Back to top"
      >
        <svg
          className="scroll-ring w-12 h-12"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <circle
            cx="24"
            cy="24"
            r="21"
            className="text-line/40 stroke-current"
            strokeWidth="2.5"
            fill="none"
          />
          <circle
            cx="24"
            cy="24"
            r="21"
            className="scroll-ring-circle text-cyan-500 dark:text-cyan-400 stroke-current"
            strokeWidth="2.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
          />
        </svg>
        <ArrowUp size={18} aria-hidden="true" className="relative z-10" />
      </button>
    </>
  );
}
