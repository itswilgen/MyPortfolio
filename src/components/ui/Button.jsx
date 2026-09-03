/**
 * Generic button component.
 * variant: "primary" | "outline" | "ghost"
 */
export default function Button({
  children,
  variant = "primary",
  onClick,
  href,
  className = "",
  ...props
}) {
  const base = "inline-flex items-center justify-center gap-2 font-semibold transition-colors duration-200 cursor-pointer";

  const variants = {
    primary: "btn-primary",
    outline: "btn-secondary",
    ghost: "btn-ghost",
  };

  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={classes} {...props}>
      {children}
    </button>
  );
}
