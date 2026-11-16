import ContactSection from "@/components/MainPage/ContactSection";
import Hero from "@/components/MainPage/Hero";
import ProjectsSection from "@/components/MainPage/ProjectsSection";
import WorkingTogether from "@/components/MainPage/WorkingTogether";
import { getProjects, getSiteSettings } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [{ settings }, { projects }] = await Promise.all([
    getSiteSettings(),
    getProjects(),
  ]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0c0e0d",
        color: "#f5f5f5",
        fontFamily: "inherit",
      }}
    >
      <Hero settings={settings} />
      <ProjectsSection projects={projects} />
      <WorkingTogether settings={settings} />
      <ContactSection settings={settings} />
    </main>
  );
}
