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
  const base = "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 cursor-pointer rounded-xl";

  const variants = {
    primary: "btn-primary",
    outline: "btn-outline",
    ghost: "bg-transparent text-white/60 hover:text-white px-4 py-2 text-sm",
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
