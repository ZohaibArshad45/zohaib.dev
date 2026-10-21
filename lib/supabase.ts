import { createClient } from "@supabase/supabase-js";
import type { Project } from "./projects";
import type { Inquiry } from "./inquiriesStore";
import type { Service } from "./services";
import {
  getLocalProjects,
  saveLocalProjects,
  addLocalProject,
  updateLocalProject,
  deleteLocalProject,
} from "./projectsStore";
import {
  getInquiries as getLocalInquiries,
  addInquiry as addLocalInquiry,
  updateInquiry as updateLocalInquiry,
  deleteInquiry as deleteLocalInquiry,
} from "./inquiriesStore";
import {
  getLocalServices,
  addLocalService,
  deleteLocalService,
} from "./servicesStore";
import {
  getLocalSettings,
  updateLocalSettings,
  type SiteSettings,
} from "./settingsStore";
import type { Resource } from "./resources";
import {
  getLocalResources,
  addLocalResource,
  updateLocalResource,
  deleteLocalResource,
} from "./resourcesStore";
import type { UpcomingProject } from "./upcoming";
import {
  getLocalUpcomingProjects,
  addLocalUpcomingProject,
  updateLocalUpcomingProject,
  deleteLocalUpcomingProject,
} from "./upcomingStore";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "https://mzsvmxdeyrxiddbwjctt.supabase.co";

const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "sb_publishable_p2aqeeQBWR_oYMOKNAAg0Q_zzawtR5R";

export const supabase = createClient(supabaseUrl, supabaseKey);

// =====================================================================
// DATA CONVERSION HELPERS
// =====================================================================
type DbProjectRow = {
  slug?: string;
  number?: string;
  title?: string;
  short_title?: string;
  shortTitle?: string;
  status?: string;
  categories?: string[];
  headline?: string;
  subhead?: string;
  description?: string;
  outcome?: string;
  tags?: string[];
  images?: string[];
  preview_type?: Project["previewType"];
  previewType?: Project["previewType"];
  client?: string;
  role?: string;
  timeline?: string;
  deliverables?: string[];
  problem?: string;
  solution?: string;
  architecture_highlights?: string[];
  architectureHighlights?: string[];
  metrics?: Project["metrics"];
  demo_url?: string;
  demoUrl?: string;
  github_url?: string;
  githubUrl?: string;
  [key: string]: unknown;
};

function mapDbToProject(row: DbProjectRow): Project {
  return {
    slug: row.slug || "",
    number: row.number || "01",
    title: row.title || "",
    shortTitle: row.short_title || row.shortTitle || row.title || "",
    status: row.status || "",
    categories: Array.isArray(row.categories) ? row.categories : [],
    headline: row.headline || "",
    subhead: row.subhead || "",
    description: row.description || "",
    outcome: row.outcome || "",
    tags: Array.isArray(row.tags) ? row.tags : [],
    images: Array.isArray(row.images) ? row.images : [],
    previewType: row.preview_type || row.previewType || "dashboard",
    client: row.client || "",
    role: row.role || "",
    timeline: row.timeline || "",
    deliverables: Array.isArray(row.deliverables) ? row.deliverables : [],
    problem: row.problem || "",
    solution: row.solution || "",
    architectureHighlights: Array.isArray(row.architecture_highlights)
      ? row.architecture_highlights
      : row.architectureHighlights || [],
    metrics: Array.isArray(row.metrics) ? row.metrics : [],
    features: Array.isArray(row.features) ? row.features : undefined,
    demoUrl: row.demo_url || row.demoUrl,
    githubUrl: row.github_url || row.githubUrl,
  };
}

function mapProjectToDb(proj: Project): Record<string, unknown> {
  return {
    slug: proj.slug,
    number: proj.number,
    title: proj.title,
    short_title: proj.shortTitle,
    status: proj.status,
    categories: proj.categories,
    headline: proj.headline,
    subhead: proj.subhead,
    description: proj.description,
    outcome: proj.outcome,
    tags: proj.tags,
    images: Array.isArray(proj.images) ? proj.images : [],
    preview_type: proj.previewType,
    client: proj.client,
    role: proj.role,
    timeline: proj.timeline,
    deliverables: proj.deliverables,
    problem: proj.problem,
    solution: proj.solution,
    architecture_highlights: proj.architectureHighlights,
    metrics: proj.metrics,
    features: proj.features || [],
    demo_url: proj.demoUrl || null,
    github_url: proj.githubUrl || null,
    updated_at: new Date().toISOString(),
  };
}

// =====================================================================
// PROJECTS CRUD (SUPABASE WITH LOCAL FALLBACK)
// =====================================================================
export async function getProjects(): Promise<{
  source: "supabase" | "local";
  projects: Project[];
}> {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("number", { ascending: true });

    if (!error && Array.isArray(data)) {
      // Merge with local images in case Supabase schema does not have the 'images' column yet
      const local = await getLocalProjects();
      const localMap = new Map(local.map((p) => [p.slug, p]));
      const seenSlugs = new Set<string>();

      const projects = data.map((row) => {
        const proj = mapDbToProject(row);
        seenSlugs.add(proj.slug);
        if ((!proj.images || proj.images.length === 0) && localMap.has(proj.slug)) {
          const localItem = localMap.get(proj.slug);
          if (localItem?.images && localItem.images.length > 0) {
            proj.images = localItem.images;
          }
        }
        return proj;
      });

      // Also include any local projects that might not be in Supabase yet
      for (const localProj of local) {
        if (!seenSlugs.has(localProj.slug)) {
          projects.push(localProj);
          seenSlugs.add(localProj.slug);
        }
      }

      // Keep local projects in sync so every project is safely recorded locally
      await saveLocalProjects(projects);

      return {
        source: "supabase",
        projects,
      };
    }
  } catch (err) {
    console.warn("Supabase fetch projects error, falling back to local:", err);
  }

  const local = await getLocalProjects();
  return { source: "local", projects: local };
}

export async function addProject(
  project: Project
): Promise<{ source: "supabase" | "local"; project: Project }> {
  // Always save locally first as guarantee
  await addLocalProject(project);

  try {
    const dbPayload = mapProjectToDb(project);
    dbPayload.created_at = new Date().toISOString();
    let { data, error } = await supabase
      .from("projects")
      .insert([dbPayload])
      .select()
      .single();

    // If Supabase failed because 'images' column is missing in database schema
    if (error && (error.code === "PGRST204" || error.message?.includes("images"))) {
      console.warn("Supabase projects table missing 'images' column, retrying insert without images:", error.message);
      const { images: _ignored, ...payloadWithoutImages } = dbPayload;
      const retryResult = await supabase
        .from("projects")
        .insert([payloadWithoutImages])
        .select()
        .single();
      data = retryResult.data;
      error = retryResult.error;
    }

    if (!error && data) {
      const mapped = mapDbToProject(data);
      if ((!mapped.images || mapped.images.length === 0) && project.images?.length) {
        mapped.images = project.images;
      }
      return { source: "supabase", project: mapped };
    }
  } catch (err) {
    console.warn("Supabase insert project error:", err);
  }

  return { source: "local", project };
}

export async function updateProject(
  slug: string,
  updates: Partial<Project>
): Promise<{ source: "supabase" | "local"; project: Project | null }> {
  // Update locally
  const localUpdated = await updateLocalProject(slug, updates);

  try {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.number) dbUpdates.number = updates.number;
    if (updates.title) dbUpdates.title = updates.title;
    if (updates.shortTitle) dbUpdates.short_title = updates.shortTitle;
    if (updates.status) dbUpdates.status = updates.status;
    if (updates.categories) dbUpdates.categories = updates.categories;
    if (updates.headline) dbUpdates.headline = updates.headline;
    if (updates.subhead) dbUpdates.subhead = updates.subhead;
    if (updates.description) dbUpdates.description = updates.description;
    if (updates.outcome) dbUpdates.outcome = updates.outcome;
    if (updates.tags) dbUpdates.tags = updates.tags;
    if (updates.images !== undefined) dbUpdates.images = updates.images;
    if (updates.previewType) dbUpdates.preview_type = updates.previewType;
    if (updates.client) dbUpdates.client = updates.client;
    if (updates.role) dbUpdates.role = updates.role;
    if (updates.timeline) dbUpdates.timeline = updates.timeline;
    if (updates.deliverables) dbUpdates.deliverables = updates.deliverables;
    if (updates.problem) dbUpdates.problem = updates.problem;
    if (updates.solution) dbUpdates.solution = updates.solution;
    if (updates.architectureHighlights)
      dbUpdates.architecture_highlights = updates.architectureHighlights;
    if (updates.metrics) dbUpdates.metrics = updates.metrics;
    if (updates.demoUrl !== undefined) dbUpdates.demo_url = updates.demoUrl;
    if (updates.githubUrl !== undefined)
      dbUpdates.github_url = updates.githubUrl;
    dbUpdates.updated_at = new Date().toISOString();

    let { data, error } = await supabase
      .from("projects")
      .update(dbUpdates)
      .eq("slug", slug)
      .select()
      .single();

    // If Supabase failed because 'images' column is missing in database schema
    if (error && (error.code === "PGRST204" || error.message?.includes("images"))) {
      console.warn("Supabase projects table missing 'images' column, retrying update without images:", error.message);
      const { images: _ignored, ...updatesWithoutImages } = dbUpdates;
      const retryResult = await supabase
        .from("projects")
        .update(updatesWithoutImages)
        .eq("slug", slug)
        .select()
        .single();
      data = retryResult.data;
      error = retryResult.error;
    }

    if (!error && data) {
      const mapped = mapDbToProject(data);
      const fallbackImages = updates.images?.length ? updates.images : (localUpdated?.images || []);
      if ((!mapped.images || mapped.images.length === 0) && fallbackImages.length > 0) {
        mapped.images = fallbackImages;
      }
      return { source: "supabase", project: mapped };
    }
  } catch (err) {
    console.warn("Supabase update project error:", err);
  }

  return { source: "local", project: localUpdated };
}

export async function deleteProject(
  slug: string
): Promise<{ source: "supabase" | "local"; success: boolean }> {
  await deleteLocalProject(slug);

  try {
    const { error } = await supabase.from("projects").delete().eq("slug", slug);
    if (!error) {
      return { source: "supabase", success: true };
    }
  } catch (err) {
    console.warn("Supabase delete project error:", err);
  }

  return { source: "local", success: true };
}

// =====================================================================
// INQUIRIES CRUD (SUPABASE WITH LOCAL FALLBACK)
// =====================================================================
export async function getInquiries(): Promise<{
  source: "supabase" | "local";
  inquiries: Inquiry[];
}> {
  try {
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && Array.isArray(data)) {
      return {
        source: "supabase",
        inquiries: data.map((row) => ({
          id: row.id,
          name: row.name,
          email: row.email,
          projectType: row.project_type || row.projectType,
          timeline: row.timeline,
          details: row.details,
          status: row.status,
          priority: row.priority,
          createdAt: row.created_at,
          notes: row.notes,
          estimatedBudget: row.estimated_budget || row.estimatedBudget,
        })),
      };
    } else if (error) {
      console.warn("Supabase fetch inquiries error:", error);
    }
  } catch (err) {
    console.warn("Supabase fetch inquiries error:", err);
  }

  const local = await getLocalInquiries();
  return { source: "local", inquiries: local };
}

export async function addInquiry(
  inquiry: Omit<Inquiry, "id" | "createdAt" | "status" | "priority"> & {
    priority?: Inquiry["priority"];
    estimatedBudget?: string;
  }
): Promise<{ source: "supabase" | "local"; inquiry: Inquiry }> {
  const newInquiry: Inquiry = {
    id: `inq-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    ...inquiry,
    status: "New",
    priority: inquiry.priority || "Medium",
    createdAt: new Date().toISOString(),
  };

  // 1. Try Supabase first (primary for production / serverless)
  try {
    const dbPayload = {
      id: newInquiry.id,
      name: newInquiry.name,
      email: newInquiry.email,
      project_type: newInquiry.projectType,
      timeline: newInquiry.timeline,
      details: newInquiry.details,
      status: newInquiry.status,
      priority: newInquiry.priority,
      created_at: newInquiry.createdAt,
      notes: newInquiry.notes || null,
      estimated_budget: newInquiry.estimatedBudget || null,
    };

    const { data, error } = await supabase
      .from("inquiries")
      .insert([dbPayload])
      .select()
      .single();

    if (!error && data) {
      // Silently mirror to local file for dev if possible
      try {
        await addLocalInquiry(inquiry);
      } catch {}

      return {
        source: "supabase",
        inquiry: {
          id: data.id,
          name: data.name,
          email: data.email,
          projectType: data.project_type || data.projectType,
          timeline: data.timeline,
          details: data.details,
          status: data.status,
          priority: data.priority,
          createdAt: data.created_at,
          notes: data.notes,
          estimatedBudget: data.estimated_budget || data.estimatedBudget,
        },
      };
    } else if (error) {
      console.warn("Supabase insert inquiry error:", error);
    }
  } catch (err) {
    console.warn("Supabase insert inquiry error:", err);
  }

  // 2. Fallback to local store (for offline local development)
  try {
    const local = await addLocalInquiry(inquiry);
    return { source: "local", inquiry: local };
  } catch {
    return { source: "local", inquiry: newInquiry };
  }
}

export async function updateInquiry(
  id: string,
  updates: Partial<Omit<Inquiry, "id" | "createdAt">>
): Promise<{ source: "supabase" | "local"; inquiry: Inquiry | null }> {
  try {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.status) dbUpdates.status = updates.status;
    if (updates.priority) dbUpdates.priority = updates.priority;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
    if (updates.estimatedBudget !== undefined)
      dbUpdates.estimated_budget = updates.estimatedBudget;

    const { data, error } = await supabase
      .from("inquiries")
      .update(dbUpdates)
      .eq("id", id)
      .select()
      .single();

    if (!error && data) {
      try {
        await updateLocalInquiry(id, updates);
      } catch {}

      return {
        source: "supabase",
        inquiry: {
          id: data.id,
          name: data.name,
          email: data.email,
          projectType: data.project_type || data.projectType,
          timeline: data.timeline,
          details: data.details,
          status: data.status,
          priority: data.priority,
          createdAt: data.created_at,
          notes: data.notes,
          estimatedBudget: data.estimated_budget || data.estimatedBudget,
        },
      };
    }
  } catch (err) {
    console.warn("Supabase update inquiry error:", err);
  }

  const local = await updateLocalInquiry(id, updates);
  return { source: "local", inquiry: local };
}

export async function deleteInquiry(
  id: string
): Promise<{ source: "supabase" | "local"; success: boolean }> {
  try {
    const { error } = await supabase.from("inquiries").delete().eq("id", id);
    if (!error) {
      try {
        await deleteLocalInquiry(id);
      } catch {}
      return { source: "supabase", success: true };
    }
  } catch (err) {
    console.warn("Supabase delete inquiry error:", err);
  }

  const localSuccess = await deleteLocalInquiry(id);
  return { source: "local", success: localSuccess };
}

// =====================================================================
// SERVICES CRUD (SUPABASE WITH LOCAL FALLBACK)
// =====================================================================
export async function getServices(): Promise<{
  source: "supabase" | "local";
  services: Service[];
}> {
  try {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("number", { ascending: true });

    if (!error && Array.isArray(data)) {
      return {
        source: "supabase",
        services: data.map((row) => ({
          id: row.id,
          slug: row.slug,
          number: row.number,
          category: row.category,
          title: row.title,
          description: row.description,
          items: Array.isArray(row.items) ? row.items : [],
          bestFor: row.best_for || row.bestFor || "",
          stack: Array.isArray(row.stack) ? row.stack.join(" / ") : (row.stack || ""),
          timeline: row.timeline || row.turnaround,
          startingPrice: row.starting_price || row.startingPrice,
          cta: row.cta || row.cta_text || "Let's Talk ↗",
          href: row.href || "/contact",
          featured: row.featured,
        })),
      };
    }
  } catch (err) {
    console.warn("Supabase fetch services error:", err);
  }

  const local = await getLocalServices();
  return { source: "local", services: local };
}

export async function addService(
  service: Service
): Promise<{ source: "supabase" | "local"; service: Service }> {
  const local = await addLocalService(service);

  try {
    const dbPayload = {
      id: service.id,
      slug: service.slug,
      number: service.number,
      category: service.category,
      title: service.title,
      description: service.description,
      items: service.items,
      best_for: service.bestFor,
      stack: Array.isArray(service.stack)
        ? service.stack
        : typeof service.stack === "string"
        ? service.stack.split("/").map((x: string) => x.trim()).filter(Boolean)
        : [],
      turnaround: service.timeline || null,
      starting_price: service.startingPrice || null,
      cta_text: service.cta || "Let's Talk ↗",
      href: service.href || "/contact",
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("services")
      .upsert([dbPayload], { onConflict: "slug" })
      .select()
      .single();

    if (!error && data) {
      return { source: "supabase", service: local };
    }
  } catch (err) {
    console.warn("Supabase add service error:", err);
  }

  return { source: "local", service: local };
}

export async function updateService(
  service: Service
): Promise<{ source: "supabase" | "local"; service: Service }> {
  return addService(service);
}

export async function deleteService(
  slugOrId: string
): Promise<{ source: "supabase" | "local"; success: boolean }> {
  const localSuccess = await deleteLocalService(slugOrId);

  try {
    const { error } = await supabase
      .from("services")
      .delete()
      .or(`slug.eq.${slugOrId},id.eq.${slugOrId}`);

    if (!error) {
      return { source: "supabase", success: true };
    }
  } catch (err) {
    console.warn("Supabase delete service error:", err);
  }

  return { source: "local", success: localSuccess };
}

// =====================================================================
// SITE SETTINGS & ADMIN CONFIGURATION
// =====================================================================
export async function getSiteSettings(): Promise<{
  source: "supabase" | "local";
  settings: SiteSettings;
}> {
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("key, value");

    if (!error && Array.isArray(data) && data.length > 0) {
      const local = await getLocalSettings();
      const settingsMap: Record<string, string> = {};
      data.forEach((row) => {
        settingsMap[row.key] = row.value;
      });

      if (settingsMap["portfolio_settings"]) {
        try {
          const parsed = JSON.parse(settingsMap["portfolio_settings"]);
          return { source: "supabase", settings: { ...local, ...parsed } };
        } catch {
          // ignore
        }
      }
    }
  } catch (err) {
    console.warn("Supabase fetch settings error:", err);
  }

  const local = await getLocalSettings();
  return { source: "local", settings: local };
}

export async function saveSiteSettings(
  settings: Partial<SiteSettings>
): Promise<{ source: "supabase" | "local"; settings: SiteSettings }> {
  const local = await updateLocalSettings(settings);

  try {
    const rows = [
      {
        key: "portfolio_settings",
        value: JSON.stringify(local),
        updated_at: new Date().toISOString(),
      },
    ];

    if (settings.adminPassword) {
      rows.push({
        key: "admin_password",
        value: settings.adminPassword,
        updated_at: new Date().toISOString(),
      });
    }

    const { error } = await supabase
      .from("site_settings")
      .upsert(rows, { onConflict: "key" });

    if (!error) {
      return { source: "supabase", settings: local };
    }
  } catch (err) {
    console.warn("Supabase save settings error:", err);
  }

  return { source: "local", settings: local };
}

// =====================================================================
// RESOURCES CRUD (SUPABASE WITH LOCAL FALLBACK)
// =====================================================================
export async function getResources(): Promise<{
  source: "supabase" | "local";
  resources: Resource[];
}> {
  try {
    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && Array.isArray(data)) {
      return {
        source: "supabase",
        resources: data.map((row) => ({
          id: row.id,
          slug: row.slug,
          title: row.title,
          description: row.description,
          category: row.category,
          type: row.type,
          fileUrl: row.file_url || row.fileUrl,
          fileSize: row.file_size || row.fileSize,
          coverImage: row.cover_image || row.coverImage,
          tags: Array.isArray(row.tags) ? row.tags : [],
          downloadsCount: Number(row.downloads_count || row.downloadsCount || 0),
          featured: Boolean(row.featured),
          createdAt: row.created_at || row.createdAt,
          updatedAt: row.updated_at || row.updatedAt,
          externalLink: row.external_link || row.externalLink,
        })),
      };
    } else if (error) {
      console.warn("Supabase fetch resources error:", error);
    }
  } catch (err) {
    console.warn("Supabase fetch resources exception:", err);
  }

  const local = await getLocalResources();
  return { source: "local", resources: local };
}

export async function addResource(
  resource: Resource
): Promise<{ source: "supabase" | "local"; resource: Resource }> {
  try {
    const dbPayload = {
      id: resource.id,
      slug: resource.slug,
      title: resource.title,
      description: resource.description,
      category: resource.category,
      type: resource.type,
      file_url: resource.fileUrl,
      file_size: resource.fileSize || null,
      cover_image: resource.coverImage || null,
      tags: resource.tags,
      downloads_count: resource.downloadsCount || 0,
      featured: Boolean(resource.featured),
      created_at: resource.createdAt,
      updated_at: resource.updatedAt || new Date().toISOString(),
      external_link: resource.externalLink || null,
    };

    const { data, error } = await supabase
      .from("resources")
      .upsert([dbPayload], { onConflict: "slug" })
      .select()
      .single();

    if (!error && data) {
      try {
        await addLocalResource(resource);
      } catch {}

      return {
        source: "supabase",
        resource: {
          id: data.id,
          slug: data.slug,
          title: data.title,
          description: data.description,
          category: data.category,
          type: data.type,
          fileUrl: data.file_url || data.fileUrl,
          fileSize: data.file_size || data.fileSize,
          coverImage: data.cover_image || data.coverImage,
          tags: Array.isArray(data.tags) ? data.tags : [],
          downloadsCount: Number(data.downloads_count || 0),
          featured: Boolean(data.featured),
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          externalLink: data.external_link,
        },
      };
    } else if (error) {
      console.warn("Supabase add resource error:", error);
    }
  } catch (err) {
    console.warn("Supabase add resource exception:", err);
  }

  const local = await addLocalResource(resource);
  return { source: "local", resource: local };
}

export async function updateResource(
  id: string,
  updates: Partial<Resource>
): Promise<{ source: "supabase" | "local"; resource: Resource | null }> {
  try {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.title) dbUpdates.title = updates.title;
    if (updates.description) dbUpdates.description = updates.description;
    if (updates.category) dbUpdates.category = updates.category;
    if (updates.type) dbUpdates.type = updates.type;
    if (updates.fileUrl) dbUpdates.file_url = updates.fileUrl;
    if (updates.fileSize !== undefined) dbUpdates.file_size = updates.fileSize;
    if (updates.coverImage !== undefined) dbUpdates.cover_image = updates.coverImage;
    if (updates.tags) dbUpdates.tags = updates.tags;
    if (updates.downloadsCount !== undefined) dbUpdates.downloads_count = updates.downloadsCount;
    if (updates.featured !== undefined) dbUpdates.featured = updates.featured;
    if (updates.externalLink !== undefined) dbUpdates.external_link = updates.externalLink;
    dbUpdates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("resources")
      .update(dbUpdates)
      .or(`id.eq.${id},slug.eq.${id}`)
      .select()
      .single();

    if (!error && data) {
      try {
        await updateLocalResource(id, updates);
      } catch {}

      return {
        source: "supabase",
        resource: {
          id: data.id,
          slug: data.slug,
          title: data.title,
          description: data.description,
          category: data.category,
          type: data.type,
          fileUrl: data.file_url,
          fileSize: data.file_size,
          coverImage: data.cover_image,
          tags: Array.isArray(data.tags) ? data.tags : [],
          downloadsCount: Number(data.downloads_count || 0),
          featured: Boolean(data.featured),
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          externalLink: data.external_link,
        },
      };
    }
  } catch (err) {
    console.warn("Supabase update resource error:", err);
  }

  const local = await updateLocalResource(id, updates);
  return { source: "local", resource: local };
}

export async function deleteResource(
  id: string
): Promise<{ source: "supabase" | "local"; success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from("resources")
      .delete()
      .or(`id.eq.${id},slug.eq.${id}`);

    if (!error) {
      try {
        await deleteLocalResource(id);
      } catch {}
      return { source: "supabase", success: true };
    } else {
      console.warn("Supabase delete resource error:", error);
      // If Supabase table exists and returned error, report it
      if (error.code !== "PGRST205") {
        return { source: "supabase", success: false, error: error.message };
      }
    }
  } catch (err) {
    console.warn("Supabase delete resource exception:", err);
  }

  const localSuccess = await deleteLocalResource(id);
  return { source: "local", success: localSuccess };
}

// =====================================================================
// UPCOMING PROJECTS CRUD (SUPABASE WITH LOCAL FALLBACK)
// =====================================================================
type DbUpcomingRow = {
  id?: string;
  slug?: string;
  number?: string;
  title?: string;
  short_title?: string;
  shortTitle?: string;
  category?: string;
  status?: UpcomingProject["status"];
  target_release?: string;
  targetRelease?: string;
  progress?: number;
  priority?: UpcomingProject["priority"];
  headline?: string;
  description?: string;
  problem?: string;
  solution?: string;
  tech_stack?: string[];
  techStack?: string[];
  key_features?: string[];
  keyFeatures?: string[];
  architecture_highlights?: string[];
  architectureHighlights?: string[];
  deliverables?: string[];
  preview_type?: UpcomingProject["previewType"];
  previewType?: UpcomingProject["previewType"];
  waitlist_count?: number;
  waitlistCount?: number;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

function mapDbToUpcomingProject(row: DbUpcomingRow): UpcomingProject {
  return {
    id: row.id || `up-${Date.now()}`,
    slug: row.slug || "",
    number: row.number || "01",
    title: row.title || "",
    shortTitle: row.short_title || row.shortTitle || row.title || "",
    category: row.category || "AI Agents",
    status: row.status || "In Development",
    targetRelease: row.target_release || row.targetRelease || "Q1 2027",
    progress: typeof row.progress === "number" ? row.progress : 50,
    priority: row.priority || "High",
    headline: row.headline || row.title || "",
    description: row.description || "",
    problem: row.problem || "",
    solution: row.solution || "",
    techStack: Array.isArray(row.tech_stack)
      ? row.tech_stack
      : Array.isArray(row.techStack)
      ? row.techStack
      : [],
    keyFeatures: Array.isArray(row.key_features)
      ? row.key_features
      : Array.isArray(row.keyFeatures)
      ? row.keyFeatures
      : [],
    architectureHighlights: Array.isArray(row.architecture_highlights)
      ? row.architecture_highlights
      : Array.isArray(row.architectureHighlights)
      ? row.architectureHighlights
      : [],
    deliverables: Array.isArray(row.deliverables) ? row.deliverables : [],
    previewType: row.preview_type || row.previewType || "dashboard",
    waitlistCount: Number(row.waitlist_count || row.waitlistCount || 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapUpcomingProjectToDb(proj: UpcomingProject): Record<string, unknown> {
  return {
    id: proj.id,
    slug: proj.slug,
    number: proj.number,
    title: proj.title,
    short_title: proj.shortTitle,
    category: proj.category,
    status: proj.status,
    target_release: proj.targetRelease,
    progress: proj.progress,
    priority: proj.priority,
    headline: proj.headline,
    description: proj.description,
    problem: proj.problem,
    solution: proj.solution,
    tech_stack: proj.techStack,
    key_features: proj.keyFeatures,
    architecture_highlights: proj.architectureHighlights,
    deliverables: proj.deliverables,
    preview_type: proj.previewType || "dashboard",
    waitlist_count: proj.waitlistCount || 0,
    created_at: proj.createdAt || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export async function getUpcomingProjects(): Promise<{
  source: "supabase" | "local";
  upcomingProjects: UpcomingProject[];
}> {
  try {
    const { data, error } = await supabase
      .from("upcoming_projects")
      .select("*")
      .order("number", { ascending: true });

    if (!error && Array.isArray(data) && data.length > 0) {
      return {
        source: "supabase",
        upcomingProjects: data.map(mapDbToUpcomingProject),
      };
    } else if (error) {
      console.warn("Supabase fetch upcoming projects error:", error);
    }
  } catch (err) {
    console.warn("Supabase fetch upcoming projects exception:", err);
  }

  const local = await getLocalUpcomingProjects();
  return { source: "local", upcomingProjects: local };
}

export async function addUpcomingProject(
  project: UpcomingProject
): Promise<{ source: "supabase" | "local"; upcomingProject: UpcomingProject }> {
  try {
    const dbPayload = mapUpcomingProjectToDb(project);
    const { data, error } = await supabase
      .from("upcoming_projects")
      .upsert([dbPayload], { onConflict: "slug" })
      .select()
      .single();

    if (!error && data) {
      try {
        await addLocalUpcomingProject(project);
      } catch {}

      return {
        source: "supabase",
        upcomingProject: mapDbToUpcomingProject(data),
      };
    } else if (error) {
      console.warn("Supabase add upcoming project error:", error);
    }
  } catch (err) {
    console.warn("Supabase add upcoming project exception:", err);
  }

  const local = await addLocalUpcomingProject(project);
  return { source: "local", upcomingProject: local };
}

export async function updateUpcomingProject(
  idOrSlug: string,
  updates: Partial<UpcomingProject>
): Promise<{ source: "supabase" | "local"; upcomingProject: UpcomingProject | null }> {
  try {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.shortTitle !== undefined) dbUpdates.short_title = updates.shortTitle;
    if (updates.number !== undefined) dbUpdates.number = updates.number;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.targetRelease !== undefined) dbUpdates.target_release = updates.targetRelease;
    if (updates.progress !== undefined) dbUpdates.progress = updates.progress;
    if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
    if (updates.headline !== undefined) dbUpdates.headline = updates.headline;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.problem !== undefined) dbUpdates.problem = updates.problem;
    if (updates.solution !== undefined) dbUpdates.solution = updates.solution;
    if (updates.techStack !== undefined) dbUpdates.tech_stack = updates.techStack;
    if (updates.keyFeatures !== undefined) dbUpdates.key_features = updates.keyFeatures;
    if (updates.architectureHighlights !== undefined)
      dbUpdates.architecture_highlights = updates.architectureHighlights;
    if (updates.deliverables !== undefined) dbUpdates.deliverables = updates.deliverables;
    if (updates.previewType !== undefined) dbUpdates.preview_type = updates.previewType;
    if (updates.waitlistCount !== undefined) dbUpdates.waitlist_count = updates.waitlistCount;
    dbUpdates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("upcoming_projects")
      .update(dbUpdates)
      .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
      .select()
      .single();

    if (!error && data) {
      try {
        await updateLocalUpcomingProject(idOrSlug, updates);
      } catch {}

      return {
        source: "supabase",
        upcomingProject: mapDbToUpcomingProject(data),
      };
    }
  } catch (err) {
    console.warn("Supabase update upcoming project exception:", err);
  }

  const local = await updateLocalUpcomingProject(idOrSlug, updates);
  return { source: "local", upcomingProject: local };
}

export async function deleteUpcomingProject(
  idOrSlug: string
): Promise<{ source: "supabase" | "local"; success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from("upcoming_projects")
      .delete()
      .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`);

    if (!error) {
      try {
        await deleteLocalUpcomingProject(idOrSlug);
      } catch {}
      return { source: "supabase", success: true };
    } else {
      console.warn("Supabase delete upcoming project error:", error);
      if (error.code !== "PGRST205") {
        return { source: "supabase", success: false, error: error.message };
      }
    }
  } catch (err) {
    console.warn("Supabase delete upcoming project exception:", err);
  }

  const localSuccess = await deleteLocalUpcomingProject(idOrSlug);
  return { source: "local", success: localSuccess };
}


