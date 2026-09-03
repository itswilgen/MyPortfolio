import { useEffect, useState } from "react";
import FormField from "../../components/ui/FormField";
import LoadingState from "../../components/ui/LoadingState";
import { useToast } from "../../contexts/ToastContext";
import { getSettings, saveSettings } from "../../services/adminService";

export default function SettingsAdmin() {
  const [settings, setSettings] = useState({ siteTitle: "WG.DEV", defaultDescription: "", contactCta: "" }); const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false); const { notify } = useToast();
  useEffect(() => { getSettings().then((data) => { setSettings((current) => ({ ...current, ...data })); setLoading(false); }).catch((error) => { notify(error.message, "error"); setLoading(false); }); }, [notify]);
  const submit = async (event) => { event.preventDefault(); setSaving(true); try { await saveSettings(settings); notify("Site settings saved."); } catch (error) { notify(error.message, "error"); } finally { setSaving(false); } };
  if (loading) return <LoadingState label="Loading settings" />;
  return <><div className="breadcrumbs"><span>Admin</span><span>/</span><span>Settings</span></div><header className="admin-page-header"><div><h1>Site settings</h1><p>General portfolio settings. Profile and social links are managed separately.</p></div></header><form className="admin-form max-w-3xl" onSubmit={submit}><section className="form-section"><div className="form-section-header"><h2>General</h2></div><div className="form-section-body"><FormField label="Site title" htmlFor="site-title"><input id="site-title" value={settings.siteTitle} onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })} /></FormField><FormField label="Default meta description" htmlFor="site-description"><textarea id="site-description" value={settings.defaultDescription} onChange={(e) => setSettings({ ...settings, defaultDescription: e.target.value })} /></FormField><FormField label="Contact call to action" htmlFor="contact-cta"><input id="contact-cta" value={settings.contactCta} onChange={(e) => setSettings({ ...settings, contactCta: e.target.value })} /></FormField></div></section><div className="form-actions"><button className="btn-primary" type="submit" disabled={saving}>{saving ? "Saving…" : "Save settings"}</button></div></form></>;
}
