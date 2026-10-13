import fs from "fs/promises";
import path from "path";
import { supabase } from "./supabase";

const DATA_DIR = path.join(process.cwd(), "data");
const CATEGORIES_FILE = path.join(DATA_DIR, "categories.json");

const DEFAULT_CATEGORIES = [
  "Web Apps",
  "AI Systems",
  "Automation & Workflows",
  "Internal Tools",
];

async function ensureCategoriesFile(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(CATEGORIES_FILE);
    } catch {
      await fs.writeFile(
        CATEGORIES_FILE,
        JSON.stringify(DEFAULT_CATEGORIES, null, 2),
        "utf-8"
      );
    }
  } catch (err) {
    console.error("Error creating categories file:", err);
  }
}

export async function getCategories(): Promise<string[]> {
  // Try Supabase first
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("name")
      .order("name", { ascending: true });

    if (!error && Array.isArray(data) && data.length > 0) {
      return data.map((d: { name: string }) => d.name);
    }
  } catch {
    // fallback
  }

  // Fallback to local
  await ensureCategoriesFile();
  try {
    const raw = await fs.readFile(CATEGORIES_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

export async function addCategory(name: string): Promise<string[]> {
  const trimmed = name.trim();
  if (!trimmed) return await getCategories();

  // Try Supabase
  try {
    await supabase.from("categories").insert([{ name: trimmed }]);
  } catch {
    // fallback
  }

  // Save local
  const current = await getCategories();
  if (!current.includes(trimmed)) {
    current.push(trimmed);
  }
  await ensureCategoriesFile();
  await fs.writeFile(CATEGORIES_FILE, JSON.stringify(current, null, 2), "utf-8");
  return current;
}

export async function deleteCategory(name: string): Promise<string[]> {
  const trimmed = name.trim();

  // Try Supabase
  try {
    await supabase.from("categories").delete().eq("name", trimmed);
  } catch {
    // fallback
  }

  // Local
  const current = await getCategories();
  const updated = current.filter((c) => c !== trimmed);
  await ensureCategoriesFile();
  await fs.writeFile(CATEGORIES_FILE, JSON.stringify(updated, null, 2), "utf-8");
  return updated;
}
