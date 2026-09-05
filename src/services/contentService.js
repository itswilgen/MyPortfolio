import { PROJECT_RECORDS } from "../data/projects";
import { DEFAULT_PAYMENT_PROOFS, DEFAULT_PROFILE } from "../data/profile";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const legacyImages = Object.fromEntries(PROJECT_RECORDS.map((project) => [project.id, project.image]));

export const profileFromRow = (row = {}) => ({
  id: row.id,
  name: row.name,
  professionalTitle: row.professional_title,
  heroIntro: row.hero_intro,
  biography: row.biography,
  currentFocus: row.current_focus,
  location: row.location,
  education: row.education,
  availability: row.availability,
  profileImagePath: row.profile_image_path,
  resumePath: row.resume_path,
  resumeUrl: row.resume_url,
  email: row.email,
  socialLinks: row.social_links || {},
  heroStats: row.hero_stats || [],
  updatedAt: row.updated_at,
});

export const projectFromRow = (row = {}) => ({
  id: row.slug || row.id,
  databaseId: row.id,
  slug: row.slug,
  title: row.title,
  subtitle: row.subtitle,
  description: row.short_description,
  longDescription: row.full_description,
  problem: row.problem,
  purpose: row.purpose,
  imagePath: row.cover_image_path,
  image: row.cover_image_url || legacyImages[row.slug] || null,
  imageAlt: row.cover_image_alt,
  tags: row.technologies || [],
  category: row.category,
  status: row.status,
  features: row.features || [],
  stack: {
    frontend: row.frontend_stack || [],
    backend: row.backend_stack || [],
    database: row.database_stack || [],
  },
  github: row.github_url,
  demo: row.demo_url,
  featured: Boolean(row.featured),
  published: Boolean(row.published),
  displayOrder: row.display_order ?? 0,
  screenshots: row.screenshots || [],
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  color: "#0891b2",
});

export const certificateFromRow = (row = {}) => ({
  id: row.id,
  databaseId: row.id,
  slug: row.slug,
  title: row.title,
  issuer: row.issuer,
  category: row.category,
  description: row.description || "",
  issueDate: row.issue_date,
  expirationDate: row.expiration_date || "",
  doesNotExpire: Boolean(row.does_not_expire),
  credentialId: row.credential_id || "",
  verificationUrl: row.verification_url || "",
  skills: row.skills || [],
  imageUrl: row.image_url || "",
  imagePath: row.image_path || "",
  pdfUrl: row.pdf_url || "",
  pdfPath: row.pdf_path || "",
  imageAlt: row.image_alt || "",
  allowDownload: Boolean(row.allow_download),
  featured: Boolean(row.is_featured),
  published: Boolean(row.is_published),
  displayOrder: row.display_order ?? 0,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const projectToFallback = (project, index) => ({
  ...project,
  slug: project.id,
  databaseId: project.id,
  category: project.tags[0] || "Web application",
  problem: "",
  purpose: project.longDescription,
  featured: true,
  published: true,
  displayOrder: index,
  screenshots: [],
});

const signPath = async (bucket, path, expiresIn = 3600) => {
  if (!path || !supabase) return null;
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn);
  return error ? null : data.signedUrl;
};

export async function getPublicProfile() {
  if (!isSupabaseConfigured) return DEFAULT_PROFILE;
  const { data, error } = await supabase.from("profiles").select("*").eq("published", true).limit(1).maybeSingle();
  if (error || !data) return DEFAULT_PROFILE;
  const profile = profileFromRow(data);
  const signedImage = await signPath("profile-images", profile.profileImagePath);
  return {
    ...DEFAULT_PROFILE,
    ...profile,
    profileImageUrl: signedImage || DEFAULT_PROFILE.profileImageUrl,
    aboutImageUrl: signedImage || DEFAULT_PROFILE.aboutImageUrl,
    resumeUrl: profile.resumePath
      ? await signPath("resume-files", profile.resumePath)
      : profile.resumeUrl || DEFAULT_PROFILE.resumeUrl,
  };
}

async function hydrateProject(row) {
  const project = projectFromRow(row);
  const screenshots = await Promise.all(project.screenshots.map(async (item) => ({
    ...item,
    url: item.path ? await signPath("project-images", item.path) : item.url,
  })));
  return {
    ...project,
    image: (await signPath("project-images", project.imagePath)) || project.image,
    screenshots: screenshots.filter((item) => item.url),
  };
}

export async function getPublicProjects() {
  if (!isSupabaseConfigured) return PROJECT_RECORDS.map(projectToFallback);
  const { data, error } = await supabase.from("projects").select("*").eq("published", true).order("display_order");
  if (error) return PROJECT_RECORDS.map(projectToFallback);
  return Promise.all((data || []).map(hydrateProject));
}

export async function getPublicProject(identifier) {
  if (!isSupabaseConfigured) {
    const project = PROJECT_RECORDS.find((item) => item.id === identifier);
    return project ? projectToFallback(project, 0) : null;
  }
  const isUuid = /^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(identifier);
  let query = supabase.from("projects").select("*").eq("published", true);
  query = isUuid ? query.eq("id", identifier) : query.eq("slug", identifier);
  const { data, error } = await query.maybeSingle();
  return error || !data ? null : hydrateProject(data);
}

export async function getPublicPaymentProofs() {
  if (!isSupabaseConfigured) return DEFAULT_PAYMENT_PROOFS;
  const { data, error } = await supabase.rpc("get_published_payment_proofs");
  if (error) return [];
  return Promise.all((data || []).map(async (row) => ({
    ...row,
    imageUrl: await signPath("payment-proof-images", row.image_path),
    amount: row.show_amount ? row.amount : null,
  })));
}

async function hydrateCertificate(row) {
  const certificate = certificateFromRow(row);
  const needsPdf = certificate.allowDownload || !(certificate.imagePath || certificate.imageUrl);
  return {
    ...certificate,
    imageUrl: certificate.imagePath
      ? await signPath("certificate-files", certificate.imagePath)
      : certificate.imageUrl,
    pdfUrl: certificate.pdfPath && needsPdf
      ? await signPath("certificate-files", certificate.pdfPath)
      : needsPdf ? certificate.pdfUrl : "",
  };
}

export async function getPublicCertificates() {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from("certificates")
    .select("*")
    .eq("is_published", true)
    .order("is_featured", { ascending: false })
    .order("display_order")
    .order("issue_date", { ascending: false });
  if (error) return [];
  return Promise.all((data || []).map(hydrateCertificate));
}

export async function getPublicSettings() {
  if (!isSupabaseConfigured) return {};
  const { data, error } = await supabase
    .from("site_settings")
    .select("settings")
    .eq("id", "default")
    .maybeSingle();
  return error ? {} : data?.settings || {};
}
