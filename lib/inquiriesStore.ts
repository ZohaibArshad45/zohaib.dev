import fs from "fs/promises";
import path from "path";

export type InquiryStatus = "New" | "Contacted" | "In Progress" | "Closed Won" | "Archived";
export type PriorityLevel = "High" | "Medium" | "Low";

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  projectType: "Web App" | "AI Agents & Features" | "Automation & Integrations" | "Other";
  timeline: "ASAP" | "1 to 2 months" | "2 to 3 months" | "Flexible";
  details: string;
  status: InquiryStatus;
  priority: PriorityLevel;
  createdAt: string;
  notes?: string;
  estimatedBudget?: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const INQUIRIES_FILE = path.join(DATA_DIR, "inquiries.json");

async function ensureDataFile(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(INQUIRIES_FILE);
    } catch {
      await fs.writeFile(
        INQUIRIES_FILE,
        JSON.stringify([], null, 2),
        "utf-8"
      );
    }
  } catch (err) {
    console.error("Error creating inquiries data directory:", err);
  }
}

export async function getInquiries(): Promise<Inquiry[]> {
  await ensureDataFile();
  try {
    const raw = await fs.readFile(INQUIRIES_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to read inquiries file:", err);
    return [];
  }
}

export async function addInquiry(
  data: Omit<Inquiry, "id" | "createdAt" | "status" | "priority"> & {
    priority?: PriorityLevel;
    estimatedBudget?: string;
  }
): Promise<Inquiry> {
  await ensureDataFile();
  const inquiries = await getInquiries();
  const newInquiry: Inquiry = {
    id: `inq-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    ...data,
    status: "New",
    priority: data.priority || "Medium",
    createdAt: new Date().toISOString(),
  };

  inquiries.unshift(newInquiry);
  await fs.writeFile(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2), "utf-8");
  return newInquiry;
}

export async function updateInquiry(
  id: string,
  updates: Partial<Omit<Inquiry, "id" | "createdAt">>
): Promise<Inquiry | null> {
  await ensureDataFile();
  const inquiries = await getInquiries();
  const index = inquiries.findIndex((inq) => inq.id === id);
  if (index === -1) return null;

  inquiries[index] = {
    ...inquiries[index],
    ...updates,
  };

  await fs.writeFile(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2), "utf-8");
  return inquiries[index];
}

export async function deleteInquiry(id: string): Promise<boolean> {
  await ensureDataFile();
  const inquiries = await getInquiries();
  const filtered = inquiries.filter((inq) => inq.id !== id);
  if (filtered.length === inquiries.length) return false;

  await fs.writeFile(INQUIRIES_FILE, JSON.stringify(filtered, null, 2), "utf-8");
  return true;
}
