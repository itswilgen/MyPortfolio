import { ArrowLeft, FileText, Image, ShieldAlert, Trash2, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import FormField from "../../components/ui/FormField";
import LoadingState from "../../components/ui/LoadingState";
import { useSiteData } from "../../contexts/SiteDataContext";
import { useToast } from "../../contexts/ToastContext";
import {
  getAdminCertificate,
  saveCertificate,
  validateCertificateImage,
  validateCertificatePdf,
} from "../../services/adminService";

const emptyCertificate = {
  databaseId: null,
  slug: "",
  title: "",
  issuer: "",
  category: "",
  description: "",
  issueDate: "",
  expirationDate: "",
  doesNotExpire: true,
  credentialId: "",
  verificationUrl: "",
  skills: [],
  imageUrl: "",
  imagePath: "",
  pdfUrl: "",
  pdfPath: "",
  imageAlt: "",
  allowDownload: false,
  featured: false,
  published: false,
  displayOrder: 0,
};

const parseSkills = (value) => value.split(/[\n,]/).map((item) => item.trim()).filter(Boolean);
const secureUrl = (value) => !value || /^https:\/\/[\w.-]+(?:[/:?#][^\s]*)?$/i.test(value);

export default function CertificateForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const [certificate, setCertificate] = useState(emptyCertificate);
  const [skills, setSkills] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [removeImage, setRemoveImage] = useState(false);
  const [removePdf, setRemovePdf] = useState(false);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);
  const [errors, setErrors] = useState({});
  const { notify } = useToast();
  const { refresh } = useSiteData();
  const navigate = useNavigate();

  useEffect(() => {
    if (!editing) return;
    getAdminCertificate(id)
      .then((data) => {
        setCertificate(data);
        setSkills(data.skills.join("\n"));
        setLoading(false);
      })
      .catch((error) => {
        notify(error.message, "error");
        setLoading(false);
      });
  }, [editing, id, notify]);

  useEffect(() => () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  const set = (key, value) => setCertificate((current) => ({ ...current, [key]: value }));
  const describedBy = (key) => errors[key] ? `${key}-error` : undefined;

  const chooseImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      validateCertificateImage(file);
      setImageFile(file);
      setRemoveImage(false);
      setImagePreview(URL.createObjectURL(file));
      setErrors((current) => ({ ...current, image: "" }));
    } catch (error) {
      setErrors((current) => ({ ...current, image: error.message }));
    } finally {
      event.target.value = "";
    }
  };

  const choosePdf = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      validateCertificatePdf(file);
      setPdfFile(file);
      setRemovePdf(false);
      setErrors((current) => ({ ...current, pdf: "" }));
    } catch (error) {
      setErrors((current) => ({ ...current, pdf: error.message }));
    } finally {
      event.target.value = "";
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview("");
    setRemoveImage(Boolean(certificate.imagePath || certificate.imageUrl));
  };

  const clearPdf = () => {
    setPdfFile(null);
    setRemovePdf(Boolean(certificate.pdfPath || certificate.pdfUrl));
    set("allowDownload", false);
  };

  const validate = () => {
    const next = {};
    const hasImage = Boolean(imageFile || (!removeImage && (certificate.imagePath || certificate.imageUrl)));
    const hasPdf = Boolean(pdfFile || (!removePdf && (certificate.pdfPath || certificate.pdfUrl)));
    const order = Number(certificate.displayOrder);
    if (certificate.title.trim().length < 2 || certificate.title.trim().length > 160) next.title = "Use a title between 2 and 160 characters.";
    if (certificate.issuer.trim().length < 2 || certificate.issuer.trim().length > 160) next.issuer = "Use an issuer name between 2 and 160 characters.";
    if (certificate.category.trim().length < 2 || certificate.category.trim().length > 80) next.category = "Use a category between 2 and 80 characters.";
    if (!certificate.issueDate) next.issueDate = "Issue date is required.";
    if (!certificate.doesNotExpire && certificate.expirationDate && certificate.issueDate && certificate.expirationDate < certificate.issueDate) next.expirationDate = "Expiration cannot be earlier than the issue date.";
    if (!secureUrl(certificate.verificationUrl)) next.verificationUrl = "Use a complete secure https:// URL.";
    if (certificate.description.length > 1200) next.description = "Keep the description to 1,200 characters or fewer.";
    if (certificate.credentialId.length > 200) next.credentialId = "Keep the credential ID to 200 characters or fewer.";
    if (!Number.isInteger(order) || order < 0) next.displayOrder = "Display order must be a non-negative whole number.";
    if (!hasImage && !hasPdf) next.image = "Upload a certificate image or PDF before saving.";
    if (hasImage && !certificate.imageAlt.trim()) next.imageAlt = "Alternative text is required when an image is used.";
    if (certificate.imageAlt.length > 300) next.imageAlt = "Keep alternative text to 300 characters or fewer.";
    if (certificate.allowDownload && !hasPdf) next.pdf = "Upload a PDF before enabling public download.";
    setErrors(next);
    return !Object.keys(next).length;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate() || savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    try {
      const saved = await saveCertificate({ ...certificate, skills: parseSkills(skills) }, {
        imageFile,
        pdfFile,
        removeImage,
        removePdf,
      });
      await refresh();
      notify(`${saved.title} saved.`);
      if (saved.cleanupWarning) notify(saved.cleanupWarning, "error");
      navigate("/admin/certificates");
    } catch (error) {
      notify(error.message, "error");
      savingRef.current = false;
      setSaving(false);
    }
  };

  if (loading) return <LoadingState label="Loading certificate" />;
  const visibleImage = imagePreview || (!removeImage ? certificate.imageUrl : "");
  const hasPdf = Boolean(pdfFile || (!removePdf && (certificate.pdfPath || certificate.pdfUrl)));

  return (
    <>
      <div className="breadcrumbs"><span>Admin</span><span>/</span><Link to="/admin/certificates">Certificates</Link><span>/</span><span>{editing ? "Edit" : "New"}</span></div>
      <header className="admin-page-header"><div><h1>{editing ? `Edit ${certificate.title}` : "New certificate"}</h1><p>Add only genuine, privacy-reviewed credentials. Required fields are marked with an asterisk.</p></div><Link className="btn-secondary" to="/admin/certificates"><ArrowLeft size={17} /> Back</Link></header>
      <div className="privacy-warning"><ShieldAlert size={21} aria-hidden="true" /><p><strong>Privacy review required:</strong> use a safely redacted public copy. Remove student numbers, signatures, QR codes, home addresses, private email addresses, and any credential detail you do not intentionally want to publish.</p></div>
      <form className="admin-form" onSubmit={submit} noValidate>
        <section className="form-section">
          <div className="form-section-header"><h2>Credential details</h2><p>Use the title and issuer exactly as they appear on the certificate.</p></div>
          <div className="form-section-body">
            <FormField label="Certificate title" htmlFor="title" required error={errors.title}><input id="title" maxLength="160" value={certificate.title} onChange={(event) => set("title", event.target.value)} aria-invalid={Boolean(errors.title)} aria-describedby={describedBy("title")} /></FormField>
            <FormField label="Issuing organization" htmlFor="issuer" required error={errors.issuer}><input id="issuer" maxLength="160" value={certificate.issuer} onChange={(event) => set("issuer", event.target.value)} aria-invalid={Boolean(errors.issuer)} aria-describedby={describedBy("issuer")} /></FormField>
            <FormField label="Category" htmlFor="category" required error={errors.category} hint="Use a consistent category based on your real credentials."><input id="category" maxLength="80" list="certificate-categories" value={certificate.category} onChange={(event) => set("category", event.target.value)} aria-invalid={Boolean(errors.category)} aria-describedby={describedBy("category")} /><datalist id="certificate-categories"><option value="Web Development" /><option value="Backend Development" /><option value="UI/UX Design" /><option value="Cybersecurity" /><option value="Database" /><option value="Cloud and DevOps" /><option value="Academic" /><option value="Professional Training" /></datalist></FormField>
            <FormField label="Credential ID" htmlFor="credentialId" error={errors.credentialId} hint="Optional. Do not add private student or account numbers."><input id="credentialId" maxLength="200" value={certificate.credentialId} onChange={(event) => set("credentialId", event.target.value)} aria-invalid={Boolean(errors.credentialId)} aria-describedby={describedBy("credentialId")} /></FormField>
            <FormField label="Issue date" htmlFor="issueDate" required error={errors.issueDate}><input id="issueDate" type="date" value={certificate.issueDate} onChange={(event) => set("issueDate", event.target.value)} aria-invalid={Boolean(errors.issueDate)} aria-describedby={describedBy("issueDate")} /></FormField>
            <FormField label="Expiration date" htmlFor="expirationDate" error={errors.expirationDate} hint={certificate.doesNotExpire ? "Disabled because this certificate does not expire." : "Optional if the issuer provides no expiration date."}><input id="expirationDate" type="date" min={certificate.issueDate || undefined} value={certificate.doesNotExpire ? "" : certificate.expirationDate} disabled={certificate.doesNotExpire} onChange={(event) => set("expirationDate", event.target.value)} aria-invalid={Boolean(errors.expirationDate)} aria-describedby={describedBy("expirationDate")} /></FormField>
            <label className="checkbox-row"><input type="checkbox" checked={certificate.doesNotExpire} onChange={(event) => { set("doesNotExpire", event.target.checked); if (event.target.checked) set("expirationDate", ""); }} /> This certificate does not expire</label>
            <FormField label="Verification URL" htmlFor="verificationUrl" error={errors.verificationUrl} hint="Optional secure link supplied by the issuer."><input id="verificationUrl" type="url" placeholder="https://…" value={certificate.verificationUrl} onChange={(event) => set("verificationUrl", event.target.value)} aria-invalid={Boolean(errors.verificationUrl)} aria-describedby={describedBy("verificationUrl")} /></FormField>
            <FormField label="Short description" htmlFor="description" error={errors.description} hint={`${certificate.description.length}/1200 characters`}><textarea id="description" maxLength="1200" rows="4" value={certificate.description} onChange={(event) => set("description", event.target.value)} aria-invalid={Boolean(errors.description)} aria-describedby={describedBy("description")} /></FormField>
            <FormField label="Related skills" htmlFor="skills" hint="Enter one skill per line or separate them with commas."><textarea id="skills" rows="4" value={skills} onChange={(event) => setSkills(event.target.value)} /></FormField>
          </div>
        </section>

        <section className="form-section">
          <div className="form-section-header"><h2>Certificate files</h2><p>Upload a redacted public copy. Do not expose signatures, private IDs, addresses, emails, or QR codes.</p></div>
          <div className="form-section-body">
            <FormField label="Certificate image" htmlFor="certificateImage" error={errors.image} hint="JPG, PNG, or WebP; maximum 5 MB. Required unless a PDF is provided.">
              <label className="btn-secondary cursor-pointer" htmlFor="certificateImage"><Upload size={17} /> {imageFile ? "Replace selected image" : "Choose image"}</label>
              <input className="sr-only" id="certificateImage" type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseImage} aria-invalid={Boolean(errors.image)} aria-describedby={errors.image ? "certificateImage-error" : undefined} />
              {(visibleImage || certificate.imagePath) && <div className="certificate-upload-preview">{visibleImage ? <img src={visibleImage} alt={certificate.imageAlt || "Selected certificate preview"} /> : <Image size={24} aria-hidden="true" />}<div><strong>{imageFile?.name || "Stored certificate image"}</strong><button type="button" className="text-link" onClick={clearImage}><Trash2 size={15} aria-hidden="true" /> Remove image</button></div></div>}
            </FormField>
            <FormField label="Certificate PDF" htmlFor="certificatePdf" error={errors.pdf} hint="Optional PDF; maximum 10 MB.">
              <label className="btn-secondary cursor-pointer" htmlFor="certificatePdf"><Upload size={17} /> {pdfFile ? "Replace selected PDF" : "Choose PDF"}</label>
              <input className="sr-only" id="certificatePdf" type="file" accept="application/pdf" onChange={choosePdf} aria-invalid={Boolean(errors.pdf)} aria-describedby={errors.pdf ? "certificatePdf-error" : undefined} />
              {hasPdf && <div className="certificate-file-row"><FileText size={22} aria-hidden="true" /><span>{pdfFile?.name || "Stored certificate PDF"}</span><button type="button" className="text-link" onClick={clearPdf}>Remove</button></div>}
            </FormField>
            <FormField label="Image alternative text" htmlFor="imageAlt" required={Boolean(imageFile || (!removeImage && (certificate.imagePath || certificate.imageUrl)))} error={errors.imageAlt} hint="Describe the credential without repeating every printed word."><input id="imageAlt" maxLength="300" value={certificate.imageAlt} onChange={(event) => set("imageAlt", event.target.value)} aria-invalid={Boolean(errors.imageAlt)} aria-describedby={describedBy("imageAlt")} /></FormField>
            <label className="checkbox-row"><input type="checkbox" checked={certificate.allowDownload} disabled={!hasPdf} onChange={(event) => set("allowDownload", event.target.checked)} /> Allow visitors to download the PDF</label>
          </div>
        </section>

        <section className="form-section">
          <div className="form-section-header"><h2>Publishing</h2><p>Draft credentials and their files remain private.</p></div>
          <div className="form-section-body">
            <FormField label="Display order" htmlFor="displayOrder" error={errors.displayOrder} hint="Lower numbers appear first when display order is used."><input id="displayOrder" type="number" min="0" step="1" value={certificate.displayOrder} onChange={(event) => set("displayOrder", event.target.value)} aria-invalid={Boolean(errors.displayOrder)} aria-describedby={describedBy("displayOrder")} /></FormField>
            <label className="checkbox-row"><input type="checkbox" checked={certificate.featured} onChange={(event) => set("featured", event.target.checked)} /> Feature this certificate</label>
            <label className="checkbox-row"><input type="checkbox" checked={certificate.published} onChange={(event) => set("published", event.target.checked)} /> Publish publicly after privacy review</label>
          </div>
        </section>
        <div className="form-actions"><Link className="btn-secondary" to="/admin/certificates">Cancel</Link><button className="btn-primary" type="submit" disabled={saving}>{saving ? "Saving certificate…" : "Save certificate"}</button></div>
      </form>
    </>
  );
}
