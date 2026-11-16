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
      id="top"
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--text)",
        fontFamily: "inherit",
      }}
    >
      <Hero settings={settings} />
      <ProjectsSection projects={projects} />
      <WorkingTogether />
      <ContactSection settings={settings} />
    </main>
  );
}
