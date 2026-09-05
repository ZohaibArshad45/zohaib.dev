import Navbar from "@/components/MainPage/Navbar";
import ProjectsSection from "@/components/MainPage/ProjectsSection";
import ServicesSection from "@/components/MainPage/ServicesSection";

export default function Home() {
  return (
    <>
      <Navbar />

      <ProjectsSection/>
      <ServicesSection/>
    </>
  );
}