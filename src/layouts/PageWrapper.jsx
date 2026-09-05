import { useInView } from "../hooks/useInView";

export default function PageWrapper({ id, children, className = "" }) {
  const [sectionRef, isVisible] = useInView(0.08);

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`reveal-section ${isVisible ? "is-visible" : ""} ${className}`}
    >
      {children}
    </section>
  );
}
