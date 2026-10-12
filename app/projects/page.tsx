import type { Metadata } from "next";
import ProjectsClient from "@/components/Projects/ProjectsClient";
import { getProjects } from "@/lib/supabase";
import { getCategories } from "@/lib/categoriesStore";

export const metadata: Metadata = {
  title: "Projects & Case Studies | Zohaib - Web Developer & AI Builder",
  description:
    "Explore production web applications, AI systems, internal tools, and automation workflows engineered by Zohaib. View live previews, architecture breakdowns, and outcomes.",
};

export default async function ProjectsPage() {
  const [{ projects }, categories] = await Promise.all([
    getProjects(),
    getCategories(),
  ]);

  return (
    <ProjectsClient
      initialProjects={projects}
      initialCategories={categories}
    />
  );
}
