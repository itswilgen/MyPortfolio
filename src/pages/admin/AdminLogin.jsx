import { ArrowLeft, LockKeyhole } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import FormField from "../../components/ui/FormField";
import ThemeToggle from "../../components/ui/ThemeToggle";
import { useAuth } from "../../contexts/AuthContext";

export default function AdminLogin() {
  const { configured, isAdmin, loading, signIn, user, signOut } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  if (!loading && user && isAdmin) return <Navigate to="/admin" replace />;
  const submit = async (event) => {
    event.preventDefault(); setSubmitting(true); setError("");
    try {
      await signIn(form.email, form.password);
      navigate(location.state?.from?.pathname || "/admin", { replace: true });
    } catch (err) { setError(err.message); setSubmitting(false); }
  };
  return (
    <div className="login-page">
      <section className="login-brand"><span className="brand-logo text-white">WG<span className="brand-dot">.DEV</span></span><h1>A focused workspace for keeping your portfolio current.</h1><p className="text-sm text-white/60">Secure content management powered by Supabase.</p></section>
      <main className="login-form-wrap"><div className="login-form"><div className="flex items-center justify-between"><Link to="/" className="back-link mb-0"><ArrowLeft size={17} /> Portfolio</Link><ThemeToggle compact /></div><LockKeyhole className="mt-8 text-cyan-600 dark:text-cyan-300" size={28} /><h1>Admin sign in</h1><p>Use the authorized administrator account. Public registration is disabled.</p>
        {!configured && <div className="config-notice">Supabase is not configured. Add the variables from <code>.env.example</code> before signing in.</div>}
        {location.state?.unauthorized && <div className="config-notice">This account is authenticated but is not listed as an authorized administrator. <button type="button" className="underline" onClick={signOut}>Sign out</button></div>}
        <form onSubmit={submit}><FormField label="Email" htmlFor="admin-email" required><input id="admin-email" type="email" autoComplete="username" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></FormField><FormField label="Password" htmlFor="admin-password" required><input id="admin-password" type="password" autoComplete="current-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required minLength={8} /></FormField>{error && <p className="field-error" role="alert">{error}</p>}<button className="btn-primary w-full" type="submit" disabled={!configured || submitting}>{submitting ? "Signing in…" : "Sign in"}</button></form>
      </div></main>
    </div>
  );
}
