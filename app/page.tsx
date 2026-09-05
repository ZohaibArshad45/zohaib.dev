import ContactSection from "@/components/MainPage/ContactSection";
import Navbar from "@/components/MainPage/Navbar";
import ProjectsSection from "@/components/MainPage/ProjectsSection";
import ServicesSection from "@/components/MainPage/ServicesSection";
import WorkingTogether from "@/components/MainPage/WorkingTogether";

export default function Home() {
  return (
    <>
      <Navbar />

      <ProjectsSection/>
      <ServicesSection/>
      <WorkingTogether/>
      <ContactSection/>
    </>
  );
}