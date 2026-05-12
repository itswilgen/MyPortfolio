import { useInView } from "../hooks/useInView";

/**
 * Wraps any section and animates it in when it enters the viewport.
 * @param {string} id   - the section's HTML id attribute
 * @param {string} className - extra Tailwind classes
 */
export default function PageWrapper({ id, children, className = "" }) {
  const [ref, inView] = useInView(0.08);

  return (
    <section
      id={id}
      ref={ref}
      className={`transition-all duration-700 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
    >
      {children}
    </section>
  );
}
