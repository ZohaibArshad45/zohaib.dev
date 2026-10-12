import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectDetailClient from "@/components/Projects/ProjectDetailClient";
import { getProjects } from "@/lib/supabase";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const { projects } = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { projects } = await getProjects();
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: "Project Not Found | Zohaib",
    };
  }

  return {
    title: `${project.title} | Case Study - Zohaib`,
    description: project.description,
  };
}

export const dynamic = "force-dynamic";

export default async function ProjectCaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const { projects } = await getProjects();
  const currentIndex = projects.findIndex((p) => p.slug === slug);
  const project = currentIndex !== -1 ? projects[currentIndex] : undefined;

  if (!project) {
    notFound();
  }

  const nextProject =
    projects.length > 1
      ? projects[(currentIndex + 1) % projects.length]
      : undefined;

  return (
    <ProjectDetailClient
      project={project}
      nextProject={nextProject}
    />
  );
}
