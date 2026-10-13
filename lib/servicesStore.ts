import fs from "fs/promises";
import path from "path";
import { Service, INITIAL_SERVICES } from "./services";

const DATA_DIR = path.join(process.cwd(), "data");
const SERVICES_FILE = path.join(DATA_DIR, "services.json");

async function ensureDataFile(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(SERVICES_FILE);
    } catch {
      await fs.writeFile(
        SERVICES_FILE,
        JSON.stringify(INITIAL_SERVICES, null, 2),
        "utf-8"
      );
    }
  } catch (err) {
    console.error("Error creating services data directory:", err);
  }
}

export async function getLocalServices(): Promise<Service[]> {
  await ensureDataFile();
  try {
    const raw = await fs.readFile(SERVICES_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to read services file:", err);
    return INITIAL_SERVICES;
  }
}

export async function addLocalService(service: Service): Promise<Service> {
  await ensureDataFile();
  const services = await getLocalServices();
  const exists = services.find((s) => s.slug === service.slug || s.id === service.id);
  if (exists) {
    return updateLocalService(service);
  }
  services.push(service);
  try {
    await fs.writeFile(SERVICES_FILE, JSON.stringify(services, null, 2), "utf-8");
  } catch (fsErr) {
    console.warn("Could not write local services.json (expected in read-only serverless):", fsErr);
  }
  return service;
}

export async function updateLocalService(service: Service): Promise<Service> {
  await ensureDataFile();
  const services = await getLocalServices();
  const index = services.findIndex((s) => s.id === service.id || s.slug === service.slug);
  if (index === -1) {
    services.push(service);
  } else {
    services[index] = { ...services[index], ...service };
  }
  try {
    await fs.writeFile(SERVICES_FILE, JSON.stringify(services, null, 2), "utf-8");
  } catch (fsErr) {
    console.warn("Could not write local services.json (expected in read-only serverless):", fsErr);
  }
  return service;
}

export async function deleteLocalService(slugOrId: string): Promise<boolean> {
  await ensureDataFile();
  const services = await getLocalServices();
  const filtered = services.filter((s) => s.slug !== slugOrId && s.id !== slugOrId);
  if (filtered.length === services.length) return false;
  try {
    await fs.writeFile(SERVICES_FILE, JSON.stringify(filtered, null, 2), "utf-8");
  } catch (fsErr) {
    console.warn("Could not write local services.json (expected in read-only serverless):", fsErr);
  }
  return true;
}
