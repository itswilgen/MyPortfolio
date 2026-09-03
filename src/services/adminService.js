import { supabase } from "../lib/supabase";
import { profileFromRow, projectFromRow } from "./contentService";

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
  const [projects, proofs, profile] = await Promise.all([
    getAdminProjects(), getAdminPaymentProofs(), getAdminProfile(),
  ]);
  const recent = [...projects].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];
  return {
    totalProjects: projects.length,
    publishedProjects: projects.filter((item) => item.published).length,
    draftProjects: projects.filter((item) => !item.published).length,
    featuredProjects: projects.filter((item) => item.featured).length,
    publishedProofs: proofs.filter((item) => item.published).length,
    lastUpdated: recent?.updatedAt || profile?.updatedAt || null,
  };
}
