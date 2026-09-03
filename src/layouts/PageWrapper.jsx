export default function PageWrapper({ id, children, className = "" }) {
  return (
    <section id={id} className={className}>
      {children}
    </section>
  );
}
