import type { Metadata } from "next";
import ResourcesClient from "@/components/Resources/ResourcesClient";
import { getResources } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Free Developer Resources, Code & PDF Guides • Zohaib",
  description:
    "Download free production starters, architecture blueprints, PDF engineering guides, and AI agent templates by Zohaib. 100% free for developers.",
  openGraph: {
    title: "Free Developer Resources, Code & PDF Guides • Zohaib",
    description:
      "Download free production starters, architecture blueprints, PDF engineering guides, and AI agent templates by Zohaib.",
    url: "https://zohaib.dev/resources",
  },
};

export default async function ResourcesPage() {
  const { resources } = await getResources();

  return <ResourcesClient initialResources={resources} />;
}
