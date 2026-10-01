import { Moon, Sun } from "lucide-react";
import { flushSync } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";

export default function ThemeToggle({ compact = false }) {
  const { theme, setTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimer = useRef(null);
  const isDark = theme === "dark" || (
    theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const Icon = isDark ? Sun : Moon;
  const nextTheme = isDark ? "light" : "dark";

  useEffect(() => () => window.clearTimeout(animationTimer.current), []);

  const toggleTheme = (event) => {
    const root = document.documentElement;
    const bounds = event.currentTarget.getBoundingClientRect();
    root.style.setProperty("--theme-origin-x", `${bounds.left + bounds.width / 2}px`);
    root.style.setProperty("--theme-origin-y", `${bounds.top + bounds.height / 2}px`);

    setIsAnimating(true);
    window.clearTimeout(animationTimer.current);
    animationTimer.current = window.setTimeout(() => setIsAnimating(false), 560);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (document.startViewTransition && !reducedMotion) {
      document.startViewTransition(() => flushSync(() => setTheme(nextTheme)));
      return;
    }

    setTheme(nextTheme);
  };

  return (
    <button
      type="button"
      className={`icon-button theme-toggle${isAnimating ? " is-changing" : ""}`}
      aria-label={`Switch to ${nextTheme} mode`}
      aria-pressed={isDark}
      title={`Switch to ${nextTheme} mode`}
      onClick={toggleTheme}
    >
      <Icon className="theme-toggle-icon" size={18} aria-hidden="true" />
      {!compact && <span className="sr-only">Switch to {nextTheme} mode</span>}
    </button>
  );
}
