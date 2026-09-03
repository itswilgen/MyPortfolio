import { Upload } from "lucide-react";
import { useEffect, useState } from "react";
import FormField from "../../components/ui/FormField";
import LoadingState from "../../components/ui/LoadingState";
import { useToast } from "../../contexts/ToastContext";
import { useSiteData } from "../../contexts/SiteDataContext";
import { DEFAULT_PROFILE } from "../../data/profile";
import { getAdminProfile, saveProfile, uploadFile } from "../../services/adminService";

const toAdminProfile = (value) => ({ ...DEFAULT_PROFILE, ...value, id: value?.id || null, profileImagePath: value?.profileImagePath || "", resumePath: value?.resumePath || "", socialLinks: { ...DEFAULT_PROFILE.socialLinks, ...(value?.socialLinks || {}) }, heroStats: value?.heroStats || [] });

export default function ProfileAdmin() {
  const [profile, setProfile] = useState(toAdminProfile(null));
  const [stats, setStats] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { notify } = useToast();
  const { refresh } = useSiteData();
  useEffect(() => { getAdminProfile().then((data) => { const next = toAdminProfile(data); setProfile(next); setStats(next.heroStats.map((item) => `${item.value}|${item.label}`).join("\n")); setLoading(false); }).catch((error) => { notify(error.message, "error"); setLoading(false); }); }, [notify]);
  const set = (key, value) => setProfile((current) => ({ ...current, [key]: value }));
  const setSocial = (key, value) => setProfile((current) => ({ ...current, socialLinks: { ...current.socialLinks, [key]: value } }));
  const parseStats = () => stats.split("\n").map((line) => line.split("|")).filter(([value, label]) => value?.trim() && label?.trim()).map(([value, label]) => ({ value: value.trim(), label: label.trim() }));
  const submit = async (event) => {
    event.preventDefault();
    const externalUrls = [profile.resumeUrl, profile.socialLinks.github, profile.socialLinks.linkedin, profile.socialLinks.facebook].filter(Boolean);
    if (externalUrls.some((url) => !/^https:\/\//i.test(url))) { notify("Résumé and social links must use secure https:// URLs.", "error"); return; }
    setSaving(true);
    try { const saved = await saveProfile({ ...profile, heroStats: parseStats() }); setProfile(toAdminProfile(saved)); await refresh(); notify("Profile saved and public content refreshed."); }
    catch (error) { notify(error.message, "error"); }
    finally { setSaving(false); }
  };
  const upload = async (event) => { const file = event.target.files?.[0]; if (!file) return; setUploading(true); try { set("profileImagePath", await uploadFile("profile-images", file, "profile", { image: true })); notify("Profile image uploaded."); } catch (error) { notify(error.message, "error"); } finally { setUploading(false); event.target.value = ""; } };
  if (loading) return <LoadingState label="Loading profile" />;
  return <><div className="breadcrumbs"><span>Admin</span><span>/</span><span>Profile</span></div><header className="admin-page-header"><div><h1>Profile</h1><p>Manage the biography and identity shown on the public portfolio.</p></div></header><form className="admin-form" onSubmit={submit}>
    <section className="form-section"><div className="form-section-header"><h2>Identity and introduction</h2></div><div className="form-section-body"><FormField label="Name" htmlFor="name" required><input id="name" value={profile.name} onChange={(e) => set("name", e.target.value)} required /></FormField><FormField label="Professional title" htmlFor="professional-title" required><input id="professional-title" value={profile.professionalTitle} onChange={(e) => set("professionalTitle", e.target.value)} required /></FormField><FormField label="Hero introduction" htmlFor="hero-intro" required><textarea id="hero-intro" value={profile.heroIntro} onChange={(e) => set("heroIntro", e.target.value)} required /></FormField><FormField label="Biography" htmlFor="biography" required hint="Separate paragraphs with a blank line."><textarea id="biography" rows="9" value={profile.biography} onChange={(e) => set("biography", e.target.value)} required /></FormField><FormField label="Current focus" htmlFor="focus"><input id="focus" value={profile.currentFocus || ""} onChange={(e) => set("currentFocus", e.target.value)} /></FormField><FormField label="Availability" htmlFor="availability"><input id="availability" value={profile.availability || ""} onChange={(e) => set("availability", e.target.value)} /></FormField><FormField label="Location" htmlFor="location"><input id="location" value={profile.location || ""} onChange={(e) => set("location", e.target.value)} /></FormField><FormField label="Education" htmlFor="education"><input id="education" value={profile.education || ""} onChange={(e) => set("education", e.target.value)} /></FormField></div></section>
    <section className="form-section"><div className="form-section-header"><h2>Media and contact</h2></div><div className="form-section-body"><FormField label="Profile image" htmlFor="profile-image" hint={profile.profileImagePath || "JPG, PNG, WebP, or GIF; maximum 5 MB."}><label className="btn-secondary cursor-pointer" htmlFor="profile-image"><Upload size={17} /> {uploading ? "Uploading…" : "Upload image"}</label><input className="sr-only" id="profile-image" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={upload} disabled={uploading} /></FormField><FormField label="Résumé URL" htmlFor="resume"><input id="resume" type="url" value={profile.resumeUrl || ""} onChange={(e) => set("resumeUrl", e.target.value)} /></FormField><FormField label="Email" htmlFor="email" required><input id="email" type="email" value={profile.email} onChange={(e) => set("email", e.target.value)} required /></FormField><FormField label="GitHub URL" htmlFor="github"><input id="github" type="url" value={profile.socialLinks.github || ""} onChange={(e) => setSocial("github", e.target.value)} /></FormField><FormField label="LinkedIn URL" htmlFor="linkedin"><input id="linkedin" type="url" value={profile.socialLinks.linkedin || ""} onChange={(e) => setSocial("linkedin", e.target.value)} /></FormField><FormField label="Facebook URL" htmlFor="facebook"><input id="facebook" type="url" value={profile.socialLinks.facebook || ""} onChange={(e) => setSocial("facebook", e.target.value)} /></FormField></div></section>
    <section className="form-section"><div className="form-section-header"><h2>Optional hero statistics</h2><p>Use only facts you can verify. Leave blank to hide the statistics row.</p></div><div className="form-section-body"><FormField label="Statistics" htmlFor="stats" hint="One per line in value|label format, for example: 3|Completed systems"><textarea id="stats" value={stats} onChange={(e) => setStats(e.target.value)} /></FormField></div></section>
    <div className="form-actions"><button className="btn-primary" type="submit" disabled={saving}>{saving ? "Saving…" : "Save profile"}</button></div>
  </form></>;
}
