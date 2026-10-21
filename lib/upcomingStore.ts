import fs from "fs/promises";
import path from "path";
import { UpcomingProject, INITIAL_UPCOMING_PROJECTS } from "./upcoming";

const DATA_DIR = path.join(process.cwd(), "data");
const UPCOMING_FILE = path.join(DATA_DIR, "upcoming.json");

async function ensureDataFile(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(UPCOMING_FILE);
    } catch {
      await fs.writeFile(
        UPCOMING_FILE,
        JSON.stringify(INITIAL_UPCOMING_PROJECTS, null, 2),
        "utf-8"
      );
    }
  } catch (err) {
    console.warn("Could not ensure upcoming data file (expected on read-only serverless):", err);
  }
}

export async function getLocalUpcomingProjects(): Promise<UpcomingProject[]> {
  await ensureDataFile();
  try {
    const raw = await fs.readFile(UPCOMING_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return INITIAL_UPCOMING_PROJECTS;
  } catch (err) {
    console.warn("Failed to read upcoming projects file, returning initial list:", err);
    return INITIAL_UPCOMING_PROJECTS;
  }
}

export async function saveLocalUpcomingProjects(
  projects: UpcomingProject[]
): Promise<void> {
  await ensureDataFile();
  try {
    await fs.writeFile(
      UPCOMING_FILE,
      JSON.stringify(projects, null, 2),
      "utf-8"
    );
  } catch (fsErr) {
    console.warn(
      "Could not write local upcoming.json (expected in read-only serverless):",
      fsErr
    );
  }
}

export async function addLocalUpcomingProject(
  project: UpcomingProject
): Promise<UpcomingProject> {
  await ensureDataFile();
  const projects = await getLocalUpcomingProjects();
  const exists = projects.find(
    (p) => p.slug === project.slug || p.id === project.id
  );
  if (exists) {
    return updateLocalUpcomingProject(project.id, project) as Promise<UpcomingProject>;
  }

  projects.unshift(project);
  await saveLocalUpcomingProjects(projects);
  return project;
}

export async function updateLocalUpcomingProject(
  idOrSlug: string,
  updates: Partial<UpcomingProject>
): Promise<UpcomingProject | null> {
  await ensureDataFile();
  const projects = await getLocalUpcomingProjects();
  const index = projects.findIndex(
    (p) => p.id === idOrSlug || p.slug === idOrSlug
  );
  if (index === -1) return null;

  projects[index] = {
    ...projects[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  await saveLocalUpcomingProjects(projects);
  return projects[index];
}

export async function deleteLocalUpcomingProject(
  idOrSlug: string
): Promise<boolean> {
  await ensureDataFile();
  const projects = await getLocalUpcomingProjects();
  const filtered = projects.filter(
    (p) => p.id !== idOrSlug && p.slug !== idOrSlug
  );
  if (filtered.length === projects.length) return false;

  await saveLocalUpcomingProjects(filtered);
  return true;
}
