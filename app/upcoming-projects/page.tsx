import { Metadata } from "next";
import UpcomingClient from "@/components/Upcoming/UpcomingClient";
import { getUpcomingProjects } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Upcoming AI Projects & R&D Lab | Zohaib • AI SaaS Developer",
  description:
    "Explore upcoming AI systems, autonomous voice SDRs, enterprise MCP server hubs, and n8n automations currently in development.",
};

export default async function UpcomingProjectsPage() {
  const { upcomingProjects } = await getUpcomingProjects();

  return <UpcomingClient initialUpcomingProjects={upcomingProjects} />;
}
