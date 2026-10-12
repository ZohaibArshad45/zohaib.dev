import type { Metadata } from "next";
import ProcessClient from "@/components/Process/ProcessClient";
import { getSiteSettings } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Engineering Process & Blueprint • Zohaib",
  description:
    "Explore the 4-phase agile engineering workflow from kickoff and architecture to live deployment, async sprint updates, and seamless handover by Zohaib.",
  openGraph: {
    title: "Engineering Process & Blueprint • Zohaib",
    description:
      "Explore the 4-phase agile engineering workflow from kickoff and architecture to live deployment, async sprint updates, and seamless handover by Zohaib.",
    url: "https://zohaib.dev/process",
  },
};

export const dynamic = "force-dynamic";

export default async function ProcessPage() {
  const { settings } = await getSiteSettings();

  return <ProcessClient settings={settings} />;
}
