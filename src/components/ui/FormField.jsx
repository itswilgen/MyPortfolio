export default function FormField({ label, htmlFor, hint, error, required, children }) {
  return (
    <div className="form-field">
      <label htmlFor={htmlFor}>{label}{required && <span aria-hidden="true"> *</span>}</label>
      {children}
      {hint && !error && <p className="field-hint">{hint}</p>}
      {error && <p className="field-error" id={`${htmlFor}-error`}>{error}</p>}
    </div>
  );
}
