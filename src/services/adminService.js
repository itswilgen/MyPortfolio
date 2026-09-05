import { supabase } from "../lib/supabase";
import { certificateFromRow, profileFromRow, projectFromRow } from "./contentService";

const requireSupabase = () => {
  if (!supabase) throw new Error("Supabase is not configured. Add the required Vite environment variables.");
  return supabase;
};

const throwIfError = (error) => {
  if (error) throw error;
};

export async function verifyAdmin() {
  const client = requireSupabase();
  const { data, error } = await client.from("admin_users").select("user_id").maybeSingle();
  throwIfError(error);
  return Boolean(data);
}

export async function getAdminProjects() {
  const { data, error } = await requireSupabase().from("projects").select("*").order("display_order");
  throwIfError(error);
  return Promise.all((data || []).map(hydrateAdminProject));
}

async function hydrateAdminProject(row) {
  const project = projectFromRow(row);
  if (project.imagePath) {
    const { data } = await requireSupabase().storage.from("project-images").createSignedUrl(project.imagePath, 3600);
    project.image = data?.signedUrl || project.image;
  }
  project.screenshots = await Promise.all(project.screenshots.map(async (item) => {
    if (!item.path) return item;
    const { data } = await requireSupabase().storage.from("project-images").createSignedUrl(item.path, 3600);
    return { ...item, url: data?.signedUrl || item.url };
  }));
  return project;
}

export async function getAdminProject(id) {
  const { data, error } = await requireSupabase().from("projects").select("*").eq("id", id).single();
  throwIfError(error);
  return hydrateAdminProject(data);
}

export const projectToRow = (project) => ({
  slug: project.slug.trim(),
  title: project.title.trim(),
  subtitle: project.subtitle?.trim() || null,
  short_description: project.description.trim(),
  full_description: project.longDescription.trim(),
  problem: project.problem?.trim() || null,
  purpose: project.purpose?.trim() || null,
  cover_image_path: project.imagePath || null,
  cover_image_alt: project.imageAlt.trim(),
  technologies: project.tags,
  category: project.category?.trim() || null,
  status: project.status.trim(),
  features: project.features,
  frontend_stack: project.stack.frontend,
  backend_stack: project.stack.backend,
  database_stack: project.stack.database,
  github_url: project.github?.trim() || null,
  demo_url: project.demo?.trim() || null,
  featured: Boolean(project.featured),
  published: Boolean(project.published),
  display_order: Number(project.displayOrder) || 0,
  screenshots: (project.screenshots || []).map((item) => item.path
    ? { path: item.path, alt: item.alt || "" }
    : { url: item.url, alt: item.alt || "" }),
});

export async function saveProject(project) {
  const client = requireSupabase();
  const row = projectToRow(project);
  const query = project.databaseId
    ? client.from("projects").update(row).eq("id", project.databaseId)
    : client.from("projects").insert(row);
  const { data, error } = await query.select().single();
  throwIfError(error);
  return projectFromRow(data);
}

export async function deleteProject(id) {
  const { error } = await requireSupabase().from("projects").delete().eq("id", id);
  throwIfError(error);
}

export async function setProjectState(id, changes) {
  const row = {};
  if ("published" in changes) row.published = changes.published;
  if ("featured" in changes) row.featured = changes.featured;
  if ("displayOrder" in changes) row.display_order = Number(changes.displayOrder);
  const { error } = await requireSupabase().from("projects").update(row).eq("id", id);
  throwIfError(error);
}

export async function getAdminProfile() {
  const { data, error } = await requireSupabase().from("profiles").select("*").limit(1).maybeSingle();
  throwIfError(error);
  return data ? profileFromRow(data) : null;
}

export async function saveProfile(profile) {
  const row = {
    name: profile.name.trim(),
    professional_title: profile.professionalTitle.trim(),
    hero_intro: profile.heroIntro.trim(),
    biography: profile.biography.trim(),
    current_focus: profile.currentFocus?.trim() || null,
    location: profile.location?.trim() || null,
    education: profile.education?.trim() || null,
    availability: profile.availability?.trim() || null,
    profile_image_path: profile.profileImagePath || null,
    resume_path: profile.resumePath || null,
    resume_url: profile.resumeUrl?.trim() || null,
    email: profile.email.trim(),
    social_links: profile.socialLinks,
    hero_stats: profile.heroStats,
    published: true,
  };
  const client = requireSupabase();
  const query = profile.id ? client.from("profiles").update(row).eq("id", profile.id) : client.from("profiles").insert(row);
  const { data, error } = await query.select().single();
  throwIfError(error);
  return profileFromRow(data);
}

export async function getAdminPaymentProofs() {
  const { data, error } = await requireSupabase().from("payment_proofs").select("*").order("display_order");
  throwIfError(error);
  return data || [];
}

export async function savePaymentProof(proof) {
  const row = {
    project_or_service: proof.project_or_service.trim(),
    client_label: proof.client_label.trim(),
    payment_platform: proof.payment_platform?.trim() || null,
    payment_date: proof.payment_date || null,
    amount: proof.amount === "" ? null : Number(proof.amount),
    currency: proof.currency?.trim().toUpperCase() || "PHP",
    show_amount: Boolean(proof.show_amount),
    description: proof.description?.trim() || null,
    image_path: proof.image_path,
    image_alt: proof.image_alt.trim(),
    published: Boolean(proof.published),
    display_order: Number(proof.display_order) || 0,
  };
  const client = requireSupabase();
  const query = proof.id ? client.from("payment_proofs").update(row).eq("id", proof.id) : client.from("payment_proofs").insert(row);
  const { data, error } = await query.select().single();
  throwIfError(error);
  return data;
}

export async function deletePaymentProof(id) {
  const { error } = await requireSupabase().from("payment_proofs").delete().eq("id", id);
  throwIfError(error);
}

async function hydrateAdminCertificate(row) {
  const certificate = certificateFromRow(row);
  const client = requireSupabase();
  const [imageResult, pdfResult] = await Promise.all([
    certificate.imagePath
      ? client.storage.from("certificate-files").createSignedUrl(certificate.imagePath, 3600)
      : Promise.resolve({ data: null }),
    certificate.pdfPath
      ? client.storage.from("certificate-files").createSignedUrl(certificate.pdfPath, 3600)
      : Promise.resolve({ data: null }),
  ]);
  return {
    ...certificate,
    imageUrl: imageResult.data?.signedUrl || certificate.imageUrl,
    pdfUrl: pdfResult.data?.signedUrl || certificate.pdfUrl,
  };
}

export async function getAdminCertificates() {
  const { data, error } = await requireSupabase()
    .from("certificates")
    .select("*")
    .order("display_order")
    .order("issue_date", { ascending: false });
  throwIfError(error);
  return Promise.all((data || []).map(hydrateAdminCertificate));
}

export async function getAdminCertificate(id) {
  const { data, error } = await requireSupabase()
    .from("certificates")
    .select("*")
    .eq("id", id)
    .single();
  throwIfError(error);
  return hydrateAdminCertificate(data);
}

const certificateToRow = (certificate, slug) => ({
  slug,
  title: certificate.title.trim(),
  issuer: certificate.issuer.trim(),
  category: certificate.category.trim(),
  description: certificate.description?.trim() || null,
  issue_date: certificate.issueDate,
  expiration_date: certificate.doesNotExpire ? null : certificate.expirationDate || null,
  does_not_expire: Boolean(certificate.doesNotExpire),
  credential_id: certificate.credentialId?.trim() || null,
  verification_url: certificate.verificationUrl?.trim() || null,
  skills: certificate.skills || [],
  image_url: certificate.imageUrl && !certificate.imagePath ? certificate.imageUrl : null,
  image_path: certificate.imagePath || null,
  pdf_url: certificate.pdfUrl && !certificate.pdfPath ? certificate.pdfUrl : null,
  pdf_path: certificate.pdfPath || null,
  image_alt: certificate.imagePath || certificate.imageUrl ? certificate.imageAlt.trim() : null,
  allow_download: Boolean(certificate.allowDownload),
  is_featured: Boolean(certificate.featured),
  is_published: Boolean(certificate.published),
  display_order: Number(certificate.displayOrder) || 0,
});

const slugify = (value) => value
  .toLowerCase()
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "")
  .slice(0, 100) || "certificate";

async function createUniqueCertificateSlug(title, currentId) {
  const client = requireSupabase();
  const base = slugify(title);
  let query = client.from("certificates").select("id, slug").like("slug", `${base}%`);
  if (currentId) query = query.neq("id", currentId);
  const { data, error } = await query;
  throwIfError(error);
  const used = new Set((data || []).map((item) => item.slug));
  if (!used.has(base)) return base;
  let suffix = 2;
  while (used.has(`${base}-${suffix}`)) suffix += 1;
  return `${base}-${suffix}`;
}

export function validateCertificateImage(file) {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.type)) throw new Error("Use a JPG, PNG, or WebP certificate image.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Certificate image must be 5 MB or smaller.");
}

export function validateCertificatePdf(file) {
  if (file.type !== "application/pdf") throw new Error("Certificate document must be a PDF.");
  if (file.size > 10 * 1024 * 1024) throw new Error("Certificate PDF must be 10 MB or smaller.");
}

async function removeCertificateFiles(paths) {
  const filtered = [...new Set(paths.filter(Boolean))];
  if (!filtered.length) return;
  const { error } = await requireSupabase().storage.from("certificate-files").remove(filtered);
  throwIfError(error);
}

export async function saveCertificate(certificate, files = {}) {
  const client = requireSupabase();
  const uploadedPaths = [];
  const previousImagePath = certificate.imagePath;
  const previousPdfPath = certificate.pdfPath;
  let imagePath = files.removeImage ? "" : previousImagePath;
  let pdfPath = files.removePdf ? "" : previousPdfPath;
  let persisted = false;

  try {
    if (files.imageFile) {
      validateCertificateImage(files.imageFile);
      imagePath = await uploadFile("certificate-files", files.imageFile, "certificates/images");
      uploadedPaths.push(imagePath);
    }
    if (files.pdfFile) {
      validateCertificatePdf(files.pdfFile);
      pdfPath = await uploadFile("certificate-files", files.pdfFile, "certificates/documents");
      uploadedPaths.push(pdfPath);
    }

    const next = {
      ...certificate,
      imagePath,
      imageUrl: imagePath ? certificate.imageUrl : "",
      pdfPath,
      pdfUrl: pdfPath ? certificate.pdfUrl : "",
    };
    const slug = certificate.slug || await createUniqueCertificateSlug(certificate.title, certificate.databaseId);
    const row = certificateToRow(next, slug);
    const query = certificate.databaseId
      ? client.from("certificates").update(row).eq("id", certificate.databaseId)
      : client.from("certificates").insert(row);
    const { data, error } = await query.select().single();
    throwIfError(error);
    persisted = true;

    const replaced = [
      previousImagePath && previousImagePath !== imagePath ? previousImagePath : null,
      previousPdfPath && previousPdfPath !== pdfPath ? previousPdfPath : null,
    ];
    let cleanupWarning = "";
    try {
      await removeCertificateFiles(replaced);
    } catch {
      cleanupWarning = "The certificate was saved, but an older file could not be removed from storage.";
    }
    return { ...await hydrateAdminCertificate(data), cleanupWarning };
  } catch (error) {
    if (!persisted && uploadedPaths.length) {
      await removeCertificateFiles(uploadedPaths).catch(() => {});
    }
    throw error;
  }
}

export async function setCertificateState(id, changes) {
  const row = {};
  if ("published" in changes) row.is_published = Boolean(changes.published);
  if ("featured" in changes) row.is_featured = Boolean(changes.featured);
  if ("displayOrder" in changes) row.display_order = Number(changes.displayOrder);
  const { error } = await requireSupabase().from("certificates").update(row).eq("id", id);
  throwIfError(error);
}

export async function reorderCertificates(orderedIds) {
  const { error } = await requireSupabase().rpc("reorder_certificates", {
    ordered_ids: orderedIds,
  });
  throwIfError(error);
}

export async function deleteCertificate(certificate) {
  const { error } = await requireSupabase().from("certificates").delete().eq("id", certificate.databaseId);
  throwIfError(error);
  try {
    await removeCertificateFiles([certificate.imagePath, certificate.pdfPath]);
    return { cleanupWarning: "" };
  } catch {
    return { cleanupWarning: "The certificate record was deleted, but one or more files require manual storage cleanup." };
  }
}

export async function getSettings() {
  const { data, error } = await requireSupabase().from("site_settings").select("*").eq("id", "default").maybeSingle();
  throwIfError(error);
  return data?.settings || {};
}

export async function saveSettings(settings) {
  const { error } = await requireSupabase().from("site_settings").upsert({ id: "default", settings });
  throwIfError(error);
}

export function validateImage(file, maxMb = 5) {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowed.includes(file.type)) throw new Error("Use a JPG, PNG, WebP, or GIF image.");
  if (file.size > maxMb * 1024 * 1024) throw new Error(`Image must be ${maxMb} MB or smaller.`);
}

export async function uploadFile(bucket, file, folder, options = {}) {
  if (options.image) validateImage(file, options.maxMb || 5);
  const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
  const safeFolder = folder.replace(/[^a-z0-9/_-]/gi, "-");
  const path = `${safeFolder}/${crypto.randomUUID()}.${extension}`;
  const { error } = await requireSupabase().storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    contentType: file.type,
    upsert: false,
  });
  throwIfError(error);
  return path;
}

export async function getDashboardData() {
  const [projects, proofs, profile, certificates] = await Promise.all([
    getAdminProjects(), getAdminPaymentProofs(), getAdminProfile(), getAdminCertificates(),
  ]);
  const recent = [...projects].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];
  const recentCertificates = [...certificates]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 3);
  const latestCertificate = recentCertificates[0];
  const updatedDates = [recent?.updatedAt, profile?.updatedAt, latestCertificate?.updatedAt].filter(Boolean);
  return {
    totalProjects: projects.length,
    publishedProjects: projects.filter((item) => item.published).length,
    draftProjects: projects.filter((item) => !item.published).length,
    featuredProjects: projects.filter((item) => item.featured).length,
    publishedProofs: proofs.filter((item) => item.published).length,
    totalCertificates: certificates.length,
    publishedCertificates: certificates.filter((item) => item.published).length,
    draftCertificates: certificates.filter((item) => !item.published).length,
    featuredCertificates: certificates.filter((item) => item.featured).length,
    recentCertificates,
    lastUpdated: updatedDates.sort((a, b) => new Date(b) - new Date(a))[0] || null,
  };
}
