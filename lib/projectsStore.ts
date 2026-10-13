import fs from "fs/promises";
import path from "path";
import { PROJECTS as DEFAULT_PROJECTS, type Project } from "./projects";

const DATA_DIR = path.join(process.cwd(), "data");
const PROJECTS_FILE = path.join(DATA_DIR, "projects.json");

async function ensureProjectsFile(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(PROJECTS_FILE);
    } catch {
      await fs.writeFile(
        PROJECTS_FILE,
        JSON.stringify(DEFAULT_PROJECTS, null, 2),
        "utf-8"
      );
    }
  } catch (err) {
    console.error("Error creating projects data file:", err);
  }
}

export async function getLocalProjects(): Promise<Project[]> {
  await ensureProjectsFile();
  try {
    const raw = await fs.readFile(PROJECTS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to read local projects:", err);
    return DEFAULT_PROJECTS;
  }
}

export async function saveLocalProjects(projects: Project[]): Promise<void> {
  await ensureProjectsFile();
  try {
    await fs.writeFile(PROJECTS_FILE, JSON.stringify(projects, null, 2), "utf-8");
  } catch (fsErr) {
    console.warn("Could not write local projects.json (expected in read-only serverless):", fsErr);
  }
}

export async function addLocalProject(project: Project): Promise<Project> {
  const projects = await getLocalProjects();
  // Filter out any existing with same slug
  const updated = [project, ...projects.filter((p) => p.slug !== project.slug)];
  await saveLocalProjects(updated);
  return project;
}

export async function updateLocalProject(
  slug: string,
  updates: Partial<Project>
): Promise<Project | null> {
  const projects = await getLocalProjects();
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) return null;

  projects[index] = {
    ...projects[index],
    ...updates,
  };

  await saveLocalProjects(projects);
  return projects[index];
}

export async function deleteLocalProject(slug: string): Promise<boolean> {
  const projects = await getLocalProjects();
  const filtered = projects.filter((p) => p.slug !== slug);
  if (filtered.length === projects.length) return false;

  await saveLocalProjects(filtered);
  return true;
}
