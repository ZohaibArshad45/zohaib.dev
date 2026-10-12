import ContactSection from "@/components/MainPage/ContactSection";
import Hero from "@/components/MainPage/Hero";
import ProjectsSection from "@/components/MainPage/ProjectsSection";
import ServicesSection from "@/components/MainPage/ServicesSection";
import WorkingTogether from "@/components/MainPage/WorkingTogether";
import { getProjects, getServices, getSiteSettings } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [
    { settings },
    { projects },
    { services },
  ] = await Promise.all([
    getSiteSettings(),
    getProjects(),
    getServices(),
  ]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0c0e0d",
        color: "#f5f5f5",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <Hero settings={settings} />
      <ProjectsSection projects={projects} />
      <ServicesSection services={services} />
      <WorkingTogether settings={settings} />
      <ContactSection settings={settings} />
    </main>
  );
}