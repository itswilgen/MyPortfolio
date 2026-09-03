import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";

const options = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export default function ThemeToggle({ compact = false }) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const active = options.find((item) => item.value === theme) || options[2];
  const ActiveIcon = active.icon;

  useEffect(() => {
    const close = (event) => {
      if (!wrapperRef.current?.contains(event.target)) setOpen(false);
    };
    const escape = (event) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", close); document.removeEventListener("keydown", escape); };
  }, []);

  return (
    <div className="theme-picker" ref={wrapperRef}>
      <button
        type="button"
        className="icon-button"
        aria-label={`Theme: ${active.label}. Choose theme`}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        <ActiveIcon size={18} aria-hidden="true" />
        {!compact && <span className="sr-only">Choose theme</span>}
      </button>
      {open && (
        <div className="theme-menu" role="menu" aria-label="Theme options">
          {options.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              role="menuitemradio"
              aria-checked={theme === value}
              className={theme === value ? "is-active" : ""}
              onClick={() => { setTheme(value); setOpen(false); }}
            >
              <Icon size={16} aria-hidden="true" /> {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
