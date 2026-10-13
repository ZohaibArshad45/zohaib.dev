import fs from "fs/promises";
import path from "path";
import { Resource, INITIAL_RESOURCES } from "./resources";

const DATA_DIR = path.join(process.cwd(), "data");
const RESOURCES_FILE = path.join(DATA_DIR, "resources.json");

async function ensureDataFile(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(RESOURCES_FILE);
    } catch {
      await fs.writeFile(
        RESOURCES_FILE,
        JSON.stringify(INITIAL_RESOURCES, null, 2),
        "utf-8"
      );
    }
  } catch (err) {
    console.warn("Could not ensure resources data file (expected on read-only serverless):", err);
  }
}

export async function getLocalResources(): Promise<Resource[]> {
  await ensureDataFile();
  try {
    const raw = await fs.readFile(RESOURCES_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_RESOURCES;
  } catch (err) {
    console.warn("Failed to read resources file, returning initial resources:", err);
    return INITIAL_RESOURCES;
  }
}

export async function addLocalResource(resource: Resource): Promise<Resource> {
  await ensureDataFile();
  const resources = await getLocalResources();
  const exists = resources.find((r) => r.slug === resource.slug || r.id === resource.id);
  if (exists) {
    return updateLocalResource(resource.id, resource) as Promise<Resource>;
  }

  resources.unshift(resource);
  try {
    await fs.writeFile(RESOURCES_FILE, JSON.stringify(resources, null, 2), "utf-8");
  } catch (fsErr) {
    console.warn("Could not write local resources.json (expected in read-only serverless):", fsErr);
  }
  return resource;
}

export async function updateLocalResource(
  id: string,
  updates: Partial<Resource>
): Promise<Resource | null> {
  await ensureDataFile();
  const resources = await getLocalResources();
  const index = resources.findIndex((r) => r.id === id || r.slug === id);
  if (index === -1) return null;

  resources[index] = {
    ...resources[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  try {
    await fs.writeFile(RESOURCES_FILE, JSON.stringify(resources, null, 2), "utf-8");
  } catch (fsErr) {
    console.warn("Could not write local resources.json (expected in read-only serverless):", fsErr);
  }
  return resources[index];
}

export async function deleteLocalResource(id: string): Promise<boolean> {
  await ensureDataFile();
  const resources = await getLocalResources();
  const filtered = resources.filter((r) => r.id !== id && r.slug !== id);
  if (filtered.length === resources.length) return false;

  try {
    await fs.writeFile(RESOURCES_FILE, JSON.stringify(filtered, null, 2), "utf-8");
  } catch (fsErr) {
    console.warn("Could not write local resources.json (expected in read-only serverless):", fsErr);
  }
  return true;
}
