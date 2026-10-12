import { createClient } from "@supabase/supabase-js";
import type { Project } from "./projects";
import type { Inquiry } from "./inquiriesStore";
import type { Service } from "./services";
import {
  getLocalProjects,
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
  updateLocalService,
  deleteLocalService,
} from "./servicesStore";
import {
  getLocalSettings,
  updateLocalSettings,
  type SiteSettings,
} from "./settingsStore";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "https://mzsvmxdeyrxiddbwjctt.supabase.co";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "sb_publishable_p2aqeeQBWR_oYMOKNAAg0Q_zzawtR5R";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// =====================================================================
// DATA CONVERSION HELPERS
// =====================================================================
function mapDbToProject(row: any): Project {
  return {
    slug: row.slug,
    number: row.number,
    title: row.title,
    shortTitle: row.short_title || row.shortTitle || row.title,
    status: row.status,
    categories: Array.isArray(row.categories) ? row.categories : [],
    headline: row.headline,
    subhead: row.subhead,
    description: row.description,
    outcome: row.outcome,
    tags: Array.isArray(row.tags) ? row.tags : [],
    images: Array.isArray(row.images) ? row.images : [],
    previewType: row.preview_type || row.previewType || "dashboard",
    client: row.client,
    role: row.role,
    timeline: row.timeline,
    deliverables: Array.isArray(row.deliverables) ? row.deliverables : [],
    problem: row.problem,
    solution: row.solution,
    architectureHighlights: Array.isArray(row.architecture_highlights)
      ? row.architecture_highlights
      : row.architectureHighlights || [],
    metrics: Array.isArray(row.metrics) ? row.metrics : [],
    demoUrl: row.demo_url || row.demoUrl,
    githubUrl: row.github_url || row.githubUrl,
  };
}

function mapProjectToDb(proj: Project): any {
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
    images: proj.images || [],
    preview_type: proj.previewType,
    client: proj.client,
    role: proj.role,
    timeline: proj.timeline,
    deliverables: proj.deliverables,
    problem: proj.problem,
    solution: proj.solution,
    architecture_highlights: proj.architectureHighlights,
    metrics: proj.metrics,
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
      return {
        source: "supabase",
        projects: data.map(mapDbToProject),
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
    const { data, error } = await supabase
      .from("projects")
      .insert([dbPayload])
      .select()
      .single();

    if (!error && data) {
      return { source: "supabase", project: mapDbToProject(data) };
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
    const dbUpdates: any = {};
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

    const { data, error } = await supabase
      .from("projects")
      .update(dbUpdates)
      .eq("slug", slug)
      .select()
      .single();

    if (!error && data) {
      return { source: "supabase", project: mapDbToProject(data) };
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

    if (!error && Array.isArray(data) && data.length > 0) {
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
  const local = await addLocalInquiry(inquiry);

  try {
    const dbPayload = {
      id: local.id,
      name: local.name,
      email: local.email,
      project_type: local.projectType,
      timeline: local.timeline,
      details: local.details,
      status: local.status,
      priority: local.priority,
      created_at: local.createdAt,
      notes: local.notes || null,
      estimated_budget: local.estimatedBudget || null,
    };

    const { data, error } = await supabase
      .from("inquiries")
      .insert([dbPayload])
      .select()
      .single();

    if (!error && data) {
      return { source: "supabase", inquiry: local };
    }
  } catch (err) {
    console.warn("Supabase insert inquiry error:", err);
  }

  return { source: "local", inquiry: local };
}

export async function updateInquiry(
  id: string,
  updates: Partial<Omit<Inquiry, "id" | "createdAt">>
): Promise<{ source: "supabase" | "local"; inquiry: Inquiry | null }> {
  const local = await updateLocalInquiry(id, updates);

  try {
    const dbUpdates: any = {};
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
      return { source: "supabase", inquiry: local };
    }
  } catch (err) {
    console.warn("Supabase update inquiry error:", err);
  }

  return { source: "local", inquiry: local };
}

export async function deleteInquiry(
  id: string
): Promise<{ source: "supabase" | "local"; success: boolean }> {
  const localSuccess = await deleteLocalInquiry(id);

  try {
    const { error } = await supabase.from("inquiries").delete().eq("id", id);
    if (!error) {
      return { source: "supabase", success: true };
    }
  } catch (err) {
    console.warn("Supabase delete inquiry error:", err);
  }

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
          stack: row.stack || "",
          timeline: row.timeline,
          startingPrice: row.starting_price || row.startingPrice,
          cta: row.cta || "Let's Talk ↗",
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
      stack: service.stack,
      timeline: service.timeline || null,
      starting_price: service.startingPrice || null,
      cta: service.cta,
      href: service.href,
      featured: service.featured || false,
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

