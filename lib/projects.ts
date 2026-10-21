export type ProjectCategory = string;

export type ProjectMetric = {
  label: string;
  value: string;
};

export type Project = {
  slug: string;
  number: string;
  title: string;
  shortTitle: string;
  status: string;
  categories: ProjectCategory[];
  headline: string;
  subhead: string;
  description: string;
  outcome: string;
  tags: string[];
  images?: string[];
  previewType?: "inbox" | "automation" | "dashboard" | "outreach" | "code" | "support" | "image";
  client: string;
  role: string;
  timeline: string;
  deliverables: string[];
  problem: string;
  solution: string;
  architectureHighlights: string[];
  metrics: ProjectMetric[];
  features?: string[];
  demoUrl?: string;
  githubUrl?: string;
};

// No hardcoded demo projects - all project data comes strictly from the database / CMS
export const PROJECTS: Project[] = [];
