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
