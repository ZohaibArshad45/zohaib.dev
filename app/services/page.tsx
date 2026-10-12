import type { Metadata } from "next";
import { getServices } from "@/lib/supabase";
import ServicesClient from "@/components/Services/ServicesClient";

export const metadata: Metadata = {
  title: "Services & Capabilities • Zohaib",
  description:
    "Explore full-stack web application development, AI autonomous agents, workflow automation, and MVP engineering services by Zohaib.",
  openGraph: {
    title: "Services & Capabilities • Zohaib",
    description:
      "Explore full-stack web development, AI autonomous agents, workflow automation, and MVP engineering services by Zohaib.",
    url: "https://zohaib.dev/services",
  },
};

export default async function ServicesPage() {
  const { services } = await getServices();

  return <ServicesClient initialServices={services} />;
}
