import { useEffect, useState } from "react";

const getScrollProgress = () => {
  const scrollHeight =
    document.documentElement.scrollHeight - window.innerHeight;

  if (scrollHeight <= 0) {
    return 0;
  }

  return Math.min(100, (window.scrollY / scrollHeight) * 100);
};

export default function ScrollTools() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateScrollState = () => {
      setProgress(getScrollProgress());
      setVisible(window.scrollY > 420);
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      window.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  return (
    <>
      <div className="scroll-progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      <button
        type="button"
        className={`back-to-top ${visible ? "back-to-top-visible" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
      >
        Top
      </button>
    </>
  );
}
