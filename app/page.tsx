import ContactSection from "@/components/MainPage/ContactSection";
import Hero from "@/components/MainPage/Hero";
import ProjectsSection from "@/components/MainPage/ProjectsSection";
import ServicesSection from "@/components/MainPage/ServicesSection";
import WorkingTogether from "@/components/MainPage/WorkingTogether";
import { Suspense } from "react";


export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0c0e0d",
        color: "#f5f5f5",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}>
      
      <Hero/>

      <ProjectsSection/>
      <ServicesSection/>
      <WorkingTogether/>
            <Suspense
        fallback={
          <section
            style={{
              minHeight: "500px",
              background: "#0c0e0d",
            }}
          />
        }
      >
        <ContactSection />
      </Suspense>
    </main>
  );
}