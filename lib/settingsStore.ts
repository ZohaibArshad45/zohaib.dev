import fs from "fs/promises";
import path from "path";
import { DEFAULT_SETTINGS, type SiteSettings } from "./settings";

export { DEFAULT_SETTINGS, type SiteSettings };

const DATA_DIR = path.join(process.cwd(), "data");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");

async function ensureDataFile(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(SETTINGS_FILE);
    } catch {
      await fs.writeFile(
        SETTINGS_FILE,
        JSON.stringify(DEFAULT_SETTINGS, null, 2),
        "utf8"
      );
    }
  } catch (err) {
    console.error("Failed to ensure settings file:", err);
  }
}

export async function getLocalSettings(): Promise<SiteSettings> {
  await ensureDataFile();
  try {
    const raw = await fs.readFile(SETTINGS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch (err) {
    console.warn("Error reading settings.json, returning defaults:", err);
    return { ...DEFAULT_SETTINGS };
  }
}

export async function updateLocalSettings(
  updates: Partial<SiteSettings>
): Promise<SiteSettings> {
  await ensureDataFile();
  const current = await getLocalSettings();
  const updated = { ...current, ...updates };

  try {
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(updated, null, 2), "utf8");
  } catch (fsErr) {
    console.warn("Could not write local settings.json (expected in read-only serverless):", fsErr);
  }
  return updated;
}
